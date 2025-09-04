<script>
  import { onMount } from "svelte";
  import '@melloware/coloris/dist/coloris.css';
  import { init, coloris } from '@melloware/coloris';

  let { color = $bindable(), colorChanged = () => {} } = $props();
  let inputId = `coloris-${Math.random().toString(36).substring(2, 9)}`;

  onMount(() => {
    init();
    coloris({
      el: `#${inputId}`,
      theme: 'default',
      alpha: false
    });
  });

  function handleInput(event) {
    color = event.target.value;
    colorChanged();
  }
</script>

<div class="flex flex-col gap-2 w-fit">
  <label for={inputId} class="text-sm font-medium text-gray-700 dark:text-gray-300">
    Pick a color
  </label>

  <input
    id={inputId}
    type="text"
    bind:value={color}
    on:input={handleInput}
    class="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-40 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
  />

  <div class="text-sm mt-1">{color}</div>
</div>
