// Shop functionality for krrrZen

let cart = [];
let products = [];
// Use the client initialized in config.js
// Renamed to 'db' to avoid conflict with global 'supabase' variable from library
const db = window.supabaseClient;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    if (!db) {
        console.error('Supabase client not initialized! Check config.js.');
        return;
    }
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('krrrzen_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
    
    // Load products
    loadProducts();
    
    // Setup event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Cart button
    document.getElementById('cart-btn')?.addEventListener('click', openCartModal);

    // Mobile menu toggle
    document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
        document.getElementById('mobile-nav').classList.toggle('hidden');
    });
    
    // Close cart modal
    document.getElementById('close-cart-btn')?.addEventListener('click', closeCartModal);
    
    // Checkout button
    document.getElementById('checkout-btn')?.addEventListener('click', openCheckoutModal);
    
    // Close checkout modal
    document.getElementById('close-checkout-btn')?.addEventListener('click', closeCheckoutModal);
    
    // Checkout form
    document.getElementById('checkout-form')?.addEventListener('submit', handleCheckout);
    
    // Close confirmation modal
    document.getElementById('close-confirmation-btn')?.addEventListener('click', closeConfirmationModal);
    
    // Newsletter form
    document.getElementById('newsletter-form')?.addEventListener('submit', handleNewsletterSubmit);
}

// Newsletter Subscription
async function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('email-input');
    const email = emailInput.value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    if (!email) return;
    
    // Simple email validation
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        showToast('Please enter a valid email address.');
        return;
    }
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing...';
        
        // Insert into subscribers table
        const { error } = await db
            .from('subscribers')
            .insert([{ email }]);
        
        if (error) {
            // Check for unique key violation (code 23505)
            if (error.code === '23505' || error.message.includes('unique')) {
                showToast('You are already subscribed!');
            } else {
                console.error('Newsletter error:', error);
                showToast('Could not subscribe. Please try again.');
            }
        } else {
            showToast('Thanks for subscribing!');
            emailInput.value = '';
        }
    } catch (error) {
        console.error('Newsletter error:', error);
        showToast('Something went wrong. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Load products from Supabase
async function loadProducts() {
    try {
        const { data, error } = await db
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        products = data;
        displayProducts(data);
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('products-container').innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-coral-red">Error loading products. Please refresh the page.</p>
            </div>
        `;
    }
}

function displayProducts(products) {
    const container = document.getElementById('products-container');
    
    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-deep-charcoal">No products available at the moment. Check back soon!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="bg-ivory rounded-lg shadow-md p-4 border-2 border-soft-pink hover:shadow-xl transition-all transform hover:scale-105 product-card">
            <img 
                src="${product.image_url}" 
                alt="${product.name}" 
                class="rounded-md mb-4 w-full h-48 object-cover"
                onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Available'"
            >
            <h3 class="font-cormorant text-xl text-deep-charcoal mb-2">${product.name}</h3>
            ${product.description ? `<p class="text-sm text-gray-600 mb-2 line-clamp-2">${product.description}</p>` : ''}
            <p class="font-lato text-coral-red font-bold text-lg mb-3">₹${parseFloat(product.price).toFixed(2)}</p>
            ${product.stock_quantity > 0 ? `
                <button 
                    onclick="addToCart('${product.id}')" 
                    class="w-full bg-coral-red text-white font-quicksand font-bold py-2 px-4 rounded-full shadow-lg hover:bg-opacity-90 transition-colors"
                >
                    <span class="material-icons align-middle text-sm">add_shopping_cart</span> Add to Cart
                </button>
            ` : `
                <button 
                    disabled 
                    class="w-full bg-gray-400 text-white font-quicksand font-bold py-2 px-4 rounded-full cursor-not-allowed"
                >
                    Out of Stock
                </button>
            `}
        </div>
    `).join('');
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Check stock
        if (existingItem.quantity >= product.stock_quantity) {
            alert(`Sorry, only ${product.stock_quantity} items available in stock.`);
            return;
        }
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            quantity: 1,
            stock_quantity: product.stock_quantity
        });
    }
    
    saveCart();
    updateCartUI();
    
    // Show feedback
    showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    displayCartItems();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    if (newQuantity > item.stock_quantity) {
        alert(`Sorry, only ${item.stock_quantity} items available in stock.`);
        return;
    }
    
    item.quantity = newQuantity;
    saveCart();
    updateCartUI();
    displayCartItems();
}

function saveCart() {
    localStorage.setItem('krrrzen_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        cartCount.textContent = totalItems;
        cartCount.classList.remove('hidden');
    } else {
        cartCount.classList.add('hidden');
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Modal Functions
function openCartModal() {
    displayCartItems();
    document.getElementById('cart-modal').classList.remove('hidden');
}

function closeCartModal() {
    document.getElementById('cart-modal').classList.add('hidden');
}

function displayCartItems() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <span class="material-icons text-gray-400" style="font-size: 64px;">shopping_cart</span>
                <p class="text-deep-charcoal mt-4">Your cart is empty</p>
            </div>
        `;
        totalEl.textContent = '₹0.00';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="flex items-center gap-4 mb-4 pb-4 border-b border-soft-pink">
            <img src="${item.image_url}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
            <div class="flex-1">
                <h4 class="font-quicksand font-bold text-deep-charcoal">${item.name}</h4>
                <p class="text-sm text-coral-red">₹${parseFloat(item.price).toFixed(2)}</p>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="updateQuantity('${item.id}', -1)" class="bg-soft-pink text-deep-charcoal w-8 h-8 rounded-full hover:bg-coral-red hover:text-white transition-colors">
                    <span class="material-icons text-sm">remove</span>
                </button>
                <span class="font-bold text-deep-charcoal w-8 text-center">${item.quantity}</span>
                <button onclick="updateQuantity('${item.id}', 1)" class="bg-soft-pink text-deep-charcoal w-8 h-8 rounded-full hover:bg-coral-red hover:text-white transition-colors">
                    <span class="material-icons text-sm">add</span>
                </button>
            </div>
            <button onclick="removeFromCart('${item.id}')" class="text-coral-red hover:text-red-700 transition-colors">
                <span class="material-icons">delete</span>
            </button>
        </div>
    `).join('');
    
    totalEl.textContent = `₹${getCartTotal().toFixed(2)}`;
}

function openCheckoutModal() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    closeCartModal();
    displayCheckoutSummary();
    document.getElementById('checkout-modal').classList.remove('hidden');
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.add('hidden');
}

function displayCheckoutSummary() {
    const container = document.getElementById('checkout-items');
    const totalEl = document.getElementById('checkout-total');
    const paymentAmountEl = document.getElementById('payment-amount');
    
    const total = getCartTotal();
    
    container.innerHTML = cart.map(item => `
        <div class="flex justify-between items-center mb-2">
            <span class="text-sm">${item.name} × ${item.quantity}</span>
            <span class="text-sm font-bold">₹${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    totalEl.textContent = `₹${total.toFixed(2)}`;
    paymentAmountEl.textContent = `₹${total.toFixed(2)}`;
    
    // Setup UPI & QR Code
    const upiId = SUPABASE_CONFIG.upiId;
    const amount = total.toFixed(2);
    
    // Construct MINIMAL UPI link
    // Removing 'pn' (Payee Name) allows the UPI app to verify the VPA itself
    // Removing 'tn' (Note) avoids character encoding flags
    const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&am=${encodeURIComponent(amount)}&cu=INR`;
    
    // Set QR Code
    // Note: QR Server sometimes has issues with long URLs, but usually fine for standard UPI
    document.getElementById('payment-qr-code').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;
    
    // Setup Mobile Button
    const mobileBtn = document.getElementById('open-upi-btn');
    if (mobileBtn) {
        mobileBtn.onclick = () => window.location.href = upiLink;
    }
}

async function handleCheckout(e) {
    e.preventDefault();
    
    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const customerAddress = document.getElementById('customer-address').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    const totalAmount = getCartTotal();
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        // Create order in database
        const orderData = {
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
            customer_address: customerAddress,
            total_amount: totalAmount,
            status: 'pending',
            payment_status: 'user_confirmed'
        };
        
        const { data: order, error: orderError } = await db
            .from('orders')
            .insert([orderData])
            .select()
            .single();
        
        if (orderError) throw orderError;
        
        // Create order items
        const orderItems = cart.map(item => ({
            order_id: order.id,
            product_id: item.id,
            product_name: item.name,
            product_price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
        }));
        
        const { error: itemsError } = await db
            .from('order_items')
            .insert(orderItems);
        
        if (itemsError) throw itemsError;
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartUI();
        
        // Close checkout modal
        closeCheckoutModal();
        
        // Show confirmation
        document.getElementById('order-id').textContent = order.id.substring(0, 8);
        document.getElementById('confirmation-modal').classList.remove('hidden');
        
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Error placing order. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

function closeConfirmationModal() {
    document.getElementById('confirmation-modal').classList.add('hidden');
}

// Toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-sage-green text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Expose functions globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
