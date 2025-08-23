// services/authService.svelte.js
import { supabase } from '../lib/supabaseClient';

export const authService = (() => {
  // Plain global state
  const state = {
    user: null,
    loading: false,
    error: null
  };

  // Get current session/user
  const getUser = async () => {
    state.loading = true;
    state.error = null;

    try {
      const result = await supabase.auth.getSession();

      if (result.error) throw new Error(result.error.message);

      state.user = result.data?.session?.user || null;

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
      const result = await supabase.auth.signInWithPassword({ email, password });

      if (result.error) {
        state.error = result.error.message;
        return false;
      }

      state.user = result.data?.user || null;
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
      const result = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });

      if (result.error) {
        state.error = result.error.message;
        return false;
      }

      supabase.auth.onAuthStateChange((_, session) => {
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
