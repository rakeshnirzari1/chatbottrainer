/*
  # Create Contact Messages Table

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key) - Unique message identifier
      - `name` (text) - Sender's full name
      - `email` (text) - Sender's email address
      - `subject` (text) - Message subject category
      - `message` (text) - Message content
      - `status` (text) - Message status (new, read, responded, archived)
      - `created_at` (timestamptz) - When message was received
      - `updated_at` (timestamptz) - When message was last updated
      - `email_sent` (boolean) - Whether email was successfully sent
      - `email_error` (text) - Any error from email sending

  2. Security
    - Enable RLS on `contact_messages` table
    - Only authenticated admin users can read messages
    - Public users can insert messages (contact form)
    
  3. Indexes
    - Index on created_at for efficient sorting
    - Index on status for filtering
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  email_sent boolean DEFAULT false,
  email_error text
);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact messages (public contact form)
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admin users can view contact messages
CREATE POLICY "Admin users can view contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Only admin users can update contact messages
CREATE POLICY "Admin users can update contact messages"
  ON contact_messages
  FOR UPDATE
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email_sent ON contact_messages(email_sent);
