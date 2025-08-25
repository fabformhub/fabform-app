<script>
  import { onMount } from 'svelte';
  import { Router } from '@mateothegreat/svelte5-router';
  import { authService } from './services/authService.svelte.js';
  import routes from './routes/routes.js';

  const { state, getUser } = authService;
  let loading = true;

  onMount(async () => {
    try {
      await getUser(); // fetch existing session if any
    } catch (err) {
      console.log('No active session');
    } finally {
      loading = false;
    }
  });
</script>

<style>
  :global(body) {
    font-family: 'Inter', sans-serif;
    background: #f9fafb;
  }
</style>

<main class="w-screen h-screen">
  {#if loading}
    <div class="flex items-center justify-center h-full text-gray-600">
      Loading...
    </div>
  {:else}
    <Router {routes} />
  {/if}
</main>
