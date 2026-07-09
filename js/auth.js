// ============================================
// 🔐 AUTH.JS — Authentication Functions
// ============================================

function getSupabaseClient() {
  if (window.supabaseClient && typeof window.supabaseClient.from === 'function' && window.supabaseClient.auth) {
    return window.supabaseClient;
  }
  if (window.supabase && typeof window.supabase.from === 'function' && window.supabase.auth) {
    return window.supabase;
  }
  return null;
}

async function ensureUserProfile(user) {
  if (!user?.id) {
    return { success: false, error: 'No user available.' };
  }

  const client = getSupabaseClient();
  if (!client?.from) {
    return { success: false, error: 'Supabase client is not ready.' };
  }

  const profileData = {
    user_id: user.id,
    username: user.user_metadata?.username || user.user_metadata?.preferred_username || (user.email ? user.email.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase() : `user${user.id.slice(0, 8)}`),
    display_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.user_metadata?.name || (user.email ? user.email.split('@')[0] : 'User'),
    role: 'reader',
    joined_at: new Date().toISOString()
  };

  try {
    const { data: existingProfile, error: selectError } = await client
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }

    if (existingProfile) {
      return { success: true, profile: existingProfile };
    }

    const { data, error } = await client
      .from('profiles')
      .upsert([profileData], { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return { success: true, profile: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
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

    const profileResult = await ensureUserProfile(authData.user);
    if (!profileResult.success) {
      console.warn('Profile sync warning:', profileResult.error);
    }

    if (authData.session) {
      return { success: true, user: authData.user, session: authData.session };
    }

    const signInResult = await signIn(email, password);
    if (signInResult.success) {
      return { success: true, user: signInResult.user };
    }

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

    const profileResult = await ensureUserProfile(data.user);
    if (!profileResult.success) {
      console.warn('Profile sync warning:', profileResult.error);
    }

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
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;

    if (data) {
      return { success: true, profile: data };
    }

    const currentUserResult = await getCurrentUser();
    if (currentUserResult.success && currentUserResult.user?.id === userId) {
      const profileResult = await ensureUserProfile(currentUserResult.user);
      if (profileResult.success) {
        return { success: true, profile: profileResult.profile };
      }
      return { success: false, error: profileResult.error };
    }

    return { success: false, error: 'Profile not found.' };
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
window.ensureUserProfile = ensureUserProfile;
window.updateProfile = updateProfile;
window.isAuthenticated = isAuthenticated;
