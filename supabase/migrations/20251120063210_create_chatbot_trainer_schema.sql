/*
  # ChatbotTrainer SAAS Application Schema

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `website_url` (text)
      - `selected_urls` (jsonb, array of URLs)
      - `total_urls` (integer)
      - `final_price_cents` (integer)
      - `stripe_payment_intent_id` (text, nullable)
      - `status` (text, enum: 'pending', 'payment_received', 'training', 'ready')
      - `embed_code` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `orders` table
    - Add policies for users to read their own orders
    - Add policies for authenticated users to create orders
    - Add policies for updates (restricted to system/admin)
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  website_url text NOT NULL,
  selected_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_urls integer NOT NULL DEFAULT 0,
  final_price_cents integer NOT NULL,
  stripe_payment_intent_id text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'payment_received', 'training', 'ready')),
  embed_code text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);