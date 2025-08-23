import { supabase } from '../lib/supabaseClient';

export const authService = (() => {
  // Tracks the current logged-in user and session info
  const userSession = {
    user: null,
    loading: false,
    error: null,
    message: null,
    lastAction: null,
    lastProvider: null,
  };

  const getUser = async () => {
    userSession.loading = true;
    userSession.error = null;
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw new Error(error.message);
      userSession.user = session?.user || null;
    } catch (err) {
      userSession.error = err.message;
      userSession.user = null;
    } finally {
      userSession.loading = false;
    }
    return userSession.user;
  };

  const createUser = async (email, password) => {
    userSession.loading = true;
    userSession.error = null;
    userSession.message = null;
    userSession.lastAction = 'signup';
    userSession.lastProvider = 'email';

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        userSession.error = error.message;
        return false;
      }

      if (!data.session || !data.user) {
        userSession.message = "Check your email to confirm your account.";
        return false;
      }

      userSession.user = data.user;
      userSession.message = "Signup successful! Redirecting...";
      return true;
    } catch (err) {
      userSession.error = err.message;
      return false;
    } finally {
      userSession.loading = false;
    }
  };

  const loginWithEmail = async (email, password) => {
    userSession.loading = true;
    userSession.error = null;
    userSession.message = null;
    userSession.lastAction = 'login';
    userSession.lastProvider = 'email';

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        userSession.error = error.message;
        return false;
      }

      userSession.user = data.user;
      userSession.message = "Login successful! Redirecting...";
      return true;
    } catch (err) {
      userSession.error = err.message;
      return false;
    } finally {
      userSession.loading = false;
    }
  };

  const loginWithGoogle = async () => {
    userSession.loading = true;
    userSession.error = null;
    userSession.message = null;
    userSession.lastAction = 'login';
    userSession.lastProvider = 'google';

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/login` },
      });

      if (error) {
        userSession.error = error.message;
        userSession.loading = false;
        return false;
      }

      return true;
    } catch (err) {
      userSession.error = err.message;
      userSession.loading = false;
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    userSession.user = null;
  };

  return {
    userSession,
    getUser,
    createUser,
    loginWithEmail,
    loginWithGoogle,
    logout,
  };
})();
