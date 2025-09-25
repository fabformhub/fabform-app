<script>
  let show = $state(false);

  // Portal action: append to body
  function portalAction(node, parent = document.body) {
    parent.appendChild(node);
  }
</script>

<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold m-5 px-5" onclick={() => show = !show}>Toggle Portal</button>

{#if show}
  {#snippet portalContent()}
    <div
      use:portalAction
      class="p-4 bg-green-200 border rounded shadow-lg fixed top-20 left-1/2 -translate-x-1/2 z-50"
    >
      <h2 class="text-lg font-bold mb-2">Portal Content</h2>
      <p>This snippet is rendered via portal in Svelte 5.</p>
      <button onclick={() => show = false} class="mt-2 px-3 py-1 bg-red-600 text-white rounded">
        Close
      </button>
    </div>
  {/snippet}

  {@render portalContent()}
{/if}
