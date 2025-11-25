export interface CrawlProgress {
  type: 'log' | 'urls' | 'progress' | 'error';
  message?: string;
  urls?: string[];
  complete?: boolean;
  discovered?: number;
  visited?: number;
  queued?: number;
  eta?: number;
}

export type CrawlCallback = (progress: CrawlProgress) => void;

export async function crawlWebsite(
  startUrl: string,
  onProgress: CrawlCallback
): Promise<string[]> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const apiUrl = `${supabaseUrl}/functions/v1/crawl-website`;

  let finalUrls: string[] = [];

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey,
      },
      body: JSON.stringify({ url: startUrl })
    });

    if (!response.ok) {
      throw new Error('Failed to start crawl');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6)) as CrawlProgress;
            onProgress(data);

            if (data.type === 'urls' && data.urls) {
              finalUrls = data.urls;
            }

            if (data.type === 'error') {
              throw new Error(data.message || 'Crawl failed');
            }
          } catch (e) {
            console.error('Error parsing SSE:', e);
          }
        }
      }
    }

    return finalUrls;
  } catch (error) {
    console.error('Crawl error:', error);
    throw error;
  }
}
