<script>
  import { onMount, onDestroy } from 'svelte';

  let { children, target = document.body } = $props();

  let host;

  onMount(() => {
    target.appendChild(host);
  });

  onDestroy(() => {
    host?.remove();
  });
</script>

<div bind:this={host}>
  {@render children?.()}
</div>
