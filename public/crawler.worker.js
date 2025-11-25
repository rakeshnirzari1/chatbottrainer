const MAX_DEPTH = 6;
const MAX_URLS = 1000;

class WebCrawler {
  constructor() {
    this.discovered = new Set();
    this.visited = new Set();
    this.queue = [];
    this.disallowedPaths = [];
    this.baseUrl = '';
    this.baseDomain = '';
  }

  normalizeUrl(url, baseUrl) {
    try {
      const normalized = new URL(url, baseUrl);
      normalized.hash = '';
      if (normalized.pathname.endsWith('/') && normalized.pathname.length > 1) {
        normalized.pathname = normalized.pathname.slice(0, -1);
      }
      return normalized.href;
    } catch {
      return null;
    }
  }

  isSameDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === this.baseDomain;
    } catch {
      return false;
    }
  }

  shouldSkipUrl(url) {
    const lower = url.toLowerCase();
    const skipExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.zip', '.exe', '.dmg',
                           '.mp4', '.mp3', '.avi', '.mov', '.doc', '.docx', '.xls', '.xlsx',
                           '.ppt', '.pptx', '.svg', '.ico', '.webp'];

    if (skipExtensions.some(ext => lower.includes(ext))) return true;

    if (lower.includes('mailto:') || lower.includes('tel:') || lower.includes('javascript:')) {
      return true;
    }

    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;

      for (const disallowed of this.disallowedPaths) {
        if (path.startsWith(disallowed)) {
          return true;
        }
      }
    } catch {}

    return false;
  }

  async fetchRobotsTxt() {
    try {
      self.postMessage({ type: 'log', message: 'Fetching robots.txt...' });
      const robotsUrl = new URL('/robots.txt', this.baseUrl).href;
      const response = await fetch(robotsUrl, {
        mode: 'cors',
        headers: { 'Accept': 'text/plain' }
      });

      if (!response.ok) {
        self.postMessage({ type: 'log', message: 'No robots.txt found (using default rules)' });
        return;
      }

      const text = await response.text();
      const lines = text.split('\n');
      let relevantToUs = true;

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('User-agent:')) {
          const agent = trimmed.substring(11).trim();
          relevantToUs = agent === '*' || agent.toLowerCase() === 'bot';
        } else if (trimmed.startsWith('Disallow:') && relevantToUs) {
          const path = trimmed.substring(9).trim();
          if (path) {
            this.disallowedPaths.push(path);
          }
        }
      }

      if (this.disallowedPaths.length > 0) {
        self.postMessage({
          type: 'log',
          message: `Respecting ${this.disallowedPaths.length} robots.txt rules`
        });
      }
    } catch (error) {
      self.postMessage({ type: 'log', message: 'Could not fetch robots.txt (proceeding anyway)' });
    }
  }

  async fetchSitemap() {
    try {
      self.postMessage({ type: 'log', message: 'Checking for sitemap.xml...' });
      const sitemapUrl = new URL('/sitemap.xml', this.baseUrl).href;
      const response = await fetch(sitemapUrl, {
        mode: 'cors',
        headers: { 'Accept': 'application/xml,text/xml' }
      });

      if (!response.ok) {
        self.postMessage({ type: 'log', message: 'No sitemap.xml found (will crawl manually)' });
        return [];
      }

      const text = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      const locs = xmlDoc.querySelectorAll('loc');

      const urls = [];
      for (const loc of locs) {
        const url = loc.textContent?.trim();
        if (url && this.isSameDomain(url) && !this.shouldSkipUrl(url)) {
          urls.push(url);
        }
      }

      if (urls.length > 0) {
        self.postMessage({
          type: 'log',
          message: `Found sitemap.xml – adding ${urls.length} URLs`
        });
        return urls.slice(0, MAX_URLS);
      }

      return [];
    } catch (error) {
      self.postMessage({ type: 'log', message: 'Error reading sitemap.xml (will crawl manually)' });
      return [];
    }
  }

  async fetchAndParse(url) {
    try {
      const response = await fetch(url, {
        mode: 'cors',
        headers: {
          'Accept': 'text/html'
        },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) {
        return [];
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const links = doc.querySelectorAll('a[href]');

      const discovered = [];
      for (const link of links) {
        const href = link.getAttribute('href');
        if (!href) continue;

        const normalized = this.normalizeUrl(href, url);
        if (normalized &&
            this.isSameDomain(normalized) &&
            !this.shouldSkipUrl(normalized) &&
            !this.discovered.has(normalized)) {
          discovered.push(normalized);
        }
      }

      return discovered;
    } catch (error) {
      return [];
    }
  }

  async crawl(startUrl) {
    this.baseUrl = startUrl;
    try {
      const urlObj = new URL(startUrl);
      this.baseDomain = urlObj.hostname;
    } catch {
      self.postMessage({
        type: 'error',
        message: 'Invalid URL provided'
      });
      return;
    }

    self.postMessage({ type: 'log', message: `Starting crawl of ${this.baseDomain}` });

    await this.fetchRobotsTxt();

    const sitemapUrls = await this.fetchSitemap();

    if (sitemapUrls.length > 0) {
      for (const url of sitemapUrls) {
        this.discovered.add(url);
      }

      self.postMessage({
        type: 'urls',
        urls: Array.from(this.discovered),
        complete: true
      });

      self.postMessage({
        type: 'log',
        message: `Crawling complete: ${this.discovered.size} URLs found from sitemap`
      });
      return;
    }

    this.discovered.add(startUrl);
    this.queue.push({ url: startUrl, depth: 0 });

    self.postMessage({ type: 'log', message: `Crawling ${startUrl}` });

    const startTime = Date.now();
    let urlsProcessed = 0;

    while (this.queue.length > 0 && this.discovered.size < MAX_URLS) {
      const { url, depth } = this.queue.shift();

      if (this.visited.has(url) || depth > MAX_DEPTH) {
        continue;
      }

      this.visited.add(url);
      urlsProcessed++;

      if (urlsProcessed % 5 === 0) {
        const elapsed = (Date.now() - startTime) / 1000;
        const rate = urlsProcessed / elapsed;
        const remaining = this.queue.length;
        const eta = remaining > 0 ? Math.ceil(remaining / rate) : 0;

        self.postMessage({
          type: 'progress',
          discovered: this.discovered.size,
          visited: this.visited.size,
          queued: this.queue.length,
          eta: eta
        });
      }

      await new Promise(resolve => setTimeout(resolve, 50));

      const links = await this.fetchAndParse(url);

      for (const link of links) {
        if (!this.discovered.has(link) && this.discovered.size < MAX_URLS) {
          this.discovered.add(link);

          const urlObj = new URL(link);
          const path = urlObj.pathname;
          const displayPath = path === '/' ? '/' : path;

          self.postMessage({
            type: 'log',
            message: `Discovered → ${displayPath}`
          });

          if (depth < MAX_DEPTH) {
            this.queue.push({ url: link, depth: depth + 1 });
          }

          self.postMessage({
            type: 'urls',
            urls: Array.from(this.discovered),
            complete: false
          });
        }
      }
    }

    self.postMessage({
      type: 'urls',
      urls: Array.from(this.discovered),
      complete: true
    });

    self.postMessage({
      type: 'log',
      message: `Crawling complete: ${this.discovered.size} URLs found`
    });
  }
}

self.onmessage = async (e) => {
  const { type, url } = e.data;

  if (type === 'start') {
    const crawler = new WebCrawler();
    await crawler.crawl(url);
  }
};
