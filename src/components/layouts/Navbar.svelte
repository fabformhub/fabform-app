<script>
  import { authService } from '../../services/authService.svelte.js';
  import { goto, route } from '@mateothegreat/svelte5-router';
  import { EllipsisVertical, LayoutDashboard, FileText, LogOut, LogIn, User } from 'lucide-svelte';
  import { clickOutside } from '../../utils/clickOutside.js'; 
import { APP_URL } from '../../utils/global.js';
  const { state, logout } = authService;
  let showMenu = false;

  const handleLogout = async () => {
    showMenu = false;
    await logout();
    goto('/login');
  };

  const toggleMenu = () => (showMenu = !showMenu);
</script>

<nav class="bg-white border-b border-gray-200 shadow-sm px-6 py-4 font-sans">
  <div class="flex justify-between items-center">
    <!-- Brand with Logo -->
    <a use:route href="/" class="flex items-center">
      <img src="/logo.png" alt="FabForm Logo" class="h-8 w-auto hover:opacity-80 transition" />
    </a>
<a href="{APP_URL}/pricing/" target="_blank" rel="noopener noreferrer"
  class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-md flex items-center gap-2 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
  <svg class="w-5 h-5 text-white/80" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
  Buy Pro
</a>

    <!-- Dropdown Trigger -->
    <div class="relative">
      <button on:click={toggleMenu} class="focus:outline-none">
        <EllipsisVertical class="w-6 h-6 text-gray-600 hover:text-indigo-600 transition" />
      </button>

      {#if showMenu}
        <div
          use:clickOutside={() => (showMenu = false)}
          class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
        >
          {#if state.user}
            <a
              use:route
              href="/dashboard"
              class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition"
              on:click={() => (showMenu = false)}
            >
              <LayoutDashboard class="w-4 h-4" /> Dashboard
            </a>
            <!-- <a
              use:route
              href="/test"
              class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition"
              on:click={() => (showMenu = false)}
            >
              <FileText class="w-4 h-4" /> Test
            </a> -->
            <div class="px-4 py-2 text-sm text-gray-500 border-t border-gray-100">{state.user.email}</div>
            <button
              on:click={handleLogout}
              class="flex w-full text-left items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 hover:text-red-700 transition"
            >
              <LogOut class="w-4 h-4" /> Logout
            </button>
          {:else}
            <a
              use:route
              href="/login"
              class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition"
              on:click={() => (showMenu = false)}
            >
              <LogIn class="w-4 h-4" /> Login
            </a>
            <a
              use:route
              href="/signup"
              class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-purple-600 transition"
              on:click={() => (showMenu = false)}
            >
              <User class="w-4 h-4" /> Signup
            </a>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</nav>
