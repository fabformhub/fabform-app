<script>
  import { authService } from '../services/authService.svelte.js';
  import { onMount } from 'svelte';

  let email = '';
  let loading = false;
  let error = '';
  let success = '';

  onMount(() => {
    if (authService.state.user) {
      email = authService.state.user.email || '';
    }
  });

  const handleSubmit = async () => {
    error = '';
    success = '';
    if (!email) {
      error = 'Email cannot be empty.';
      return;
    }
    loading = true;
    try {
      const ok = await authService.updateEmail(email);
      if (ok) success = 'Email updated successfully!';
    } catch (err) {
      error = err?.message || 'Failed to update email.';
    } finally {
      loading = false;
    }
  };
</script>

<div class="max-w-md mx-auto mt-10 p-6 bg-white border rounded-lg shadow">
  <h2 class="text-2xl font-semibold mb-4">Change Email</h2>
  {#if error}<div class="text-red-600 mb-2">{error}</div>{/if}
  {#if success}<div class="text-green-600 mb-2">{success}</div>{/if}
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label class="block text-gray-700">Email</label>
      <input type="email" bind:value={email} class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
    </div>
    <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition" disabled={loading}>
      {#if loading}Updating...{:else}Update{/if}
    </button>
  </form>
</div>
