export const authService = (() => {
  const state = $state({
    user: null,
    loading: false,
    error: null,
    message: null,
    lastAction: null // 'login' or 'signup'
  });

  // ... keep existing methods but update them like this:

  const createUser = async (email, password) => {
    state.loading = true;
    state.error = null;
    state.message = null;
    state.lastAction = 'signup';

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

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });

      if (error) {
        state.error = error.message;
        state.loading = false;
        return false;
      }

      // OAuth redirects away, no immediate success message here.
      return true;
    } catch (err) {
      state.error = err.message;
      state.loading = false;
      return false;
    }
  };

  // rest unchanged...

  return {
    state,
    getUser,
    createUser,
    loginWithEmail,
    loginWithGoogle,
    logout,
  };
})();
