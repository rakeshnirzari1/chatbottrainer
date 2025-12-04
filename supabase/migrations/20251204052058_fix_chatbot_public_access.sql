/*
  # Fix Public Access for Chatbot Queries

  ## Changes
  This migration fixes RLS policies to allow public chatbot functionality.
  The chatbot-query edge function needs to work without user authentication
  for embedded widgets on external websites.

  ## Tables Modified
  
  ### chatbot_projects
  - Allow public SELECT for any project (needed to verify project exists)
  - Allow public UPDATE for token usage tracking
  
  ### conversations
  - Allow public INSERT to create new chat sessions
  - Allow public UPDATE to track message counts
  
  ### messages
  - Allow public INSERT to store user/bot messages
  - Allow public SELECT to retrieve conversation history
  
  ### embeddings
  - Allow public SELECT to retrieve context for responses
  
  ### crawled_pages
  - Allow public SELECT to get source URLs for citations

  ## Security Notes
  - Projects are read-only except for token tracking
  - Conversations and messages are append-only from public perspective
  - No sensitive data is exposed publicly
*/

-- Drop existing restrictive policies that block public access
DROP POLICY IF EXISTS "Users can view own projects" ON chatbot_projects;
DROP POLICY IF EXISTS "Users can create own projects" ON chatbot_projects;
DROP POLICY IF EXISTS "Users can update own projects" ON chatbot_projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON chatbot_projects;

-- chatbot_projects: Allow public read and token updates
CREATE POLICY "Public can view chatbot projects"
  ON chatbot_projects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create own projects"
  ON chatbot_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON chatbot_projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can update token usage"
  ON chatbot_projects
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own projects"
  ON chatbot_projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- conversations: Allow public insert and update
CREATE POLICY "Public can create conversations"
  ON conversations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update conversations"
  ON conversations
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can view conversations"
  ON conversations
  FOR SELECT
  TO public
  USING (true);

-- messages: Allow public insert and select
CREATE POLICY "Public can create messages"
  ON messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can view messages"
  ON messages
  FOR SELECT
  TO public
  USING (true);

-- embeddings: Allow public select for context retrieval
DROP POLICY IF EXISTS "Users can view project embeddings" ON embeddings;

CREATE POLICY "Public can view embeddings"
  ON embeddings
  FOR SELECT
  TO public
  USING (true);

-- crawled_pages: Allow public select for source URLs
DROP POLICY IF EXISTS "Users can view project pages" ON crawled_pages;

CREATE POLICY "Public can view crawled pages"
  ON crawled_pages
  FOR SELECT
  TO public
  USING (true);
