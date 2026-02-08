// Admin Panel JavaScript for krrrZen

let currentAdmin = null;

// Initialize Supabase from config.js
const supabase = window.supabaseClient;

// Check if admin is logged in
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    setupEventListeners();
});

function checkAdminAuth() {
    const adminData = localStorage.getItem('krrrzen_admin');
    if (adminData) {
        currentAdmin = JSON.parse(adminData);
        showDashboard();
    }
}

function setupEventListeners() {
    // Login form
    document.getElementById('login-form')?.addEventListener('submit', handleLogin);
    
    // Logout button
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Add product button
    document.getElementById('add-product-btn')?.addEventListener('click', () => openProductModal());
    
    // Product form
    document.getElementById('product-form')?.addEventListener('submit', handleProductSubmit);
    
    // Cancel product button
    document.getElementById('cancel-product-btn')?.addEventListener('click', closeProductModal);
    
    // Close order modal
    document.getElementById('close-order-modal')?.addEventListener('click', closeOrderModal);
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const errorEl = document.getElementById('login-error');
    
    try {
        // For demo purposes, using simple authentication
        // In production, use proper password hashing and Supabase Auth
        const { data, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', email)
            .eq('is_active', true)
            .single();
        
        if (error || !data) {
            throw new Error('Invalid credentials');
        }
        
        // Store admin data (in production, verify password hash)
        currentAdmin = {
            id: data.id,
            email: data.email,
            name: data.name
        };
        
        localStorage.setItem('krrrzen_admin', JSON.stringify(currentAdmin));
        
        // Update last login
        await supabase
            .from('admin_users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', data.id);
        
        showDashboard();
    } catch (error) {
        errorEl.textContent = 'Invalid email or password';
        errorEl.classList.remove('hidden');
        errorEl.classList.add('error-message');
    }
}

function handleLogout() {
    localStorage.removeItem('krrrzen_admin');
    currentAdmin = null;
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('login-form').reset();
}

function showDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.remove('hidden');
    document.getElementById('admin-name').textContent = currentAdmin.name;
    
    loadProducts();
    loadOrders();
    startOrderPolling();
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('border-coral-red', 'text-coral-red');
            btn.classList.remove('border-transparent', 'text-deep-charcoal');
        } else {
            btn.classList.remove('border-coral-red', 'text-coral-red');
            btn.classList.add('border-transparent', 'text-deep-charcoal');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.getElementById(`${tabName}-tab`).classList.remove('hidden');
}

// Products Management
async function loadProducts() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        displayProducts(data);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayProducts(products) {
    const container = document.getElementById('products-list');
    
    if (!products || products.length === 0) {
        container.innerHTML = '<p class="text-center text-deep-charcoal col-span-full">No products yet. Add your first product!</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="bg-ivory rounded-lg shadow-md p-4 border-2 border-soft-pink">
            <img src="${product.image_url}" alt="${product.name}" class="rounded-md mb-4 w-full h-48 object-cover">
            <h3 class="font-quicksand text-xl text-deep-charcoal mb-2">${product.name}</h3>
            <p class="text-sm text-gray-600 mb-2 line-clamp-2">${product.description || ''}</p>
            <p class="text-lg font-bold text-coral-red mb-2">$${parseFloat(product.price).toFixed(2)}</p>
            <p class="text-sm text-deep-charcoal mb-4">Stock: ${product.stock_quantity} | ${product.category}</p>
            <div class="flex items-center justify-between mb-4">
                <label class="flex items-center cursor-pointer">
                    <input type="checkbox" ${product.is_active ? 'checked' : ''} onchange="toggleProductStatus('${product.id}', this.checked)" class="mr-2">
                    <span class="text-sm">Active</span>
                </label>
            </div>
            <div class="flex space-x-2">
                <button onclick="editProduct('${product.id}')" class="flex-1 bg-sage-green text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition-colors">
                    Edit
                </button>
                <button onclick="deleteProduct('${product.id}')" class="flex-1 bg-coral-red text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition-colors">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

function openProductModal(productId = null) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('product-modal-title');
    const form = document.getElementById('product-form');
    
    form.reset();
    document.getElementById('product-id').value = '';
    
    if (productId) {
        title.textContent = 'Edit Product';
        loadProductData(productId);
    } else {
        title.textContent = 'Add Product';
    }
    
    modal.classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

async function loadProductData(productId) {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();
        
        if (error) throw error;
        
        document.getElementById('product-id').value = data.id;
        document.getElementById('product-name').value = data.name;
        document.getElementById('product-description').value = data.description || '';
        document.getElementById('product-price').value = data.price;
        document.getElementById('product-category').value = data.category;
        document.getElementById('product-stock').value = data.stock_quantity;
        document.getElementById('product-image').value = data.image_url;
    } catch (error) {
        console.error('Error loading product:', error);
    }
}

async function handleProductSubmit(e) {
    e.preventDefault();
    
    const productId = document.getElementById('product-id').value;
    const productData = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        stock_quantity: parseInt(document.getElementById('product-stock').value),
        image_url: document.getElementById('product-image').value,
        is_active: true
    };
    
    try {
        let result;
        if (productId) {
            // Update existing product
            result = await supabase
                .from('products')
                .update(productData)
                .eq('id', productId);
        } else {
            // Create new product
            result = await supabase
                .from('products')
                .insert([productData]);
        }
        
        if (result.error) throw result.error;
        
        closeProductModal();
        loadProducts();
        alert(productId ? 'Product updated successfully!' : 'Product added successfully!');
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Error saving product. Please try again.');
    }
}

async function toggleProductStatus(productId, isActive) {
    try {
        const { error } = await supabase
            .from('products')
            .update({ is_active: isActive })
            .eq('id', productId);
        
        if (error) throw error;
        
        loadProducts();
    } catch (error) {
        console.error('Error updating product status:', error);
    }
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', productId);
        
        if (error) throw error;
        
        loadProducts();
        alert('Product deleted successfully!');
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
    }
}

window.editProduct = (productId) => openProductModal(productId);
window.deleteProduct = deleteProduct;
window.toggleProductStatus = toggleProductStatus;

// Orders Management
async function loadOrders() {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *
                )
            `)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        displayOrders(data);
        updatePendingOrdersBadge(data);
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

function displayOrders(orders) {
    const container = document.getElementById('orders-list');
    
    if (!orders || orders.length === 0) {
        container.innerHTML = '<p class="text-center text-deep-charcoal p-8">No orders yet.</p>';
        return;
    }
    
    container.innerHTML = orders.map(order => {
        const statusColor = getStatusColor(order.payment_status);
        const itemCount = order.order_items.length;
        
        return `
            <div class="border-b border-soft-pink p-6 hover:bg-gray-50 cursor-pointer" onclick="viewOrderDetails('${order.id}')">
                <div class="flex flex-wrap justify-between items-start gap-4">
                    <div class="flex-1 min-w-[200px]">
                        <p class="font-quicksand font-bold text-deep-charcoal">Order #${order.id.substring(0, 8)}</p>
                        <p class="text-sm text-gray-600">${new Date(order.created_at).toLocaleString()}</p>
                        <p class="text-sm text-deep-charcoal mt-1">${order.customer_name}</p>
                        <p class="text-sm text-gray-600">${order.customer_phone}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-lg font-bold text-coral-red">$${parseFloat(order.total_amount).toFixed(2)}</p>
                        <p class="text-sm text-gray-600">${itemCount} item${itemCount !== 1 ? 's' : ''}</p>
                    </div>
                    <div class="text-right">
                        <span class="inline-block px-3 py-1 rounded-full text-sm font-quicksand ${statusColor}">
                            ${formatStatus(order.payment_status)}
                        </span>
                        <p class="text-sm text-gray-600 mt-1">${formatStatus(order.status)}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getStatusColor(status) {
    const colors = {
        'pending': 'bg-gray-300 text-gray-800',
        'user_confirmed': 'bg-yellow-300 text-yellow-900',
        'admin_verified': 'bg-green-300 text-green-900',
        'failed': 'bg-red-300 text-red-900'
    };
    return colors[status] || 'bg-gray-300 text-gray-800';
}

function formatStatus(status) {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function updatePendingOrdersBadge(orders) {
    const pendingCount = orders.filter(o => o.payment_status === 'user_confirmed').length;
    const badge = document.getElementById('pending-orders-badge');
    
    if (pendingCount > 0) {
        badge.textContent = pendingCount;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

async function viewOrderDetails(orderId) {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *
                )
            `)
            .eq('id', orderId)
            .single();
        
        if (error) throw error;
        
        displayOrderDetails(data);
        document.getElementById('order-modal').classList.remove('hidden');
    } catch (error) {
        console.error('Error loading order details:', error);
    }
}

function displayOrderDetails(order) {
    const container = document.getElementById('order-details-content');
    
    const itemsHtml = order.order_items.map(item => `
        <tr>
            <td class="py-2">${item.product_name}</td>
            <td class="py-2 text-center">${item.quantity}</td>
            <td class="py-2 text-right">$${parseFloat(item.product_price).toFixed(2)}</td>
            <td class="py-2 text-right font-bold">$${parseFloat(item.subtotal).toFixed(2)}</td>
        </tr>
    `).join('');
    
    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <h4 class="font-quicksand font-bold text-deep-charcoal mb-3">Customer Information</h4>
                <p class="mb-2"><strong>Name:</strong> ${order.customer_name}</p>
                <p class="mb-2"><strong>Email:</strong> ${order.customer_email}</p>
                <p class="mb-2"><strong>Phone:</strong> ${order.customer_phone}</p>
                <p class="mb-2"><strong>Address:</strong> ${order.customer_address}</p>
            </div>
            <div>
                <h4 class="font-quicksand font-bold text-deep-charcoal mb-3">Order Information</h4>
                <p class="mb-2"><strong>Order ID:</strong> ${order.id}</p>
                <p class="mb-2"><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
                <p class="mb-2"><strong>Payment Status:</strong> <span class="px-2 py-1 rounded ${getStatusColor(order.payment_status)}">${formatStatus(order.payment_status)}</span></p>
                <p class="mb-2"><strong>Order Status:</strong> ${formatStatus(order.status)}</p>
                ${order.upi_transaction_id ? `<p class="mb-2"><strong>UPI Transaction ID:</strong> ${order.upi_transaction_id}</p>` : ''}
            </div>
        </div>
        
        <h4 class="font-quicksand font-bold text-deep-charcoal mb-3">Order Items</h4>
        <table class="w-full mb-6">
            <thead class="bg-soft-pink">
                <tr>
                    <th class="py-2 px-4 text-left">Product</th>
                    <th class="py-2 px-4 text-center">Quantity</th>
                    <th class="py-2 px-4 text-right">Price</th>
                    <th class="py-2 px-4 text-right">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
                <tr class="border-t-2 border-coral-red">
                    <td colspan="3" class="py-2 text-right font-bold">Total:</td>
                    <td class="py-2 text-right font-bold text-coral-red text-xl">$${parseFloat(order.total_amount).toFixed(2)}</td>
                </tr>
            </tbody>
        </table>
        
        ${order.payment_status === 'user_confirmed' ? `
            <div class="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-4">
                <p class="font-bold text-yellow-900 mb-2">⚠️ Payment Confirmation Required</p>
                <p class="text-sm text-yellow-800">Customer has confirmed payment. Please verify the payment in your UPI app (${SUPABASE_CONFIG.upiId}) and confirm below.</p>
            </div>
            <div class="flex space-x-4">
                <button onclick="confirmPayment('${order.id}')" class="flex-1 bg-green-500 text-white font-quicksand font-bold py-3 px-6 rounded-full hover:bg-green-600 transition-colors">
                    ✓ Confirm Payment Received
                </button>
                <button onclick="rejectPayment('${order.id}')" class="flex-1 bg-red-500 text-white font-quicksand font-bold py-3 px-6 rounded-full hover:bg-red-600 transition-colors">
                    ✗ Payment Not Received
                </button>
            </div>
        ` : ''}
        
        ${order.payment_status === 'admin_verified' && order.status === 'pending' ? `
            <button onclick="markAsShipped('${order.id}')" class="w-full bg-coral-red text-white font-quicksand font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors">
                Mark as Shipped
            </button>
        ` : ''}
    `;
}

async function confirmPayment(orderId) {
    if (!confirm('Have you verified the payment in your UPI app?')) return;
    
    try {
        const { error } = await supabase
            .from('orders')
            .update({
                payment_status: 'admin_verified',
                status: 'confirmed'
            })
            .eq('id', orderId);
        
        if (error) throw error;
        
        closeOrderModal();
        loadOrders();
        alert('Payment confirmed! Order is now confirmed.');
    } catch (error) {
        console.error('Error confirming payment:', error);
        alert('Error confirming payment. Please try again.');
    }
}

async function rejectPayment(orderId) {
    const reason = prompt('Please enter the reason for rejection:');
    if (!reason) return;
    
    try {
        const { error } = await supabase
            .from('orders')
            .update({
                payment_status: 'failed',
                status: 'cancelled',
                admin_notes: reason
            })
            .eq('id', orderId);
        
        if (error) throw error;
        
        closeOrderModal();
        loadOrders();
        alert('Payment rejected. Order has been cancelled.');
    } catch (error) {
        console.error('Error rejecting payment:', error);
        alert('Error rejecting payment. Please try again.');
    }
}

async function markAsShipped(orderId) {
    try {
        const { error } = await supabase
            .from('orders')
            .update({ status: 'shipped' })
            .eq('id', orderId);
        
        if (error) throw error;
        
        closeOrderModal();
        loadOrders();
        alert('Order marked as shipped!');
    } catch (error) {
        console.error('Error updating order:', error);
        alert('Error updating order. Please try again.');
    }
}

function closeOrderModal() {
    document.getElementById('order-modal').classList.add('hidden');
}

window.viewOrderDetails = viewOrderDetails;
window.confirmPayment = confirmPayment;
window.rejectPayment = rejectPayment;
window.markAsShipped = markAsShipped;

// Poll for new orders every 30 seconds
let orderPollingInterval;

function startOrderPolling() {
    if (orderPollingInterval) clearInterval(orderPollingInterval);
    
    orderPollingInterval = setInterval(() => {
        loadOrders();
    }, 30000); // 30 seconds
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (orderPollingInterval) clearInterval(orderPollingInterval);
});
