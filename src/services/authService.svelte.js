import { supabase } from '../lib/supabaseClient';

export const authService = (() => {
  const state = $state({
    user: null,
    loading: false,
    error: null,
    message: null,
    lastAction: null,
    lastProvider: null,
  });

  const setError = (err) => {
    state.error = err?.message || String(err) || 'Unknown error';
  };

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

  const loginWithEmail = async (email, password) => {
    state.loading = true;
    state.error = null;
    state.message = null;
    state.lastAction = 'login';
    state.lastProvider = 'email';

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

      state.user = result.data?.user || result.data?.session?.user || null;

      if (!state.user) {
        setError('Login failed: no user returned');
        return false;
      }

      state.message = "Login successful! Redirecting…";
      return true;

    } catch (err) {
      setError(err);
      return false;
    } finally {
      state.loading = false;
    }
  };

  const logout = async () => {
    state.loading = true;
    state.error = null;
    state.message = null;

    try {
      const result = await supabase.auth.signOut();

      if (result?.error) {
        setError(result.error);
        return false;
      }

      state.user = null;
      state.message = "Logged out successfully.";
      return true;

    } catch (err) {
      setError(err);
      return false;

    } finally {
      state.loading = false;
    }
  };

  return {
    state,
    getUser,
    loginWithEmail,
    logout,
  };
})();
