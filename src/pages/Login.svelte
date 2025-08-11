<script>
  import { authService } from '../services/authService.svelte.js';
  import { goto } from '@mateothegreat/svelte5-router';

  const { state, loginWithEmail, loginWithGoogle } = authService;

  let email = '';
  let password = '';

  const handleEmailLogin = async () => {
    if (!email || !password) {
      state.error = 'Please enter both email and password.';
      return;
    }
    state.error = null; // clear previous errors

    const success = await loginWithEmail(email, password);
    if (success) {
      goto('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    state.error = null; // clear previous errors
    const success = await loginWithGoogle();
    if (!success) {
      // Reset loading so user can try again
      state.loading = false;
    }
    // OAuth will redirect on success, no further action needed here
  };
</script>

<div class="min-h-screen flex justify-center items-center bg-gray-100">
  <div class="w-full max-w-sm bg-white p-8 space-y-6 rounded-xl shadow-lg">
    <button
      on:click={handleGoogleLogin}
      class="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 mb-6"
      disabled={state.loading}
    >
      {state.loading && state.lastAction === 'login' && state.lastProvider === 'google' 
        ? 'Logging in with Google…' : 'Login with Google'}
    </button>

    <h2 class="text-3xl font-bold text-center text-gray-900">Sign into my account</h2>
    <p class="text-sm text-center text-gray-500">Please sign in to your FabForm account</p>

    <div class="space-y-5">
      <input
        type="email"
        placeholder="Email"
        bind:value={email}
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
      />
      <input
        type="password"
        placeholder="Password"
        bind:value={password}
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
      />
      <button
        on:click={handleEmailLogin}
        class="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={state.loading}
      >
        {state.loading && state.lastAction === 'login' && state.lastProvider === 'email' 
          ? 'Logging in…' : 'Login with Email'}
      </button>
    </div>

    <div class="text-center mt-4">
      <p class="text-sm text-gray-500">
        Don't have an account? 
        <a href="/signup" class="text-blue-600 hover:text-blue-700">Sign up</a>
      </p>
    </div>

    {#if state.error}
      <p class="text-sm text-red-500 text-center">{state.error}</p>
    {:else if state.message}
      <p class="text-sm text-green-600 text-center">{state.message}</p>
    {/if}
  </div>
</div>
