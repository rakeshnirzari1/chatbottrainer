import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const MAX_PAGES = 100;
const MAX_DEPTH = 3;

function extractTextContent(html: string): { title: string; content: string; wordCount: number } {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  if (!doc) return { title: '', content: '', wordCount: 0 };

  const title = doc.querySelector('title')?.textContent?.trim() || '';

  const tagsToRemove = ['script', 'style', 'nav', 'footer', 'header', 'aside', 'form', 'iframe', 'svg'];
  tagsToRemove.forEach(tag => {
    doc.querySelectorAll(tag).forEach(el => el.remove());
  });

  const body = doc.querySelector('body');
  let textContent = body?.textContent || '';

  textContent = textContent
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();

  const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;

  return { title, content: textContent, wordCount };
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

function shouldSkipUrl(url: string): boolean {
  const lower = url.toLowerCase();
  const skipExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.zip', '.exe', 
                         '.mp4', '.mp3', '.avi', '.doc', '.docx', '.xls', '.xlsx',
                         '.ppt', '.pptx', '.css', '.js', '.ico', '.svg'];
  
  if (skipExtensions.some(ext => lower.endsWith(ext))) return true;
  if (lower.includes('mailto:') || lower.includes('tel:') || lower.includes('javascript:')) return true;
  
  return false;
}

async function crawlPage(url: string, baseDomain: string): Promise<{ html: string; links: string[] } | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ChatbotTrainerBot/1.0',
        'Accept': 'text/html'
      },
      signal: controller.signal,
      redirect: 'follow'
    });

    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('text/html')) return null;

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    if (!doc) return null;

    const links: string[] = [];
    const anchorTags = doc.querySelectorAll('a[href]');

    for (const anchor of anchorTags) {
      const href = anchor.getAttribute('href');
      if (!href) continue;

      const normalized = normalizeUrl(href, url);
      if (normalized && !shouldSkipUrl(normalized)) {
        try {
          const urlObj = new URL(normalized);
          if (urlObj.hostname === baseDomain) {
            links.push(normalized);
          }
        } catch {
          continue;
        }
      }
    }

    return { html, links };
  } catch (error) {
    console.error(`Error crawling ${url}:`, error);
    return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { project_id } = await req.json();

    if (!project_id) {
      return new Response(
        JSON.stringify({ error: 'project_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: project, error: projectError } = await supabase
      .from('chatbot_projects')
      .select('id, website_url, max_pages, user_id')
      .eq('id', project_id)
      .single();

    if (projectError || !project) {
      return new Response(
        JSON.stringify({ error: 'Project not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await supabase
      .from('chatbot_projects')
      .update({ status: 'crawling' })
      .eq('id', project_id);

    const startUrl = project.website_url;
    const baseDomain = new URL(startUrl).hostname;
    const maxPages = Math.min(project.max_pages || 50, MAX_PAGES);

    const discovered = new Set<string>([startUrl]);
    const visited = new Set<string>();
    const queue: Array<{ url: string; depth: number }> = [{ url: startUrl, depth: 0 }];

    let pagesProcessed = 0;

    while (queue.length > 0 && pagesProcessed < maxPages) {
      const { url, depth } = queue.shift()!;

      if (visited.has(url) || depth > MAX_DEPTH) continue;
      visited.add(url);

      const result = await crawlPage(url, baseDomain);
      if (!result) continue;

      const { title, content, wordCount } = extractTextContent(result.html);

      if (wordCount > 50) {
        await supabase
          .from('crawled_pages')
          .upsert({
            project_id: project_id,
            url: url,
            title: title,
            content: content,
            word_count: wordCount,
            status: 'pending',
            crawled_at: new Date().toISOString()
          }, {
            onConflict: 'project_id,url'
          });

        pagesProcessed++;
      }

      if (depth < MAX_DEPTH && pagesProcessed < maxPages) {
        for (const link of result.links) {
          if (!discovered.has(link) && discovered.size < maxPages) {
            discovered.add(link);
            queue.push({ url: link, depth: depth + 1 });
          }
        }
      }

      await new Promise(resolve => setTimeout(resolve, 200));
    }

    await supabase
      .from('chatbot_projects')
      .update({ 
        status: 'training',
        last_trained_at: new Date().toISOString()
      })
      .eq('id', project_id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        pages_crawled: pagesProcessed,
        message: 'Crawling complete. Starting embedding generation...'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Crawl error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});