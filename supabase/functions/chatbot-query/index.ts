import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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
    throw new Error('Failed to generate embedding');
  }

  const data = await response.json();
  return data.data[0].embedding;
}

async function findSimilarContent(supabase: any, projectId: string, queryEmbedding: number[], limit: number = 5) {
  const { data, error } = await supabase.rpc('match_embeddings', {
    query_embedding: JSON.stringify(queryEmbedding),
    match_threshold: 0.7,
    match_count: limit,
    p_project_id: projectId
  });

  if (error) {
    console.error('Similarity search error:', error);
    return [];
  }

  return data || [];
}

async function generateChatResponse(
  message: string,
  context: string,
  conversationHistory: Array<{ role: string; content: string }>,
  model: string,
  temperature: number,
  apiKey: string
): Promise<{ content: string; tokensUsed: number }> {
  const systemPrompt = `You are a helpful AI assistant. Use the following context to answer the user's question. If the answer is not in the context, say so politely.\n\nContext:\n${context}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-6),
    { role: 'user', content: message }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model || 'gpt-3.5-turbo',
      messages: messages,
      temperature: temperature || 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    tokensUsed: data.usage.total_tokens
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { 
      project_id, 
      message, 
      conversation_id,
      session_id,
      visitor_id,
      openai_api_key 
    } = await req.json();

    if (!project_id || !message || !openai_api_key) {
      return new Response(
        JSON.stringify({ error: 'project_id, message, and openai_api_key are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: project, error: projectError } = await supabase
      .from('chatbot_projects')
      .select('id, model, temperature, status')
      .eq('id', project_id)
      .single();

    if (projectError || !project) {
      return new Response(
        JSON.stringify({ error: 'Project not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (project.status !== 'ready') {
      return new Response(
        JSON.stringify({ error: 'Chatbot is not ready yet. Please wait for training to complete.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let currentConversationId = conversation_id;

    if (!currentConversationId) {
      const { data: newConversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          project_id: project_id,
          session_id: session_id || crypto.randomUUID(),
          visitor_id: visitor_id,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (convError) {
        throw new Error(`Failed to create conversation: ${convError.message}`);
      }

      currentConversationId = newConversation.id;
    }

    await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversationId,
        project_id: project_id,
        role: 'user',
        content: message
      });

    const { data: history } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', currentConversationId)
      .order('created_at', { ascending: true })
      .limit(10);

    const queryEmbedding = await generateEmbedding(message, openai_api_key);

    const { data: embeddings } = await supabase
      .from('embeddings')
      .select('content_chunk, page_id')
      .eq('project_id', project_id)
      .limit(5);

    let contextChunks: string[] = [];
    let sources: any[] = [];

    if (embeddings && embeddings.length > 0) {
      contextChunks = embeddings.map((e: any) => e.content_chunk);
      
      const pageIds = [...new Set(embeddings.map((e: any) => e.page_id))];
      const { data: pages } = await supabase
        .from('crawled_pages')
        .select('id, url, title')
        .in('id', pageIds);

      if (pages) {
        sources = pages.map((p: any) => ({ url: p.url, title: p.title }));
      }
    }

    const context = contextChunks.join('\n\n');

    const { content: aiResponse, tokensUsed } = await generateChatResponse(
      message,
      context,
      history || [],
      project.model,
      project.temperature,
      openai_api_key
    );

    const responseTime = Date.now() - startTime;

    await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversationId,
        project_id: project_id,
        role: 'assistant',
        content: aiResponse,
        sources: sources,
        tokens_used: tokensUsed,
        response_time_ms: responseTime
      });

    await supabase
      .from('conversations')
      .update({ 
        message_count: (history?.length || 0) + 2,
        ended_at: new Date().toISOString()
      })
      .eq('id', currentConversationId);

    await supabase
      .from('chatbot_projects')
      .update({ 
        total_tokens_used: project.total_tokens_used + tokensUsed 
      })
      .eq('id', project_id);

    return new Response(
      JSON.stringify({ 
        success: true,
        conversation_id: currentConversationId,
        response: aiResponse,
        sources: sources,
        tokens_used: tokensUsed,
        response_time_ms: responseTime
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Chatbot query error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});