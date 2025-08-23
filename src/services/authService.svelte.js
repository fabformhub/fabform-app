// services/authService.svelte.js
import { supabase } from '../lib/supabaseClient';

// Global state object
export const authService = (() => {
  const state = {
    user: null,
    loading: false,
    error: null
  };

  // Helper to safely update state.error
  const setError = (err) => {
    state.error = err?.message || String(err) || 'Unknown error';
  };

  // Get current session/user
  const getUser = async () => {
    state.loading = true;
    state.error = null;

    try {
      const result = await supabase.auth.getSession();

      if (!result) {
        setError('No response from Supabase');
        state.user = null;
        return null;
      }

      if (result.error) {
        setError(result.error);
        state.user = null;
        return null;
      }

      state.user = result.data?.session?.user || null;
      return state.user;

    } catch (err) {
      setError(err);
      state.user = null;
      return null;
    } finally {
      state.loading = false;
    }
  };

  // Login with email/password
  const loginWithEmail = async (email, password) => {
    state.loading = true;
    state.error = null;

    try {
      const result = await supabase.auth.signInWithPassword({ email, password });

      if (!result) {
        setError('No response from Supabase');
        return false;
      }

      if (result.error) {
        setError(result.error);
        return false;
      }

      state.user = result.data?.user || null;
      return true;

    } catch (err) {
      setError(err);
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

      if (!result) {
        setError('No response from Supabase');
        return false;
      }

      if (result.error) {
        setError(result.error);
        return false;
      }

      supabase.auth.onAuthStateChange((_, session) => {
        state.user = session?.user || null;
      });

      return true;

    } catch (err) {
      setError(err);
      return false;
    } finally {
      state.loading = false;
    }
  };

  // Logout
  const logout = async () => {
    state.loading = true;
    state.error = null;

    try {
      const result = await supabase.auth.signOut();

      if (result?.error) {
        setError(result.error);
        return false;
      }

      state.user = null;
      return true;

    } catch (err) {
      setError(err);
      return false;
    } finally {
      state.loading = false;
    }
  };

  return { state, getUser, loginWithEmail, loginWithGoogle, logout };
})();
