<script>
  import { authService } from '../services/authService.svelte.js';

  import { goto } from '@mateothegreat/svelte5-router';
  import { onMount, onDestroy } from 'svelte';

  let email = '';
  let password = '';
  let loginError = '';
  let loading = false;
  
  async function handleLogin() {
    loginError = '';
    if (!email || !password) {
      loginError = 'Email and password are required';
      return;
    }

    loading = true;
    try {
      const success = await authService.loginWithEmail(email, password);
      if (success) {
        goto('/dashboard');
      } else {
        loginError = authService.state.error || 'Login failed';
      }
    } catch (err) {
      loginError = err.message || 'Login failed';
    } finally {
      loading = false;
    }
  }

  function goToSignup() {
    goto('/signup');
  }
</script>

<div class="min-h-screen flex justify-center items-center bg-gray-100">
  <div class="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg space-y-4">
    <h2 class="text-2xl font-bold text-center">Login</h2>

    
    <form on:submit|preventDefault={handleLogin} class="space-y-3">
      <input type="email" placeholder="Email" bind:value={email} class="w-full border px-3 py-2 rounded" />
      <input type="password" placeholder="Password" bind:value={password} class="w-full border px-3 py-2 rounded" />
      <button type="submit" class="w-full py-2 bg-blue-600 text-white rounded" disabled={loading}>
        {loading ? 'Logging in…' : 'Login'}
      </button>
    </form>

    <p class="text-center text-sm text-gray-600 mt-2">
      Don’t have an account? 
      <span class="text-blue-600 cursor-pointer hover:underline" on:click={goToSignup}>Sign up</span>
    </p>
  </div>
</div>
