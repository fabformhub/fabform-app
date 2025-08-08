<script>
  import { onMount } from 'svelte';
  import '@melloware/coloris/dist/coloris.css';
  import { init, coloris } from '@melloware/coloris';
  let {color = $bindable(), colorChanged} =$props();

  onMount(() => {
    init();
    coloris({
      el: '#coloris',
      theme: 'default',
      themeMode: 'auto',
      alpha: false,
      swatches: ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51']
    });
  });

  function handleInput(event) {
    color = event.target.value;
    colorChanged()
  }
</script>

<div class="flex flex-col gap-2 w-fit m-5">
  <label for="coloris" class="text-sm font-medium text-gray-700 dark:text-gray-300">
  </label>

  <input
    id="coloris"
    type="text"
    bind:value={color}
    on:input={handleInput}
    class="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-40 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
  />


  {color}
</div>
