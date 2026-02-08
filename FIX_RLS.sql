-- FIX LOGIN ISSUES
-- Run this in your Supabase SQL Editor to fix the 406 error and allow login

-- 1. update the RLS policy for admin_users to allow login checks
DROP POLICY IF EXISTS "Only authenticated can view admin users" ON admin_users;

CREATE POLICY "Enable read access for all users" ON admin_users
    FOR SELECT USING (true);

-- 2. Ensure products are visible
DROP POLICY IF EXISTS "Public can view active products" ON products;

CREATE POLICY "Enable read access for all users" ON products
    FOR SELECT USING (true);
    
-- 3. Ensure orders creation is allowed
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;

CREATE POLICY "Enable insert for all users" ON orders
    FOR INSERT WITH CHECK (true);
