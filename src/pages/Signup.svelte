<script>
  import { authService } from '../services/authService.svelte.js';
  import { goto } from '@mateothegreat/svelte5-router';
  import toast from 'svelte-5-french-toast';

  let email = '';
  let password = '';
  let confirmPassword = '';
  let error = '';
  let loading = false;

  async function handleSignup() {
    error = '';

    if (!email || !password || !confirmPassword) {
      error = 'All fields are required';
      toast.error(error, { duration: 4000, position: 'top-right', icon: '❌' });
      return;
    }

    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      toast.error(error, { duration: 4000, position: 'top-right', icon: '❌' });
      return;
    }

    loading = true;
    try {
      const created = await authService.createUser(email, password);
      if (!created) throw new Error(authService.state.error || 'Signup failed');

      // Clear user from state so they have to log in
      authService.state.user = null;

      // Show success toast
      toast.success(`Account created for ${email}. Please log in.`, {
        duration: 5000,
        position: 'top-right',
        icon: '✅'
      });

      // Navigate to login page
      goto('/login');
    } catch (err) {
      error = err.message || 'Signup failed';
      toast.error(error, { duration: 5000, position: 'top-right', icon: '❌' });
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen flex justify-center items-center bg-gray-100">
  <div class="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg space-y-4">
    <h2 class="text-2xl font-bold text-center">Sign Up</h2>

    {#if error}
      <p class="text-red-500 text-center">{error}</p>
    {/if}

    <form on:submit|preventDefault={handleSignup} class="space-y-3">
      <input 
        type="email" 
        placeholder="Email" 
        bind:value={email} 
        class="w-full border px-3 py-2 rounded" 
      />
      <input 
        type="password" 
        placeholder="Password" 
        bind:value={password} 
        class="w-full border px-3 py-2 rounded" 
      />
      <input 
        type="password" 
        placeholder="Confirm Password" 
        bind:value={confirmPassword} 
        class="w-full border px-3 py-2 rounded" 
      />
      <button 
        type="submit" 
        class="w-full py-2 bg-blue-600 text-white rounded" 
        disabled={loading}
      >
        {loading ? 'Creating…' : 'Sign Up'}
      </button>
    </form>
  </div>
</div>
