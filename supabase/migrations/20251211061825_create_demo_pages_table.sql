/*
  # Create Demo Pages Table

  1. New Tables
    - `demo_pages`
      - `id` (uuid, primary key)
      - `company_name` (text) - Full company name
      - `slug` (text, unique) - URL-friendly version of company name
      - `embed_code` (text) - The chatbot embed script code
      - `created_at` (timestamptz) - When the demo was created
      - `updated_at` (timestamptz) - When the demo was last updated
  
  2. Security
    - Enable RLS on `demo_pages` table
    - Add policy for admin users to manage all demo pages
    - Add policy for public to view demo pages (read-only)
*/

CREATE TABLE IF NOT EXISTS demo_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  slug text UNIQUE NOT NULL,
  embed_code text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE demo_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can manage all demo pages"
  ON demo_pages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view demo pages"
  ON demo_pages
  FOR SELECT
  TO anon, authenticated
  USING (true);