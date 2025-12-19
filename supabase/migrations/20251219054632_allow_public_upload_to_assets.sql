/*
  # Allow Public Upload to Assets Bucket

  1. Changes
    - Allow public (including anon) users to upload to assets bucket
    - This is needed for the logo upload script
    
  2. Security Note
    - Assets bucket is for public files like logos
    - We'll restrict this further in production if needed
*/

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;

-- Allow anyone to upload to assets bucket
CREATE POLICY "Anyone can upload to assets"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'assets');