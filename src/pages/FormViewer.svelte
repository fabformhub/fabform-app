<script>
  let blockVisible = false;
  let startY = '100vh'; // initial position

  function rollInFromTop() {
    startY = '-100vh';
    blockVisible = false;
    setTimeout(() => blockVisible = true, 10);
  }

  function rollInFromBottom() {
    startY = '100vh';
    blockVisible = false;
    setTimeout(() => blockVisible = true, 10);
  }
</script>

<div class="flex flex-col items-center gap-4 min-h-screen justify-center">
  {#if blockVisible}
    <div class="block w-80 h-40 bg-blue-500 text-white flex items-center justify-center rounded-xl shadow-lg"
         style="--start: {startY};">
      Hello Animation
    </div>
  {/if}

  <div class="flex gap-2 mt-4">
    <button on:click={rollInFromTop} class="px-4 py-2 bg-gray-700 text-white rounded">Roll In from Top</button>
    <button on:click={rollInFromBottom} class="px-4 py-2 bg-black text-white rounded">Roll In from Bottom</button>
  </div>
</div>

<style>
  .block {
    transform: translateY(var(--start));
    opacity: 0;
    animation: rollin 0.5s forwards;
  }

  @keyframes rollin {
    from {
      transform: translateY(var(--start));
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
