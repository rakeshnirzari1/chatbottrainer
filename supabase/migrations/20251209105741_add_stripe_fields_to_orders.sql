/*
  # Add Stripe Payment Fields to Orders Table

  1. Changes
    - Add `stripe_session_id` column to store Stripe checkout session ID
    - Add `paid_at` column to track payment timestamp
    - Update status check constraint to include 'pending_payment' and 'paid' statuses
  
  2. Purpose
    - Track Stripe checkout sessions for order verification
    - Record when payment was completed
    - Support new payment workflow statuses
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'stripe_session_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN stripe_session_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'paid_at'
  ) THEN
    ALTER TABLE orders ADD COLUMN paid_at timestamptz;
  END IF;
END $$;

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders ADD CONSTRAINT orders_status_check 
  CHECK (status = ANY (ARRAY[
    'pending'::text, 
    'demo_requested'::text, 
    'demo_ready'::text, 
    'pending_payment'::text,
    'paid'::text,
    'payment_received'::text, 
    'training'::text, 
    'ready'::text
  ]));
