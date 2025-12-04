import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const CHUNK_SIZE = 512;
const CHUNK_OVERLAP = 50;

function splitIntoChunks(text: string, maxTokens: number = CHUNK_SIZE): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentLength = 0;

  for (const word of words) {
    const wordTokens = Math.ceil(word.length / 4);
    
    if (currentLength + wordTokens > maxTokens && currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
      const overlapWords = Math.floor(CHUNK_OVERLAP / 4);
      currentChunk = currentChunk.slice(-overlapWords);
      currentLength = currentChunk.reduce((sum, w) => sum + Math.ceil(w.length / 4), 0);
    }
    
    currentChunk.push(word);
    currentLength += wordTokens;
  }
  
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }
  
  return chunks.filter(chunk => chunk.trim().length > 50);
}

async function generateEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: text
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
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

    const { project_id, openai_api_key } = await req.json();

    if (!project_id || !openai_api_key) {
      return new Response(
        JSON.stringify({ error: 'project_id and openai_api_key are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: project, error: projectError } = await supabase
      .from('chatbot_projects')
      .select('id, user_id')
      .eq('id', project_id)
      .single();

    if (projectError || !project) {
      return new Response(
        JSON.stringify({ error: 'Project not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: pages, error: pagesError } = await supabase
      .from('crawled_pages')
      .select('id, url, title, content')
      .eq('project_id', project_id)
      .eq('status', 'pending');

    if (pagesError) {
      throw new Error(`Failed to fetch pages: ${pagesError.message}`);
    }

    if (!pages || pages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No pages found to process' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await supabase
      .from('embeddings')
      .delete()
      .eq('project_id', project_id);

    let totalEmbeddings = 0;
    let totalTokens = 0;

    for (const page of pages) {
      const chunks = splitIntoChunks(page.content);
      
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const tokenCount = Math.ceil(chunk.split(/\s+/).length * 1.3);
        
        try {
          const embedding = await generateEmbedding(chunk, openai_api_key);
          
          await supabase
            .from('embeddings')
            .insert({
              project_id: project_id,
              page_id: page.id,
              content_chunk: chunk,
              embedding: JSON.stringify(embedding),
              token_count: tokenCount,
              chunk_index: i
            });
          
          totalEmbeddings++;
          totalTokens += tokenCount;
          
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Error generating embedding for page ${page.id}, chunk ${i}:`, error);
          continue;
        }
      }

      await supabase
        .from('crawled_pages')
        .update({ status: 'processed' })
        .eq('id', page.id);
    }

    await supabase
      .from('chatbot_projects')
      .update({ 
        status: 'ready',
        total_tokens_used: totalTokens,
        last_trained_at: new Date().toISOString()
      })
      .eq('id', project_id);

    const embedCode = `<script src="${supabaseUrl.replace('https://', 'https://')}/functions/v1/chatbot-widget.js" data-project-id="${project_id}"></script>`;
    
    await supabase
      .from('chatbot_projects')
      .update({ embed_code: embedCode })
      .eq('id', project_id);

    return new Response(
      JSON.stringify({ 
        success: true,
        embeddings_created: totalEmbeddings,
        tokens_used: totalTokens,
        message: 'Embeddings generated successfully. Chatbot is ready!'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Embedding generation error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});