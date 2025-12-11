/*
  # Add Custom Questions and View Tracking to Demo Pages

  1. Changes to `demo_pages` table
    - Add `custom_questions` (text array) - stores 4 custom sample questions for each demo
    - Add `view_count` (integer, default 0) - tracks number of times demo page is visited
    - Add `last_visited` (timestamptz, nullable) - tracks when demo was last visited
  
  2. Security
    - No changes to RLS policies needed - these fields follow existing access patterns
*/

-- Add custom_questions field to store custom sample questions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'demo_pages' AND column_name = 'custom_questions'
  ) THEN
    ALTER TABLE demo_pages ADD COLUMN custom_questions text[] DEFAULT NULL;
  END IF;
END $$;

-- Add view_count field to track page visits
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'demo_pages' AND column_name = 'view_count'
  ) THEN
    ALTER TABLE demo_pages ADD COLUMN view_count integer DEFAULT 0 NOT NULL;
  END IF;
END $$;

-- Add last_visited field to track when demo was last viewed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'demo_pages' AND column_name = 'last_visited'
  ) THEN
    ALTER TABLE demo_pages ADD COLUMN last_visited timestamptz DEFAULT NULL;
  END IF;
END $$;