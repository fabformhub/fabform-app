<script>
  import { authService } from '../../services/authService.svelte.js';
  import { goto, route } from '@mateothegreat/svelte5-router';
  import { clickOutside } from '../../utils/clickOutside.js'; 
  import { APP_URL } from '../../utils/global.js';
  import { Mail, Key, LogOut, LogIn, User } from 'lucide-svelte';

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
    <a use:route href="/" class="flex items-center">
      <img src="/logo.png" alt="FabForm Logo" class="h-8 w-auto hover:opacity-80 transition" />
    </a>

    <a href={APP_URL + '/pricing/'} target="_blank" rel="noopener noreferrer"
      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-md flex items-center gap-2 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
      Buy Pro
    </a>

    <div class="relative">
      <button on:click={toggleMenu} class="focus:outline-none">
        <span class="text-gray-600 font-bold text-xl">⋮</span>
      </button>

      {#if showMenu}
        <div
          use:clickOutside={() => (showMenu = false)}
          class="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
        >
          {#if state.user}
            <!-- <a use:route href="/account/email"
              class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition"
              on:click={() => (showMenu = false)}
            >
              <Mail class="w-4 h-4" /> Change Email
            </a> -->

            <a use:route href="/account/password"
              class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition"
              on:click={() => (showMenu = false)}
            >
              <Key class="w-4 h-4" /> Change Password
            </a>

            <div class="px-4 py-2 text-sm text-gray-500 border-t border-gray-100">{state.user.email}</div>
            <button
              on:click={handleLogout}
              class="flex w-full text-left items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 hover:text-red-700 transition"
            >
              <LogOut class="w-4 h-4" /> Logout
            </button>
          {:else}
            <a use:route href="/login"
              class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition"
              on:click={() => (showMenu = false)}
            >
              <LogIn class="w-4 h-4" /> Login
            </a>
            <a use:route href="/signup"
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
