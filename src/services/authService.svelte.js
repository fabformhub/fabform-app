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

  // Keep state in sync with Supabase's session
  supabase.auth.onAuthStateChange((_event, session) => {
    state.user = session?.user || null;
  });

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

  const createUser = async (email, password) => {
    state.loading = true;
    state.error = null;
    state.message = null;
    state.lastAction = 'signup';
    state.lastProvider = 'email';

    try {
      const result = await supabase.auth.signUp({ email, password });

      if (!result) {
        setError('No response from Supabase');
        return false;
      }

      if (result.error) {
        setError(result.error);
        return false;
      }

      state.user = result.data?.user || result.data?.session?.user || null;

      // If no session yet → user must confirm email
      if (!result.data?.session) {
        state.message = "Signup successful! Please check your email to confirm your account.";
        return true;
      }

      state.message = "Account created successfully!";
      return true;

    } catch (err) {
      setError(err);
      return false;
    } finally {
      state.loading = false;
    }
  };

  const resetPassword = async (email) => {
    state.loading = true;
    state.error = null;
    state.message = null;
    state.lastAction = 'resetPassword';
    state.lastProvider = 'email';

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        setError(error);
        return false;
      }

      state.message = "Password reset email sent. Please check your inbox.";
      return true;

    } catch (err) {
      setError(err);
      return false;
    } finally {
      state.loading = false;
    }
  };

  const updatePassword = async (newPassword) => {
    state.loading = true;
    state.error = null;
    state.message = null;
    state.lastAction = 'updatePassword';

    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        setError(error);
        return false;
      }

      state.user = data?.user || null;
      state.message = "Password updated successfully!";
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
    createUser,
    loginWithEmail,
    resetPassword,
    updatePassword,
    logout,
  };
})();
