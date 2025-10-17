 // src/services/authService.js
import { supabase } from '../lib/supabaseClient';

export const authService = (() => {
  // Reactive state (your original $state)
  const state = $state({
    user: null,
    loading: false,
    error: null,
    message: null,
  });

  const setError = (err) => {
    state.error = err?.message || String(err) || 'Unknown error';
  };

  // Listen for auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    state.user = session?.user || null;
  });

  // Get current logged-in user
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

  // Login
  const loginWithEmail = async (email, password) => {
    state.loading = true;
    state.error = null;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      state.user = data?.user || data?.session?.user || null;
      state.message = "Login successful!";
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      state.loading = false;
    }
  };

  // Signup
  const createUser = async (email, password) => {
    state.loading = true;
    state.error = null;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { isPaid: false } } // initial metadata
      });
      if (error) throw error;

      state.user = null;
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

  // Logout
  const logout = async () => {
    state.loading = true;
    state.error = null;
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

  // Mark user as paid via user_metadata
  const setUserPaidByEmail = async (email) => {
    state.loading = true;
    state.error = null;

    try {
      // ⚠️ This requires a Supabase service role key (server-side)
      const { data: users, error: fetchError } = await supabase.auth.admin.listUsers();
      if (fetchError) throw fetchError;

      const user = users.find(u => u.email === email);
      if (!user) {
        setError(new Error(`User ${email} not found.`));
        return false;
      }

      // Update user metadata
      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: { ...user.user_metadata, isPaid: true }
      });
      if (updateError) throw updateError;

      state.message = `User ${email} marked as paid successfully.`;
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
    createUser,
    logout,
    setUserPaidByEmail,
    supabase,
  };
})();
