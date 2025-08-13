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

  const getUser = async () => {
    state.loading = true;
    state.error = null;
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

  const createUser = async (email, password) => {
    state.loading = true;
    state.error = null;
    state.message = null;
    state.lastAction = 'signup';
    state.lastProvider = 'email';

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        state.error = error.message;
        return false;
      }

      if (!data.session || !data.user) {
        state.message = "Check your email to confirm your account.";
        return false;
      }

      state.user = data.user;
      state.message = "Signup successful! Redirecting...";
      return true;
    } catch (err) {
      state.error = err.message;
      return false;
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

      if (error) {
        state.error = error.message;
        return false;
      }

      state.user = data.user;
      state.message = "Login successful! Redirecting...";
      return true;
    } catch (err) {
      state.error = err.message;
      return false;
    } finally {
      state.loading = false;
    }
  };

  const loginWithGoogle = async () => {
    state.loading = true;
    state.error = null;
    state.message = null;
    state.lastAction = 'login';
    state.lastProvider = 'google';

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/login` },
      });

      if (error) {
        state.error = error.message;
        state.loading = false;
        return false;
      }

      // OAuth will redirect to /login
      return true;
    } catch (err) {
      state.error = err.message;
      state.loading = false;
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    state.user = null;
  };

  return {
    state,
    getUser,
    createUser,
    loginWithEmail,
    loginWithGoogle,
    logout,
  };
})();
