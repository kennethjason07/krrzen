-- FIX PRODUCT DELETION
-- WARNING: This allows anyone to modify products. In production, use Supabase Auth.

-- 1. Update RLS policy for products table to allow all operations (INSERT, UPDATE, DELETE) for everyone
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;

CREATE POLICY "Enable full access for all users" ON products
    FOR ALL USING (true);
