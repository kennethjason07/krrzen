# krrrZen Backend Setup Guide

This guide will walk you through setting up the complete backend for your krrrZen e-commerce website using Supabase.

## 📋 Prerequisites

- A Supabase account (free tier works fine)
- Basic understanding of SQL

## 🚀 Step-by-Step Setup

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the details:
   - **Project Name**: krrrzen
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
5. Click "Create new project" and wait for it to initialize (takes ~2 minutes)

### Step 2: Run the Database Schema

1. In your Supabase project dashboard, click on the **SQL Editor** icon in the left sidebar
2. Click "New Query"
3. Open the file `supabase-schema.sql` from your project folder
4. Copy the **entire contents** of the file
5. Paste it into the SQL Editor
6. Click "Run" (or press Ctrl+Enter)
7. You should see a success message. This creates all your database tables!

### Step 3: Get Your API Credentials

1. In your Supabase dashboard, click on the **Settings** icon (gear icon) in the left sidebar
2. Click on "API" in the settings menu
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)
4. **Keep this page open** - you'll need these values in the next step

### Step 4: Configure Your Website

1. Open the file `config.js` in your project folder
2. Replace the placeholder values with your actual Supabase credentials:

```javascript
const SUPABASE_CONFIG = {
  url: "https://your-project-id.supabase.co", // Replace with your Project URL
  anonKey: "your-anon-key-here", // Replace with your anon/public key
  upiId: "9972312878@ybl", // Your UPI ID (already set)
};
```

3. Save the file

### Step 5: Create an Admin User

The schema includes a sample admin user, but you need to set a proper password:

1. Go back to the SQL Editor in Supabase
2. Run this query to create your admin account:

```sql
-- First, delete the sample admin
DELETE FROM admin_users WHERE email = 'admin@krrzen.com';

-- Create your admin user
-- Note: In production, you should hash passwords properly
-- For now, we'll use a simple password (CHANGE THIS AFTER FIRST LOGIN!)
INSERT INTO admin_users (email, password_hash, name)
VALUES ('your-email@example.com', 'admin123', 'Your Name');
```

**IMPORTANT**: This is a simplified setup. For production, you should implement proper password hashing using bcrypt.

### Step 6: Test Your Setup

1. Open `index.html` in your browser
2. You should see products loading (if you ran the schema with sample products)
3. Try adding a product to cart
4. Open `admin.html` in your browser
5. Log in with the email and password you set in Step 5

## 🎨 Adding Products via Admin Panel

1. Go to `admin.html` and log in
2. Click "Add Product"
3. Fill in the product details:
   - **Name**: Product name
   - **Description**: Product description
   - **Price**: Price in dollars (e.g., 25.00)
   - **Category**: Choose "crochet" or "jewelry"
   - **Stock Quantity**: Number of items available
   - **Image URL**: Full URL to the product image
4. Click "Save Product"
5. The product will immediately appear on your homepage!

## 💳 How the Payment Flow Works

### For Customers:

1. Customer adds items to cart
2. Clicks "Checkout"
3. Fills in delivery information
4. Clicks "Open UPI & Confirm Order"
5. Their UPI app opens with pre-filled payment details
6. They complete the payment in their UPI app
7. Order is created with status "User Confirmed"

### For Admin:

1. Admin receives notification of new order (check the "Orders" tab)
2. Admin checks their UPI app for the payment
3. Admin verifies the payment amount matches the order
4. Admin clicks "Confirm Payment Received" in the admin panel
5. Order status changes to "Confirmed"
6. Admin can then mark as "Shipped" when ready

## 📊 Database Tables Explained

### `products`

Stores all your products with details like name, price, images, and stock.

### `orders`

Stores customer orders with delivery information and payment status.

### `order_items`

Links products to orders (one order can have multiple products).

### `admin_users`

Stores admin login credentials.

## 🔒 Security Notes

### Row Level Security (RLS)

The schema includes RLS policies that:

- Allow anyone to view active products
- Allow anyone to create orders (for checkout)
- Require authentication for admin operations

### Important Security Improvements for Production:

1. **Password Hashing**: Implement proper bcrypt password hashing
2. **Email Verification**: Add email verification for orders
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **HTTPS**: Always use HTTPS in production
5. **Environment Variables**: Never commit your API keys to version control

## 🐛 Troubleshooting

### Products not loading?

- Check browser console for errors
- Verify your Supabase credentials in `config.js`
- Make sure you ran the schema SQL successfully

### Can't log in to admin panel?

- Verify you created an admin user in Step 5
- Check the email and password match what you inserted

### Orders not being created?

- Check browser console for errors
- Verify RLS policies are set correctly
- Make sure your Supabase project is active

### UPI payment not opening?

- UPI links only work on mobile devices with UPI apps installed
- For testing on desktop, you can skip the UPI step and manually create orders in the database

## 📱 Testing on Mobile

For the best experience testing the UPI payment flow:

1. Host your website (use Netlify, Vercel, or GitHub Pages)
2. Open the website on your mobile device
3. Add items to cart and proceed to checkout
4. The UPI app should open automatically with pre-filled details

## 🔄 Updating Your Website

After making changes to your HTML, CSS, or JavaScript files:

1. If using a hosting service, push your changes
2. The website will update automatically
3. No need to touch the database unless you're changing the schema

## 📈 Next Steps

### Recommended Enhancements:

1. **Email Notifications**: Set up email notifications when orders are placed
2. **Image Upload**: Add image upload functionality instead of URLs
3. **Order Tracking**: Add order status tracking for customers
4. **Analytics**: Integrate Google Analytics to track sales
5. **Search & Filter**: Add product search and category filtering
6. **Reviews**: Allow customers to leave product reviews

## 💡 Tips

- **Backup**: Regularly backup your database from Supabase dashboard
- **Monitor**: Check the "Database" tab in Supabase to monitor usage
- **Logs**: Use the "Logs" tab to debug issues
- **API Limits**: Free tier has limits - monitor your usage

## 📞 Support

If you encounter issues:

1. Check the browser console for error messages
2. Review the Supabase logs in your dashboard
3. Verify all configuration values are correct
4. Make sure your Supabase project is active and not paused

## 🎉 You're All Set!

Your krrrZen e-commerce website is now fully functional with:

- ✅ Product management via admin panel
- ✅ Shopping cart functionality
- ✅ UPI payment integration
- ✅ Order management system
- ✅ Admin verification workflow

Happy selling! 🐝🌻
