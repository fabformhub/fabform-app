<script>
  import { authService } from '../services/authService.svelte.js';

  let newPassword = '';
  let confirmPassword = '';
  let loading = false;
  let error = '';
  let success = '';

  const handleSubmit = async () => {
    error = '';
    success = '';
    if (!newPassword || !confirmPassword) {
      error = 'All fields are required.';
      return;
    }
    if (newPassword !== confirmPassword) {
      error = 'Passwords do not match.';
      return;
    }
    loading = true;
    try {
      const ok = await authService.updatePassword(newPassword);
      if (ok) {
        success = 'Password updated successfully!';
        newPassword = '';
        confirmPassword = '';
      }
    } catch (err) {
      error = err?.message || 'Failed to update password.';
    } finally {
      loading = false;
    }
  };
</script>

<div class="max-w-md mx-auto mt-10 p-6 bg-white border rounded-lg shadow">
  <h2 class="text-2xl font-semibold mb-4">Change Password</h2>

  {#if error}<div class="text-red-600 mb-2">{error}</div>{/if}
  {#if success}<div class="text-green-600 mb-2">{success}</div>{/if}

  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label class="block text-gray-700">New Password</label>
      <input
        type="password"
        bind:value={newPassword}
        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        required
      />
    </div>

    <div>
      <label class="block text-gray-700">Confirm New Password</label>
      <input
        type="password"
        bind:value={confirmPassword}
        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        required
      />
    </div>

    <button
      type="submit"
      class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      disabled={loading}
    >
      {#if loading}Updating...{:else}Update{/if}
    </button>
  </form>
</div>
