-- FIX LOGIN AND PERMISSION ISSUES
-- Run this entire script in your Supabase SQL Editor to fix permissions

-- 1. Admin Users: Allow login checks
DROP POLICY IF EXISTS "Only authenticated can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Enable read access for all users" ON admin_users;

CREATE POLICY "Enable read access for all users" ON admin_users
    FOR SELECT USING (true);

-- 2. Products: Ensure public visibility and admin management
DROP POLICY IF EXISTS "Public can view active products" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;
DROP POLICY IF EXISTS "Enable all access for all users" ON products;

CREATE POLICY "Enable read access for all users" ON products
    FOR SELECT USING (true);

CREATE POLICY "Enable all access for all users" ON products
    FOR ALL USING (true);
    
-- 3. Orders: Ensure creation and updates (for admin actions)
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Enable insert for all users" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
DROP POLICY IF EXISTS "Enable update for all users" ON orders;

CREATE POLICY "Enable insert for all users" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON orders
    FOR UPDATE USING (true);
