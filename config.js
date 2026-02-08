// Supabase Configuration
// This file connects your frontend to the Supabase backend

const SUPABASE_CONFIG = {
    // Your Supabase credentials
    url: 'https://gkajeexmggsztrogurax.supabase.co',
    anonKey: 'sb_publishable_v1SwiC5f6Iu-2dBejnOdiA_BcbKCtYb',
    
    // Payment Configuration
    upiId: '7619107621@ybl' // UPI ID for checkout
};

// Initialize Supabase client immediately
// Pass it to window so other scripts can use it
try {
    if (window.supabase) {
        window.supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        console.log('Supabase client initialized successfully');
    } else {
        console.error('Supabase library not found. Ensure the CDN script is loaded before config.js');
    }
} catch (error) {
    console.error('Error initializing Supabase:', error);
}
