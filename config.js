// Supabase Configuration
// This file connects your frontend to the Supabase backend

const SUPABASE_CONFIG = {
    // Your Supabase credentials
    url: 'https://gkajeexmggsztrogurax.supabase.co',
    anonKey: 'sb_publishable_v1SwiC5f6Iu-2dBejnOdiA_BcbKCtYb',
    
    // Payment Configuration
    upiId: '9972312878@ybl' // UPI ID for checkout
};

// Initialize Supabase client
// We use window.supabaseClient to avoid 'Identifier has already been declared' errors
// when multiple scripts try to declare a 'supabase' variable.
if (typeof window.supabase !== 'undefined') {
    window.supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log('Supabase client initialized');
} else {
    console.error('Supabase library not loaded! Check your HTML script tags.');
}
