
// ============================================
// 🔐 SUPABASE.JS — Supabase Client
// ============================================

const SUPABASE_URL = "https://ugrmqwgjcisufcpjqhzy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable__9skp_lVOca6QzX0vU5Xpg_5m6156tp";

// Create Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabase = supabase;
