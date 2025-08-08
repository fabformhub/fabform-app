<script>
  let {choices = [],choiceSelected, value = $bindable() } = $props();

 $effect(() => {
    choiceSelected(value);
  });
</script>

<select  bind:value={value}
  class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
>
  {#each choices as choice}
    <option value={choice}>{choice}</option>
  {/each}
</select>
