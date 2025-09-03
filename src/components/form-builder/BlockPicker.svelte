<script>
  import { getContext } from 'svelte';
  import { blockTemplates } from "../../templates/blockTemplates.js";
  import { X } from 'lucide-svelte';

  const { show, close } = $props();
  const notifyBlockPick = getContext('blockPickerClick') ?? (() => {});

  function BlockPicked(block) {
    notifyBlockPick(block);
    close();
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') close();
  }
</script>

{#if show}
  <div
    class="fixed inset-0 flex items-center justify-center z-50 bg-black/30"
    on:click={() => close()}
    on:keydown={handleKeyDown}
    tabindex="0"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="bg-white rounded-2xl w-[92vw] max-w-5xl p-6 shadow-2xl
             flex flex-col gap-6 items-center animate-fade-scale-in
             max-h-[90vh] overflow-hidden"
      on:click|stopPropagation
    >
      <!-- Header -->
      <div class="w-full flex justify-between items-center shrink-0">
        <h2 class="text-2xl font-semibold tracking-tight text-gray-900 select-none">
          Choose your block
        </h2>
        <button
          aria-label="Close"
          on:click={close}
          class="p-2 hover:bg-gray-200 rounded-md transition-colors duration-200"
        >
          <X class="w-6 h-6 text-gray-700 hover:text-gray-900" />
        </button>
      </div>

      <!-- Scrollable Blocks Grid -->
      <div
        class="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5
               overflow-y-auto pr-1"
        style="max-height: calc(90vh - 80px);"
      >
        {#each blockTemplates as block}
          <button
            on:click={() => BlockPicked(block)}
            class={`relative flex flex-col items-center justify-center
                    p-5 rounded-xl cursor-pointer select-none border-2
                    min-h-[115px] min-w-[115px] text-gray-900 text-sm
                    transition-all duration-300 ease-in-out
                    ${block.bgColor}
                    border-gray-300 hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)]
                    hover:scale-105 hover:border-indigo-400`}
          >
            {#if block.icon}
              <svelte:component this={block.icon} class="mb-2 w-7 h-7 text-blue-600" />
            {/if}
            <span class="text-center font-semibold">{block.label}</span>
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes fadeScaleIn {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  .animate-fade-scale-in {
    animation: fadeScaleIn 0.25s ease forwards;
  }
</style>
