// Add this to shop.js

// ... existing code ...

// Newsletter Subscription
async function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('email-input');
    const email = emailInput.value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    if (!email) return;
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing...';
        
        // Insert into subscribers table
        const { error } = await db
            .from('subscribers')
            .insert([{ email }]);
            
        if (error) {
            if (error.code === '23505') { // Unique violation
                showToast('You are already subscribed!');
            } else {
                throw error;
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

// Add to setupEventListeners
// document.getElementById('newsletter-form')?.addEventListener('submit', handleNewsletterSubmit);
