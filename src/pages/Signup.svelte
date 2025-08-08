<script>
  import { authService } from '../services/authService.svelte.js'; // Import your authentication service
  import { goto } from '@mateothegreat/svelte5-router'; // Use your router for navigation

  const { state, createUser } = authService;

  let email = '';
  let password = '';
  let confirmPassword = '';

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      state.error = "Passwords do not match!";
      return;
    }

    const success = await createUser(email, password);
    if (success) {
      goto('/dashboard'); // Redirect to the dashboard after successful signup
    }
  };
</script>

<!-- Full-screen signup container -->
<div class="min-h-screen flex justify-center items-center bg-gray-100">

  <!-- Signup Card -->
  <div class="w-full max-w-sm bg-white p-8 space-y-6 rounded-xl shadow-lg">

    <!-- Header Section -->
    <h2 class="text-3xl font-bold text-center text-gray-900">Create an Account</h2>
    <p class="text-sm text-center text-gray-500">Sign up to start your journey</p>

    <!-- Form Section -->
    <div class="space-y-5">
      
      <!-- Email Input -->
      <input
        type="email"
        placeholder="Email"
        bind:value={email}
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
      />

      <!-- Password Input -->
      <input
        type="password"
        placeholder="Password"
        bind:value={password}
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
      />

      <!-- Confirm Password Input -->
      <input
        type="password"
        placeholder="Confirm Password"
        bind:value={confirmPassword}
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
      />

      <!-- Signup Button -->
      <button
        on:click={handleSignup}
        class="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={state.loading}
      >
        {state.loading ? 'Creating account…' : 'Sign Up'}
      </button>
    </div>

    <!-- Error Message Section -->
    {#if state.error}
      <p class="text-sm text-red-500 text-center">{state.error}</p>
    {/if}
    
  </div>

</div>
