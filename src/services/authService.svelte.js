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

  supabase.auth.onAuthStateChange((_event, session) => {
    state.user = session?.user || null;
  });

  const getUser = async () => {
    state.loading = true;
    state.error = null;
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      state.user = data?.session?.user || null;
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      state.user = data?.user || data?.session?.user || null;
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
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      state.user = data?.user || data?.session?.user || null;
      state.message = data?.session
        ? "Account created successfully!"
        : "Signup successful! Please check your email to confirm your account.";
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
      if (error) throw error;
      state.message = "Password reset email sent. Please check your inbox.";
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      state.loading = false;
    }
  };

  const updateEmail = async (newEmail) => {
    state.loading = true;
    state.error = null;
    state.message = null;
    state.lastAction = 'updateEmail';
    try {
      const { data, error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;

      // Refresh session immediately to get updated email
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      state.user = sessionData?.session?.user || data?.user || state.user;
      state.message = "Email updated successfully!";
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
      if (error) throw error;

      state.user = data?.user || state.user;
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
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
    updateEmail,
    updatePassword,
    logout,
    supabase,
  };
})();
