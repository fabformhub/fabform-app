<script>
  import { onMount } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';
  import { SplashScreen } from '../components/ui';
  import { ArrowUp, ArrowDown } from 'lucide-svelte';

  // Splash screen state
  let showSplash = $state(true);

  // Form blocks (mocked for POC)
  let blocks = $state([
    { id: 1, text: 'Block 1' },
    { id: 2, text: 'Block 2' },
    { id: 3, text: 'Block 3' }
  ]);
  let blockNo = $state(0);

  // Slide animation state
  let divState = $state({
    visible: true,
    direction: 'top'
  });

  onMount(() => {
    // Hide splash after 3s
    setTimeout(() => {
      showSplash = false;
    }, 3000);
  });

  function nextBlock() {
    if (blockNo < blocks.length - 1) {
      divState = { ...divState, visible: false, direction: 'bottom' };
      setTimeout(() => {
        blockNo += 1;
        divState = { ...divState, visible: true };
      }, 500);
    }
  }

  function previousBlock() {
    if (blockNo > 0) {
      divState = { ...divState, visible: false, direction: 'top' };
      setTimeout(() => {
        blockNo -= 1;
        divState = { ...divState, visible: true };
      }, 500);
    }
  }
</script>

<main class="relative min-h-screen flex items-center justify-center bg-gray-100">

  {#if showSplash}
    <SplashScreen />
  {:else}
    {#if divState.visible}
      <div
        in:fly={{ y: divState.direction === 'top' ? -window.innerHeight : window.innerHeight, duration: 600, easing: cubicOut }}
        out:fly={{ y: divState.direction === 'top' ? -window.innerHeight : window.innerHeight, duration: 600, easing: cubicOut }}
        class="bg-white rounded-xl shadow-lg p-8 w-11/12 md:w-1/2 text-center"
      >
        <p class="text-lg">{blocks[blockNo].text}</p>
      </div>
    {/if}

    <!-- Controls -->
    <div class="absolute bottom-10 right-10 flex gap-2">
      {#if blockNo > 0}
        <button on:click={previousBlock} class="p-2 bg-gray-800 text-white rounded">
          <ArrowUp size={16} />
        </button>
      {/if}
      {#if blockNo < blocks.length - 1}
        <button on:click={nextBlock} class="p-2 bg-gray-800 text-white rounded">
          <ArrowDown size={16} />
        </button>
      {/if}
    </div>
  {/if}

</main>
