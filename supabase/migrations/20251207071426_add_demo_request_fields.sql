/*
  # Add Demo Request Fields to Orders Table

  1. Changes
    - Add `customer_name` field for storing customer's full name
    - Add `customer_phone` field for storing customer's phone number
    - Add new status value 'demo_requested' to the status enum
    - Add new status value 'demo_ready' to the status enum
    - Update status check constraint to include new values

  2. Migration Details
    - Adds name field (text, nullable initially for existing records)
    - Adds phone field (text, nullable)
    - Drops and recreates status constraint with new values
    
  3. New Status Flow
    - pending → demo_requested → demo_ready → payment_received → training → ready
*/

-- Add customer name and phone fields to orders table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'customer_name'
  ) THEN
    ALTER TABLE orders ADD COLUMN customer_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'customer_phone'
  ) THEN
    ALTER TABLE orders ADD COLUMN customer_phone text;
  END IF;
END $$;

-- Drop existing status constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Add new constraint with updated status values
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending', 'demo_requested', 'demo_ready', 'payment_received', 'training', 'ready'));

-- Update default status to 'demo_requested' for new orders
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'demo_requested';