/*
  # ChatBot SAAS Platform Schema

  ## Overview
  Complete database schema for a multi-tenant chatbot training platform inspired by WebWhiz.
  Users can create chatbots by providing website URLs, train them using OpenAI embeddings,
  and deploy them with embed codes.

  ## New Tables

  ### 1. `chatbot_projects`
  Main chatbot projects that users create
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `name` (text) - Project name
  - `website_url` (text) - Source website URL
  - `status` (text) - pending, training, ready, error
  - `model` (text) - OpenAI model (gpt-3.5-turbo, gpt-4, etc.)
  - `temperature` (float) - AI temperature setting
  - `max_pages` (int) - Maximum pages to crawl
  - `crawl_frequency` (text) - never, daily, weekly, monthly
  - `last_trained_at` (timestamptz)
  - `embed_code` (text) - Generated embed code
  - `total_tokens_used` (bigint) - Token usage tracking
  - `created_at`, `updated_at` (timestamptz)

  ### 2. `crawled_pages`
  Individual pages crawled from websites
  - `id` (uuid, primary key)
  - `project_id` (uuid, foreign key)
  - `url` (text) - Page URL
  - `title` (text) - Page title
  - `content` (text) - Extracted text content
  - `html` (text) - Raw HTML (optional)
  - `metadata` (jsonb) - Additional metadata
  - `status` (text) - pending, processed, error
  - `word_count` (int)
  - `crawled_at` (timestamptz)
  - `created_at`, `updated_at` (timestamptz)

  ### 3. `embeddings`
  Vector embeddings for semantic search (using pgvector)
  - `id` (uuid, primary key)
  - `project_id` (uuid, foreign key)
  - `page_id` (uuid, foreign key)
  - `content_chunk` (text) - Text chunk (max 512 tokens)
  - `embedding` (vector(1536)) - OpenAI ada-002 embedding
  - `token_count` (int)
  - `chunk_index` (int) - Position in page
  - `created_at` (timestamptz)

  ### 4. `conversations`
  Chat conversations between users and chatbots
  - `id` (uuid, primary key)
  - `project_id` (uuid, foreign key)
  - `session_id` (text) - Unique session identifier
  - `visitor_id` (text) - Anonymous visitor tracking
  - `metadata` (jsonb) - Browser info, location, etc.
  - `started_at` (timestamptz)
  - `ended_at` (timestamptz)
  - `message_count` (int)

  ### 5. `messages`
  Individual messages in conversations
  - `id` (uuid, primary key)
  - `conversation_id` (uuid, foreign key)
  - `project_id` (uuid, foreign key)
  - `role` (text) - user or assistant
  - `content` (text) - Message text
  - `sources` (jsonb) - Array of source page URLs/titles
  - `tokens_used` (int)
  - `response_time_ms` (int)
  - `created_at` (timestamptz)

  ### 6. `subscriptions`
  Stripe subscription tracking
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `stripe_customer_id` (text)
  - `stripe_subscription_id` (text)
  - `plan` (text) - free, starter, pro, enterprise
  - `status` (text) - active, canceled, past_due
  - `current_period_start` (timestamptz)
  - `current_period_end` (timestamptz)
  - `cancel_at_period_end` (boolean)
  - `max_projects` (int) - Plan limit
  - `max_pages_per_project` (int)
  - `max_messages_per_month` (int)
  - `created_at`, `updated_at` (timestamptz)

  ### 7. `usage_tracking`
  Track usage for billing and limits
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `project_id` (uuid, foreign key, nullable)
  - `metric_type` (text) - messages, tokens, pages_crawled
  - `metric_value` (bigint)
  - `period_start` (timestamptz)
  - `period_end` (timestamptz)
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can only access their own projects and data
  - Public access only for chat widget endpoints (conversations/messages)
  - Admin users can access all data for support purposes

  ## Indexes
  - Vector similarity search index on embeddings
  - URL lookups on crawled_pages
  - User and project lookups
  - Timestamp-based queries for analytics
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

-- Drop existing tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS usage_tracking CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS embeddings CASCADE;
DROP TABLE IF EXISTS crawled_pages CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS chatbot_projects CASCADE;

-- 1. Chatbot Projects Table
CREATE TABLE chatbot_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  website_url text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'crawling', 'training', 'ready', 'error')),
  model text NOT NULL DEFAULT 'gpt-3.5-turbo',
  temperature float NOT NULL DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  max_pages int NOT NULL DEFAULT 100,
  crawl_frequency text NOT NULL DEFAULT 'never' CHECK (crawl_frequency IN ('never', 'daily', 'weekly', 'monthly')),
  last_trained_at timestamptz,
  embed_code text,
  total_tokens_used bigint NOT NULL DEFAULT 0,
  error_message text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Crawled Pages Table
CREATE TABLE crawled_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES chatbot_projects(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  title text,
  content text NOT NULL,
  html text,
  metadata jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'error')),
  word_count int DEFAULT 0,
  crawled_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(project_id, url)
);

-- 3. Embeddings Table (with vector support)
CREATE TABLE embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES chatbot_projects(id) ON DELETE CASCADE NOT NULL,
  page_id uuid REFERENCES crawled_pages(id) ON DELETE CASCADE NOT NULL,
  content_chunk text NOT NULL,
  embedding vector(1536) NOT NULL,
  token_count int NOT NULL DEFAULT 0,
  chunk_index int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 4. Conversations Table
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES chatbot_projects(id) ON DELETE CASCADE NOT NULL,
  session_id text NOT NULL,
  visitor_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  started_at timestamptz DEFAULT now() NOT NULL,
  ended_at timestamptz,
  message_count int DEFAULT 0
);

-- 5. Messages Table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES chatbot_projects(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  sources jsonb DEFAULT '[]'::jsonb,
  tokens_used int DEFAULT 0,
  response_time_ms int DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 6. Subscriptions Table
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text UNIQUE,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  max_projects int NOT NULL DEFAULT 1,
  max_pages_per_project int NOT NULL DEFAULT 50,
  max_messages_per_month int NOT NULL DEFAULT 100,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 7. Usage Tracking Table
CREATE TABLE usage_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES chatbot_projects(id) ON DELETE CASCADE,
  metric_type text NOT NULL CHECK (metric_type IN ('messages', 'tokens', 'pages_crawled', 'embeddings')),
  metric_value bigint NOT NULL DEFAULT 0,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create Indexes for Performance
CREATE INDEX idx_chatbot_projects_user_id ON chatbot_projects(user_id);
CREATE INDEX idx_chatbot_projects_status ON chatbot_projects(status);

CREATE INDEX idx_crawled_pages_project_id ON crawled_pages(project_id);
CREATE INDEX idx_crawled_pages_url ON crawled_pages(url);
CREATE INDEX idx_crawled_pages_status ON crawled_pages(status);

CREATE INDEX idx_embeddings_project_id ON embeddings(project_id);
CREATE INDEX idx_embeddings_page_id ON embeddings(page_id);
CREATE INDEX idx_embeddings_vector ON embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX idx_conversations_project_id ON conversations(project_id);
CREATE INDEX idx_conversations_session_id ON conversations(session_id);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_project_id ON messages(project_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);

CREATE INDEX idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX idx_usage_tracking_period ON usage_tracking(period_start, period_end);

-- Enable Row Level Security
ALTER TABLE chatbot_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE crawled_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chatbot_projects
CREATE POLICY "Users can view own projects"
  ON chatbot_projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON chatbot_projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON chatbot_projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON chatbot_projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for crawled_pages
CREATE POLICY "Users can view pages of own projects"
  ON crawled_pages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chatbot_projects
      WHERE chatbot_projects.id = crawled_pages.project_id
      AND chatbot_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage pages of own projects"
  ON crawled_pages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chatbot_projects
      WHERE chatbot_projects.id = crawled_pages.project_id
      AND chatbot_projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chatbot_projects
      WHERE chatbot_projects.id = crawled_pages.project_id
      AND chatbot_projects.user_id = auth.uid()
    )
  );

-- RLS Policies for embeddings
CREATE POLICY "Users can view embeddings of own projects"
  ON embeddings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chatbot_projects
      WHERE chatbot_projects.id = embeddings.project_id
      AND chatbot_projects.user_id = auth.uid()
    )
  );

-- RLS Policies for conversations (public for widget)
CREATE POLICY "Anyone can create conversations"
  ON conversations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view conversations of own projects"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chatbot_projects
      WHERE chatbot_projects.id = conversations.project_id
      AND chatbot_projects.user_id = auth.uid()
    )
  );

-- RLS Policies for messages (public for widget)
CREATE POLICY "Anyone can create messages"
  ON messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view messages of own projects"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chatbot_projects
      WHERE chatbot_projects.id = messages.project_id
      AND chatbot_projects.user_id = auth.uid()
    )
  );

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for usage_tracking
CREATE POLICY "Users can view own usage"
  ON usage_tracking FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_chatbot_projects_updated_at
  BEFORE UPDATE ON chatbot_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crawled_pages_updated_at
  BEFORE UPDATE ON crawled_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default free plan for existing users
INSERT INTO subscriptions (user_id, plan, max_projects, max_pages_per_project, max_messages_per_month)
SELECT id, 'free', 1, 50, 100
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- Function to check if user has reached project limit
CREATE OR REPLACE FUNCTION check_project_limit()
RETURNS TRIGGER AS $$
DECLARE
  project_count int;
  max_allowed int;
BEGIN
  SELECT COUNT(*) INTO project_count
  FROM chatbot_projects
  WHERE user_id = NEW.user_id;

  SELECT max_projects INTO max_allowed
  FROM subscriptions
  WHERE user_id = NEW.user_id;

  IF project_count >= max_allowed THEN
    RAISE EXCEPTION 'Project limit reached. Please upgrade your plan.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_project_limit
  BEFORE INSERT ON chatbot_projects
  FOR EACH ROW
  EXECUTE FUNCTION check_project_limit();
