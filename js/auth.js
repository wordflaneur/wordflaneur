// ============================================
// 🔐 AUTH.JS — Authentication Functions
// ============================================

function getSupabaseClient() {
  return window.getSupabaseClient ? window.getSupabaseClient() : (window.supabaseClient || window.supabase || null);
}

// Sign up with email and password
async function signUp(email, password, username, displayName) {
  try {
    const client = getSupabaseClient();
    if (!client?.auth) {
      throw new Error('Supabase client is not ready.');
    }

    // Create auth user
    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          display_name: displayName
        }
      }
    });

    if (authError) throw authError;

    // Create profile
    const { error: profileError } = await client
      .from('profiles')
      .insert([
        {
          user_id: authData.user.id,
          username: username,
          display_name: displayName,
          role: 'reader',
          joined_at: new Date().toISOString()
        }
      ]);

    if (profileError) throw profileError;

    return { success: true, user: authData.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Sign in with email and password
async function signIn(email, password) {
  try {
    const client = getSupabaseClient();
    if (!client?.auth) {
      throw new Error('Supabase client is not ready.');
    }

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Sign in with Google
async function signInWithGoogle() {
  try {
    const client = getSupabaseClient();
    if (!client?.auth) {
      throw new Error('Supabase client is not ready.');
    }

    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) throw error;

    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Sign out
async function signOut() {
  try {
    const client = getSupabaseClient();
    if (!client?.auth) {
      throw new Error('Supabase client is not ready.');
    }

    const { error } = await client.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Get current user
async function getCurrentUser() {
  try {
    const client = getSupabaseClient();
    if (!client?.auth) {
      throw new Error('Supabase client is not ready.');
    }

    const { data, error } = await client.auth.getUser();
    if (error) throw error;
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Get user profile
async function getUserProfile(userId) {
  try {
    const client = getSupabaseClient();
    if (!client?.from) {
      throw new Error('Supabase client is not ready.');
    }

    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return { success: true, profile: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Update user profile
async function updateProfile(userId, updates) {
  try {
    const client = getSupabaseClient();
    if (!client?.from) {
      throw new Error('Supabase client is not ready.');
    }

    const { data, error } = await client
      .from('profiles')
      .update(updates)
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Check if user is authenticated
function isAuthenticated() {
  const client = getSupabaseClient();
  return Boolean(client?.auth?.session());
}

// Export functions
window.signUp = signUp;
window.signIn = signIn;
window.signInWithGoogle = signInWithGoogle;
window.signOut = signOut;
window.getCurrentUser = getCurrentUser;
window.getUserProfile = getUserProfile;
window.updateProfile = updateProfile;
window.isAuthenticated = isAuthenticated;
