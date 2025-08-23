// services/authService.svelte.js
import { supabase } from '../lib/supabaseClient';

export const authService = (() => {
  // Plain global state object
  const state = {
    user: null,
    loading: false,
    error: null
  };

  // Get current user/session
  const getUser = async () => {
    state.loading = true;
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw new Error(error.message);
      state.user = session?.user || null;
    } catch (err) {
      state.error = err.message;
      state.user = null;
    } finally {
      state.loading = false;
    }

    return state.user;
  };

  // Login with email/password
  const loginWithEmail = async (email, password) => {
    state.loading = true;
    state.error = null;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        state.error = error.message;
        return false;
      }

      state.user = data.user;
      return true;
    } catch (err) {
      state.error = err.message;
      return false;
    } finally {
      state.loading = false;
    }
  };

  // Login with Google OAuth
  const loginWithGoogle = async () => {
    state.loading = true;
    state.error = null;

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });

      if (error) {
        state.error = error.message;
        return false;
      }

      supabase.auth.onAuthStateChange((event, session) => {
        state.user = session?.user || null;
      });

      return true;
    } catch (err) {
      state.error = err.message;
      return false;
    } finally {
      state.loading = false;
    }
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    state.user = null;
  };

  return { state, getUser, loginWithEmail, loginWithGoogle, logout };
})();
