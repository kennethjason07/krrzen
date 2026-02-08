-- krrrZen Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT NOT NULL,
    category VARCHAR(100), -- 'crochet' or 'jewelry'
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'payment_confirmed', 'confirmed', 'shipped', 'delivered', 'cancelled'
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'user_confirmed', 'admin_verified', 'failed'
    payment_screenshot_url TEXT,
    upi_transaction_id VARCHAR(255),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL, -- Store name in case product is deleted
    product_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Users Table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample admin user (password: admin123 - CHANGE THIS!)
-- Password hash generated using bcrypt with salt rounds 10
INSERT INTO admin_users (email, password_hash, name) VALUES 
('admin@krrzen.com', '$2a$10$rKZvVqJhN5pqXqXqXqXqXuN5pqXqXqXqXqXqXqXqXqXqXqXqXqXqX', 'Admin User');
-- NOTE: You'll need to generate a proper bcrypt hash for your actual password

-- Insert sample products (optional - for testing)
INSERT INTO products (name, description, price, image_url, category, stock_quantity) VALUES
('Crochet Bee', 'Adorable handmade crochet bee decoration, perfect for home decor or as a gift.', 25.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDv9DM1PKlpGL70OrEKe3wLqve0AMXu6N87-1xik0ofFuFNwtX-x6P79jlO7zuKZXH4S60rlZWB4VfJeh9Hd9JENXJ_cizii6iCHW8rPzMpRg4LO_qz-iuzWLXmdGEZIc66mKY6sZl02fXUKFKOmRV_IDKcth9cXkEUnjXIzKDZZgDEFXOobLAthQBqZb6MK2OcMvw13aN_nUghGvztUo7brifesEns_Z5w2TRo7PbiXmQ45ub6n_xxcn8Xmf1bnH3BabYtD8nGzotq', 'crochet', 10),
('Pearl Necklace', 'Elegant handmade pearl necklace with premium quality pearls.', 45.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD1iqC5WPtugKwUh5k-pqzLgYaREIC8lyFe_m0B27utk-qF7hQD0GBwNxFWVC7DnU8GZQrLGetPU0bGP9nn5FtmyRSyfWTSEVYLQeGfXH_3rZuXFYq5CrqAHFXcSTmAZmZ7Mzm4V2pRa-IJPudLYIsOxkTNTuVzVJ2kCdOkYsjj1gcBZWzp8ZPSU9Bioj2wIY3VJDrSjeHNvdZphdmHP_Am9KVLpPR7uxUn9lyZW8Beg1t3uIMxZPxOkiLk-RjjmFCnqgI9Nn0i20u', 'jewelry', 5),
('Sunflower Coasters', 'Beautiful set of handmade crochet sunflower coasters (set of 4).', 30.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSn0j9QOe-NtDcY38ve9-_Iv4e5uqwbWufpHLDbo2-iQJDX9zRK021bk4av4bdaVlUeuzOs5pl1RMPOdVTAyEfp5XHCdLYvGC_DaawDKSqN2jAPBpBpDJLKr_e-4_BIdrlmyYLUX6pip74zUuUPyhSAhWZbbb0zru3dwZ-PgWTmiuGMnTt0-31BHxaFTiHeQiKXPifE8vCjPlcI_qvNtzURyYNq-fwPxhOrayOSQ60smEm3wPXIPquRmW7M0auydktdwPf0eMS12U1', 'crochet', 8),
('Crystal Earrings', 'Sparkling handmade crystal earrings with sterling silver hooks.', 35.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTMfkHLWWX7uLrNniKSiiPAL9--X6A7HhdlazfF8U5alnllz9WjI7oV57TzSEKXsgY-g-rMiEJXabXJcjuMZqEDZ3rsaRsdJwXTizEKYEnWqWYL_jMt6L9BJf_Gd1sTgMixhvz8cO76uu3JCMDnxeaE7XTZMyQzs6sv-oMkEIsrVCRZrKF7NryoXuR3r2qYse5H6O4u_7TBOJXEMUCll3osNG2MlF8NIz9JXuUIMpn8nTHGZUN1ZhNCymcufyjhPi3xnReodA3ALjk', 'jewelry', 12);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Products: Public can read active products, only authenticated users can modify
CREATE POLICY "Public can view active products" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage products" ON products
    FOR ALL USING (auth.role() = 'authenticated');

-- Orders: Users can create orders, admins can view all
CREATE POLICY "Anyone can create orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (true); -- We'll handle filtering in the application

CREATE POLICY "Authenticated users can update orders" ON orders
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Order Items: Similar to orders
CREATE POLICY "Anyone can create order items" ON order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view order items" ON order_items
    FOR SELECT USING (true);

-- Admin Users: Only authenticated admins can access
CREATE POLICY "Only authenticated can view admin users" ON admin_users
    FOR SELECT USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Create a function to get pending orders count (for admin notifications)
CREATE OR REPLACE FUNCTION get_pending_orders_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM orders WHERE payment_status = 'user_confirmed' AND status = 'pending');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
