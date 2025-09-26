<script>
  import { authService } from '../services/authService.svelte.js'; // Importing your authentication service`
  import { goto } from '@mateothegreat/svelte5-router'; // Using your router for navigation

  const { state, loginWithEmail } = authService;

  let email = '';
  let password = '';

  const handleEmailLogin = async () => {
    const success = await loginWithEmail(email, password);
    if (success) {
      goto('/dashboard'); // Redirect to the dashboard after successful login
    }
  };

  
</script>

<!-- Full-screen login container -->
<div class="min-h-screen flex justify-center items-center bg-gray-100">

  <!-- Login Card -->
  <div class="w-full max-w-sm bg-white p-8 space-y-6 rounded-xl shadow-lg">

  
    <!-- Header Section -->
    <h2 class="text-3xl font-bold text-center text-gray-900">Sign into my account</h2>
    <p class="text-sm text-center text-gray-500">Please sign in to your FabForm account</p>

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

      <!-- Email Login Button -->
      <button
        on:click={handleEmailLogin}
        class="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={state.loading}
      >
        {state.loading ? 'Logging in…' : 'Login with Email'}
      </button>
    </div>

    <!-- Sign Up Link -->
    <div class="text-center mt-4">
      <p class="text-sm text-gray-500">
        Don't have an account? 
        <a href="/signup" class="text-blue-600 hover:text-blue-700">Sign up</a>
      </p>
    </div>

    <!-- Error Message Section -->
    {#if state.error}
      <p class="text-sm text-red-500 text-center">{state.error}</p>
    {/if}
    
  </div>

</div>
