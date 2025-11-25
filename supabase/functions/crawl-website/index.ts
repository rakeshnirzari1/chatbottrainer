import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const MAX_DEPTH = 6;
const MAX_URLS = 1000;

interface CrawlState {
  discovered: Set<string>;
  visited: Set<string>;
  queue: Array<{ url: string; depth: number }>;
  disallowedPaths: string[];
  baseUrl: string;
  baseDomain: string;
}

function normalizeUrl(url: string, baseUrl: string): string | null {
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

function isSameDomain(url: string, baseDomain: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === baseDomain;
  } catch {
    return false;
  }
}

function shouldSkipUrl(url: string): boolean {
  const lower = url.toLowerCase();
  const skipExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.zip', '.exe', '.dmg',
                         '.mp4', '.mp3', '.avi', '.mov', '.doc', '.docx', '.xls', '.xlsx',
                         '.ppt', '.pptx', '.svg', '.ico', '.webp', '.css', '.js'];

  if (skipExtensions.some(ext => lower.endsWith(ext))) return true;

  if (lower.includes('mailto:') || lower.includes('tel:') || lower.includes('javascript:')) {
    return true;
  }

  return false;
}

async function fetchRobotsTxt(state: CrawlState): Promise<void> {
  try {
    const robotsUrl = new URL('/robots.txt', state.baseUrl).href;
    const response = await fetch(robotsUrl, {
      headers: { 'User-Agent': 'ChatbotTrainerBot/1.0' }
    });

    if (!response.ok) return;

    const text = await response.text();
    const lines = text.split('\n');
    let relevantToUs = true;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('User-agent:')) {
        const agent = trimmed.substring(11).trim();
        relevantToUs = agent === '*' || agent.toLowerCase().includes('bot');
      } else if (trimmed.startsWith('Disallow:') && relevantToUs) {
        const path = trimmed.substring(9).trim();
        if (path) {
          state.disallowedPaths.push(path);
        }
      }
    }
  } catch {
    // Continue without robots.txt
  }
}

function isDisallowed(url: string, disallowedPaths: string[]): boolean {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    return disallowedPaths.some(disallowed => path.startsWith(disallowed));
  } catch {
    return false;
  }
}

async function fetchSitemap(state: CrawlState): Promise<string[]> {
  try {
    const sitemapUrl = new URL('/sitemap.xml', state.baseUrl).href;
    const response = await fetch(sitemapUrl, {
      headers: { 'User-Agent': 'ChatbotTrainerBot/1.0' }
    });

    if (!response.ok) return [];

    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, 'text/xml');
    if (!doc) return [];

    const locs = doc.querySelectorAll('loc');
    const urls: string[] = [];

    for (const loc of locs) {
      const url = loc.textContent?.trim();
      if (url && isSameDomain(url, state.baseDomain) && !shouldSkipUrl(url)) {
        urls.push(url);
      }
    }

    return urls.slice(0, MAX_URLS);
  } catch {
    return [];
  }
}

async function fetchAndParse(url: string, state: CrawlState): Promise<string[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ChatbotTrainerBot/1.0',
        'Accept': 'text/html'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) return [];

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('text/html')) return [];

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    if (!doc) return [];

    const links = doc.querySelectorAll('a[href]');
    const discovered: string[] = [];

    for (const link of links) {
      const href = link.getAttribute('href');
      if (!href) continue;

      const normalized = normalizeUrl(href, url);
      if (normalized &&
          isSameDomain(normalized, state.baseDomain) &&
          !shouldSkipUrl(normalized) &&
          !isDisallowed(normalized, state.disallowedPaths) &&
          !state.discovered.has(normalized)) {
        discovered.push(normalized);
      }
    }

    return discovered;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return [];
  }
}

async function* crawlWebsite(startUrl: string) {
  const state: CrawlState = {
    discovered: new Set<string>(),
    visited: new Set<string>(),
    queue: [],
    disallowedPaths: [],
    baseUrl: startUrl,
    baseDomain: ''
  };

  try {
    const urlObj = new URL(startUrl);
    state.baseDomain = urlObj.hostname;
  } catch {
    yield { type: 'error', message: 'Invalid URL provided' };
    return;
  }

  yield { type: 'log', message: `Starting crawl of ${state.baseDomain}` };

  yield { type: 'log', message: 'Fetching robots.txt...' };
  await fetchRobotsTxt(state);

  if (state.disallowedPaths.length > 0) {
    yield { type: 'log', message: `Respecting ${state.disallowedPaths.length} robots.txt rules` };
  }

  yield { type: 'log', message: 'Checking for sitemap.xml...' };
  const sitemapUrls = await fetchSitemap(state);

  if (sitemapUrls.length > 0) {
    yield { type: 'log', message: `Found sitemap.xml – adding ${sitemapUrls.length} URLs` };
    sitemapUrls.forEach(url => state.discovered.add(url));
    yield { type: 'urls', urls: Array.from(state.discovered), complete: true };
    yield { type: 'log', message: `Crawling complete: ${state.discovered.size} URLs found from sitemap` };
    return;
  }

  yield { type: 'log', message: 'No sitemap found, crawling manually...' };

  state.discovered.add(startUrl);
  state.queue.push({ url: startUrl, depth: 0 });

  let urlsProcessed = 0;
  const startTime = Date.now();

  while (state.queue.length > 0 && state.discovered.size < MAX_URLS) {
    const { url, depth } = state.queue.shift()!;

    if (state.visited.has(url) || depth > MAX_DEPTH) {
      continue;
    }

    state.visited.add(url);
    urlsProcessed++;

    const urlObj = new URL(url);
    const displayPath = urlObj.pathname === '/' ? '/' : urlObj.pathname;
    yield { type: 'log', message: `Crawling ${displayPath}` };

    const links = await fetchAndParse(url, state);

    for (const link of links) {
      if (!state.discovered.has(link) && state.discovered.size < MAX_URLS) {
        state.discovered.add(link);

        const linkObj = new URL(link);
        const linkPath = linkObj.pathname === '/' ? '/' : linkObj.pathname;
        yield { type: 'log', message: `Discovered → ${linkPath}` };

        if (depth < MAX_DEPTH) {
          state.queue.push({ url: link, depth: depth + 1 });
        }

        yield { type: 'urls', urls: Array.from(state.discovered), complete: false };
      }
    }

    if (urlsProcessed % 3 === 0) {
      const elapsed = (Date.now() - startTime) / 1000;
      const rate = urlsProcessed / elapsed;
      const remaining = state.queue.length;
      const eta = remaining > 0 ? Math.ceil(remaining / rate) : 0;

      yield {
        type: 'progress',
        discovered: state.discovered.size,
        visited: state.visited.size,
        queued: state.queue.length,
        eta: eta
      };
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  yield { type: 'urls', urls: Array.from(state.discovered), complete: true };
  yield { type: 'log', message: `Crawling complete: ${state.discovered.size} URLs found` };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        try {
          for await (const event of crawlWebsite(url)) {
            const data = `data: ${JSON.stringify(event)}\n\n`;
            controller.enqueue(encoder.encode(data));
          }
          controller.close();
        } catch (error) {
          const errorData = `data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});