<script>
  import { authService } from '../services/authService.svelte.js'; 
  let email = '';
  let loading = false;
  let message = '';
  let error = '';

  async function handleOrder() {
    if (!email) {
      error = 'Please enter an email address.';
      return;
    }

    loading = true;
    error = '';
    message = '';

    const success = await authService.setUserPaidByEmail(email);

    if (success) {
      message = `User ${email} marked as paid successfully.`;
    } else {
      error = authService.state.error || 'Something went wrong.';
    }

    loading = false;
  }
</script>

<!-- Centered container -->
<div class="min-h-screen flex items-center justify-center bg-gray-100">
  <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
    <h1 class="text-2xl font-bold text-center mb-6 text-gray-800">Mark User as Paid</h1>

    <div class="space-y-4">
      <input
        type="email"
        bind:value={email}
        placeholder="Enter user email"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        on:click={handleOrder}
        class="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
        disabled={loading}
      >
        {#if loading}
          Processing...
        {:else}
          Mark as Paid
        {/if}
      </button>

      {#if message}
        <p class="text-green-600 text-center mt-3">{message}</p>
      {/if}
      {#if error}
        <p class="text-red-600 text-center mt-3">{error}</p>
      {/if}
    </div>
  </div>
</div>
