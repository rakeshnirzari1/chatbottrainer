/*
  # Add Function to Increment Demo Page Views

  1. New Function
    - `increment_demo_view(demo_id uuid)` - increments view_count and updates last_visited timestamp
    
  2. Security
    - Function is accessible to anonymous users (for tracking demo views)
    - Only updates specific fields, no security risk
*/

-- Create function to increment demo page view count
CREATE OR REPLACE FUNCTION increment_demo_view(demo_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE demo_pages
  SET 
    view_count = view_count + 1,
    last_visited = now()
  WHERE id = demo_id;
END;
$$;