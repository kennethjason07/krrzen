# Admin Quick Reference Guide

## 🔐 Admin Login

**URL**: Open `admin.html` in your browser

**Default Credentials** (if you used the sample):

- Email: `admin@krrzen.com`
- Password: `admin123`

⚠️ **IMPORTANT**: Change these credentials immediately after first login!

## 📦 Managing Products

### Adding a New Product

1. Click the "Add Product" button
2. Fill in all required fields:
   - **Product Name**: Clear, descriptive name
   - **Description**: Detailed product description
   - **Price**: In dollars (e.g., 25.00)
   - **Category**: Select "crochet" or "jewelry"
   - **Stock Quantity**: Number of items available
   - **Image URL**: Full URL to product image
3. Click "Save Product"

### Getting Image URLs

**Option 1 - Upload to Image Hosting**:

- Use [Imgur](https://imgur.com) (free)
- Use [ImgBB](https://imgbb.com) (free)
- Upload image → Copy direct link

**Option 2 - Use Google Drive**:

1. Upload image to Google Drive
2. Right-click → Get link → Change to "Anyone with the link"
3. Copy the file ID from the URL
4. Use format: `https://drive.google.com/uc?export=view&id=FILE_ID`

**Option 3 - Use Existing URLs**:

- Right-click on any online image → Copy image address

### Editing a Product

1. Find the product in the products list
2. Click "Edit"
3. Make your changes
4. Click "Save Product"

### Deleting a Product

1. Find the product in the products list
2. Click "Delete"
3. Confirm the deletion

### Activating/Deactivating Products

- Toggle the "Active" checkbox on any product
- Inactive products won't show on the website
- Useful for temporarily hiding out-of-stock items

## 📋 Managing Orders

### Order Statuses

**Payment Status**:

- **Pending**: Order created, waiting for customer payment
- **User Confirmed**: Customer claims they paid
- **Admin Verified**: You confirmed receiving payment
- **Failed**: Payment not received/rejected

**Order Status**:

- **Pending**: New order, payment not verified
- **Confirmed**: Payment verified, ready to prepare
- **Shipped**: Order has been shipped
- **Delivered**: Order delivered to customer
- **Cancelled**: Order cancelled

### Processing New Orders

When a new order comes in:

1. **Check the Orders Tab**
   - You'll see a red badge with the number of pending orders
   - Click on "Orders" tab

2. **View Order Details**
   - Click on any order to see full details
   - Review customer information and items ordered

3. **Verify Payment**
   - Open your UPI app (PhonePe, Google Pay, etc.)
   - Check for payment matching the order amount
   - Verify the amount and timing

4. **Confirm or Reject**
   - If payment received: Click "✓ Confirm Payment Received"
   - If payment not received: Click "✗ Payment Not Received"
   - Add a reason if rejecting

5. **Ship the Order**
   - Prepare the items
   - Pack them securely
   - Click "Mark as Shipped" when ready
   - (Optional) Add tracking info in admin notes

### Order Notifications

- The system checks for new orders every 30 seconds
- A badge appears on the "Orders" tab when there are pending payments
- Keep the admin panel open to receive notifications

## 💰 Payment Verification Checklist

Before confirming an order:

- [ ] Check UPI app for incoming payment
- [ ] Verify amount matches order total exactly
- [ ] Check payment timestamp matches order time (within reasonable window)
- [ ] Verify customer phone number if shown in UPI transaction
- [ ] If unsure, contact customer via phone/email

## 📊 Best Practices

### Product Management

1. **Use High-Quality Images**
   - Minimum 800x800 pixels
   - Clear, well-lit photos
   - Show product from multiple angles if possible

2. **Write Detailed Descriptions**
   - Include materials used
   - Mention dimensions/size
   - Highlight unique features
   - Add care instructions

3. **Keep Stock Updated**
   - Update stock quantity when items sell
   - Mark as inactive when out of stock
   - Reactivate when restocked

4. **Pricing Strategy**
   - Include material costs
   - Account for time spent
   - Consider shipping costs
   - Research competitor pricing

### Order Management

1. **Respond Quickly**
   - Check orders at least 2-3 times daily
   - Verify payments within 24 hours
   - Ship within 2-3 business days

2. **Communicate with Customers**
   - Send email confirmation when payment verified
   - Notify when shipped
   - Provide tracking information if available

3. **Handle Issues Professionally**
   - If payment not received, contact customer first
   - Give 24-48 hours for response before cancelling
   - Document all communications

4. **Keep Records**
   - Use admin notes field for important information
   - Track shipping details
   - Note any special requests

## 🔧 Common Tasks

### Checking Total Sales

1. Go to Supabase dashboard
2. Click "Table Editor"
3. Select "orders" table
4. Filter by `payment_status = 'admin_verified'`
5. Sum the `total_amount` column

### Finding Specific Orders

1. Go to Orders tab
2. Orders are sorted by date (newest first)
3. Click on any order to view details
4. Use browser search (Ctrl+F) to find customer name

### Updating Product Stock

1. Go to Products tab
2. Click "Edit" on the product
3. Update the "Stock Quantity" field
4. Click "Save Product"

## 🚨 Troubleshooting

### Can't Log In?

- Check email and password are correct
- Clear browser cache and try again
- Verify admin user exists in database

### Products Not Showing?

- Check if product is marked as "Active"
- Verify image URL is working
- Check browser console for errors

### Orders Not Appearing?

- Refresh the page
- Check if you're connected to internet
- Verify Supabase project is active

### Payment Verification Issues?

- Double-check UPI transaction details
- Contact customer if unsure
- When in doubt, wait for customer confirmation

## 📱 Mobile Access

The admin panel works on mobile devices:

1. Open `admin.html` on your phone
2. Log in with your credentials
3. Manage orders on the go!

**Tips for Mobile**:

- Use landscape mode for better view
- Bookmark the admin page for quick access
- Enable notifications in your browser

## 🔒 Security Tips

1. **Never Share Admin Credentials**
   - Keep your login details private
   - Don't save password in public computers

2. **Use Strong Password**
   - At least 12 characters
   - Mix of letters, numbers, symbols
   - Change regularly

3. **Log Out When Done**
   - Always click "Logout" when finished
   - Especially on shared computers

4. **Monitor Access**
   - Check "last_login" in admin_users table
   - Report any suspicious activity

## 📞 Quick Contact Info

**UPI ID**: 9972312878@ybl

**Support**: Keep the SETUP_GUIDE.md handy for technical issues

## ✅ Daily Checklist

Morning:

- [ ] Check for new orders
- [ ] Verify any pending payments
- [ ] Update stock for sold items

Afternoon:

- [ ] Process confirmed orders
- [ ] Prepare items for shipping
- [ ] Update order statuses

Evening:

- [ ] Final check for new orders
- [ ] Respond to any customer queries
- [ ] Plan next day's tasks

---

**Remember**: Great customer service leads to repeat customers! 🌟
