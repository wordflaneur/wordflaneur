
// ============================================
// 🔐 SUPABASE.JS — Supabase Client
// ============================================

// Load Supabase credentials from window object (injected by server or set in index.html)
const SUPABASE_URL = window.__SUPABASE_URL__;
const SUPABASE_ANON_KEY = window.__SUPABASE_ANON_KEY__;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase credentials not found. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set on window object.');
}

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
