<script>
  import { authService } from '../services/authService.svelte.js';
  import { createProfile } from '../services/profileService.js';
  import { goto } from '@mateothegreat/svelte5-router';

  const { state, createUser } = authService;

  let email = '';
  let password = '';
  let confirmPassword = '';

  // Reactive computed value to check if passwords match
  $: passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSignup = async () => {
    state.error = '';

    // Validate fields
    if (!email || !password || !confirmPassword) {
      state.error = 'All fields are required!';
      return;
    }

    // Password match check
    if (!passwordsMatch) {
      state.error = 'Passwords do not match!';
      return;
    }

    state.loading = true;

    try {
      const user = await createUser(email, password);
      if (!user) throw new Error('Signup failed');

      // Create a profile for the new user
      const profileResult = await createProfile(user.id);
      if (!profileResult.success) {
        console.warn('Profile creation failed:', profileResult.error);
      }

      state.user = user; // set session
      goto('/dashboard');
    } catch (err) {
      state.error = err?.message || 'Signup failed';
    } finally {
      state.loading = false;
    }
  };
</script>

<div class="min-h-screen flex justify-center items-center bg-gray-100">
  <div class="w-full max-w-sm bg-white p-8 space-y-6 rounded-xl shadow-lg">
    <h2 class="text-3xl font-bold text-center text-gray-900">Create an Account</h2>
    <p class="text-sm text-center text-gray-500">Sign up to start your journey</p>

    <form class="space-y-5" on:submit|preventDefault={handleSignup}>
      <!-- Email -->
      <input
        type="email"
        placeholder="Email"
        bind:value={email}
        on:input={() => state.error = ''}
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        required
      />

      <!-- Password -->
      <input
        type="password"
        placeholder="Password"
        bind:value={password}
        on:input={() => state.error = ''}
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        required
      />

      <!-- Confirm Password -->
      <input
        type="password"
        placeholder="Confirm Password"
        bind:value={confirmPassword}
        on:input={() => state.error = ''}
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        required
      />

      <!-- Live password match feedback -->
      {#if confirmPassword}
        <p class="text-sm text-right {passwordsMatch ? 'text-green-500' : 'text-red-500'}">
          {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
        </p>
      {/if}

      <!-- Signup Button -->
      <button
        type="submit"
        class="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={state.loading}
      >
        {state.loading ? 'Creating account…' : 'Sign Up'}
      </button>
    </form>

    {#if state.error}
      <p class="text-sm text-red-500 text-center">{state.error}</p>
    {/if}
  </div>
</div>