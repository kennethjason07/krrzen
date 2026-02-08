# krrrZen - Handcrafted Treasures

A beautiful, responsive e-commerce website for **krrrZen**, showcasing handcrafted crochet items and artisanal jewelry. Built with modern web technologies and designed with love.

![krrrZen Banner](https://img.shields.io/badge/krrrZen-Handcrafted%20Treasures-EF5350?style=for-the-badge)

## 🌟 Features

### Customer Features

- **Responsive Design**: Fully responsive layout that works seamlessly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, elegant design with smooth animations and transitions
- **Dynamic Product Catalog**: Products loaded from Supabase database in real-time
- **Shopping Cart**: Full-featured cart with add/remove items and quantity management
- **UPI Payment Integration**: Seamless checkout with UPI payment (PhonePe, Google Pay, Paytm, etc.)
- **Order Tracking**: Customers receive order confirmation with order ID
- **Mobile-First Checkout**: Optimized checkout flow for mobile devices

### Admin Features

- **Secure Admin Panel**: Dedicated admin interface with authentication
- **Product Management**: Add, edit, delete, and activate/deactivate products
- **Order Management**: View all orders with detailed customer information
- **Payment Verification**: Verify customer payments and confirm orders
- **Order Status Updates**: Mark orders as confirmed, shipped, or delivered
- **Real-time Notifications**: Badge notifications for pending orders
- **Stock Management**: Track and update product inventory

### Technical Features

- **Supabase Backend**: Serverless PostgreSQL database with real-time capabilities
- **Row Level Security**: Database-level security policies
- **localStorage Persistence**: Cart data persists across sessions
- **Accessibility**: WCAG compliant with keyboard navigation support
- **SEO Optimized**: Proper meta tags, semantic HTML, and structured data
- **Performance**: Lazy loading images and optimized assets

## 🎨 Design

The website features a carefully curated color palette:

- **Soft Pink** (#FFCDD2) - Background
- **Coral Red** (#EF5350) - Primary accent
- **Sage Green** (#C5E1A5) - Secondary accent
- **Ivory** (#FFF8F0) - Card backgrounds
- **Deep Charcoal** (#333333) - Text

### Typography

- **Great Vibes** - Logo and headings
- **Dancing Script** - Decorative quotes
- **Playfair Display** - Section headings
- **Cormorant Garamond** - Product names
- **Quicksand** - Buttons and navigation
- **Karla** - Body text
- **Lato** - Supporting text

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A Supabase account (free tier works fine) - [Sign up here](https://supabase.com)
- For UPI payments: A UPI ID (PhonePe, Google Pay, etc.)

### Quick Start (Frontend Only)

If you just want to see the design without backend functionality:

1. **Open** `index.html` in your web browser
2. You'll see the website design (products won't load without backend)

### Full Setup (With Backend)

For the complete e-commerce experience with database and payments:

1. **Clone or download** this repository to your local machine

2. **Set up Supabase backend**:
   - Follow the detailed instructions in [`SETUP_GUIDE.md`](SETUP_GUIDE.md)
   - This takes about 10-15 minutes
   - You'll create a database, get API keys, and configure the website

3. **Configure the website**:
   - Open `config.js`
   - Add your Supabase URL and API key
   - Verify your UPI ID is correct

4. **Test locally**:

   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Node.js (http-server)
   npx http-server

   # Using PHP
   php -S localhost:8000
   ```

5. **Visit** `http://localhost:8000` in your browser

6. **Access admin panel** at `http://localhost:8000/admin.html`

### For Admins

See [`ADMIN_GUIDE.md`](ADMIN_GUIDE.md) for:

- How to add products
- How to manage orders
- How to verify payments
- Daily operation checklist

## 📁 Project Structure

```
krrzen/
│
├── index.html              # Main customer-facing website
├── admin.html              # Admin panel interface
├── styles.css              # Custom CSS styles and animations
├── script.js               # General JavaScript functionality
├── shop.js                 # E-commerce and cart functionality
├── admin.js                # Admin panel functionality
├── config.js               # Supabase configuration (add your credentials here)
├── supabase-schema.sql     # Database schema for Supabase
├── README.md               # Project documentation
├── SETUP_GUIDE.md          # Step-by-step backend setup instructions
└── ADMIN_GUIDE.md          # Admin user guide
```

## 🛠️ Technologies Used

### Frontend

- **HTML5** - Semantic markup
- **CSS3** - Custom styles and animations
- **JavaScript (ES6+)** - Interactive features and business logic
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **Google Fonts** - Typography (Great Vibes, Dancing Script, Playfair Display, etc.)
- **Material Icons** - Icon library

### Backend

- **Supabase** - Backend-as-a-Service (PostgreSQL database, authentication, real-time)
- **PostgreSQL** - Relational database
- **Row Level Security (RLS)** - Database-level access control

### Payment

- **UPI (Unified Payments Interface)** - Indian payment system integration

## ✨ Key Features Explained

### Mobile Menu

- Responsive hamburger menu for mobile devices
- Smooth slide-in animation
- Auto-closes when navigation link is clicked

### Newsletter Form

- Email validation
- Loading states during submission
- Success/error messages
- Form reset after successful submission

### Product Cards

- Hover effects with scale and shadow transitions
- Responsive grid layout (2 columns on mobile, 3 on tablet, 4 on desktop)
- Click tracking for analytics

### Shopping Cart

- Add products to cart (functionality ready for integration)
- Cart count badge on shopping bag icon
- localStorage persistence
- Accessible via `window.krrrzenCart` object

### Accessibility Features

- Semantic HTML5 elements
- ARIA labels for icon buttons
- Keyboard navigation support
- Focus states for interactive elements
- Alt text for all images
- Skip to main content link

## 🎯 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔧 Customization

### Changing Colors

Edit the CSS variables in `styles.css`:

```css
:root {
  --soft-pink: #ffcdd2;
  --coral-red: #ef5350;
  --sage-green: #c5e1a5;
  --ivory: #fff8f0;
  --deep-charcoal: #333333;
}
```

### Adding Products

Add new product cards in `index.html` within the Featured Products section:

```html
<div
  class="bg-ivory rounded-lg shadow-md p-4 border-2 border-soft-pink hover:shadow-xl transition-all transform hover:scale-105"
>
  <img
    alt="Product Name"
    class="rounded-md mb-4 w-full h-48 object-cover"
    src="your-image-url.jpg"
  />
  <h3 class="font-cormorant text-xl text-deep-charcoal">Product Name</h3>
  <p class="font-lato text-deep-charcoal mt-1">$XX.XX</p>
</div>
```

### Newsletter Integration

Replace the simulated API call in `script.js` with your actual email service:

```javascript
// In the newsletter form submit handler
fetch("YOUR_API_ENDPOINT", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email: email }),
})
  .then((response) => response.json())
  .then((data) => {
    showMessage("Thank you for subscribing!", "success");
  })
  .catch((error) => {
    showMessage("Something went wrong. Please try again.", "error");
  });
```

## 📊 Analytics Integration

The code includes placeholders for Google Analytics tracking. To enable:

1. Add your Google Analytics script to `index.html`:

```html
<!-- Google Analytics -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
```

2. The following events are already tracked:
   - Newsletter signups
   - Product clicks
   - Cart interactions

## 🚀 Deployment

### GitHub Pages

1. Push your code to a GitHub repository
2. Go to Settings → Pages
3. Select your branch and root folder
4. Your site will be live at `https://yourusername.github.io/krrzen`

### Netlify

1. Drag and drop the project folder to [Netlify Drop](https://app.netlify.com/drop)
2. Your site will be live instantly with a custom URL

### Vercel

```bash
npm i -g vercel
vercel
```

## 📝 Future Enhancements

- [x] Product detail pages
- [x] Shopping cart checkout flow
- [x] Payment integration (UPI)
- [x] Admin dashboard for product management
- [ ] Product filtering and search
- [ ] Customer reviews section
- [ ] Blog section for crafting tips
- [ ] Multi-language support
- [ ] Email notifications (integration ready)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**krrrZen**

- Website: [krrrzen.com](#)
- Instagram: [@krrrzen](#)
- Facebook: [krrrZen](#)

## 💖 Acknowledgments

- Design inspiration from modern handcraft e-commerce sites
- Icons by [Google Material Icons](https://fonts.google.com/icons)
- Fonts by [Google Fonts](https://fonts.google.com)

---

**Crafted with love, worn with joy.** 🐝🌻
"# krrzen" 
