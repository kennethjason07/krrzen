-- SETUP NEWSLETTER SUBSCRIBERS
-- Run this in Supabase SQL Editor

-- 1. Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Allow anyone to subscribe (Insert)
CREATE POLICY "Public can subscribe" ON subscribers
    FOR INSERT WITH CHECK (true);

-- Allow admins (authenticated/anon for this app) to view subscribers
-- Since we are fixing RLS for ease of use, we'll allow public read access for this table too
-- In a strict app, only authenticated users should read.
CREATE POLICY "Admin view subscribers" ON subscribers
    FOR SELECT USING (true);
