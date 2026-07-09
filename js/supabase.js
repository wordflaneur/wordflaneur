
// ============================================
// 🔐 SUPABASE.JS — Supabase Client
// ============================================

const SUPABASE_URL = "https://ugrmqwgjcisufcpjqhzy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable__9skp_lVOca6QzX0vU5Xpg_5m6156tp";

(function initializeSupabase() {
  const existingClient = window.supabaseClient || window.supabase;

  if (existingClient && typeof existingClient.from === 'function' && existingClient.auth) {
    window.supabase = existingClient;
    window.supabaseClient = existingClient;
  } else if (window.supabase && typeof window.supabase.createClient === 'function') {
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.supabase = supabaseClient;
    window.supabaseClient = supabaseClient;
  } else {
    console.error('Supabase SDK failed to load. Authentication will not work until the script is available.');
    window.supabase = null;
    window.supabaseClient = null;
    return;
  }

  window.supabaseGlobal = window.supabase;
  window.getSupabaseClient = function getSupabaseClientHelper() {
    return window.supabaseClient || window.supabase || null;
  };
})();
