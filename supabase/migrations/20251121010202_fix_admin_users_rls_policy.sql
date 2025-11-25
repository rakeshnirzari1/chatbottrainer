/*
  # Fix Admin Users RLS Policy

  1. Changes
    - Drop the circular dependency policy on admin_users
    - Add a policy that allows authenticated users to check if they are an admin
    - This allows the `isAdmin()` function to work properly
  
  2. Security
    - Users can only check their own admin status
    - Cannot see other users' admin status
*/

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Only admins can view admin list" ON admin_users;

-- Create a policy that allows users to check if they are an admin
CREATE POLICY "Users can check their own admin status"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
