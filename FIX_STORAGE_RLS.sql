-- FIX STORAGE UPLOAD PERMISSIONS
-- Run this in Supabase SQL Editor to allow public uploads to the 'products' bucket

-- 1. Create the bucket if it doesn't exist (public by default)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing restrictive policies on storage.objects
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;

-- 3. Create a permissive policy allowing ANYONE to select, insert, update, delete objects in 'products' bucket
CREATE POLICY "Allow public access to products bucket" ON storage.objects
    FOR ALL USING (bucket_id = 'products')
    WITH CHECK (bucket_id = 'products');

-- 4. Ensure RLS is enabled on objects table (it should be, but just in case)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
