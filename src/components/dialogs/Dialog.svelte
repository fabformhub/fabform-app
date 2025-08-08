<script>
  import { dialog, closeDialog } from '../../utils/dialog.svelte.js';
  import { fade, scale } from 'svelte/transition';
</script>
 
{#if dialog.show}
  <div 
    class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" 
    on:click={() => closeDialog(false)}
    tabindex="0"
    transition:fade
  >
    <div
      class="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full"
      role="dialog"
      aria-modal="true"
      on:click|stopPropagation
      transition:scale={{ duration: 200 }}
    >
      {#if dialog.title}
        <h2 class="text-xl font-semibold text-black mb-2">{dialog.title}</h2>
      {/if}

      {#if dialog.message}
        <p class="text-gray-700 mb-4">{dialog.message}</p>
      {/if}

      {#if dialog.component}
        <svelte:component this={dialog.component} props={dialog.props} />
      {/if}

      <div class="mt-4 flex justify-center space-x-4">
        <button
          class="px-4 py-2 bg-white text-gray-700 rounded border border-gray-300 hover:bg-gray-100"
          on:click={() => closeDialog(false)}
        >
          {dialog.cancelLabel}
        </button>

        <button
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          on:click={() => closeDialog(dialog?.props ?? true)}
        >
          {dialog.confirmLabel}
        </button>
      </div>
    </div>
  </div>
{/if}
