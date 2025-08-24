<script>
  let { value = $bindable(), canAnswer = false } = $props();

  function toggle() {
    if (!canAnswer) return;
    value = !value;
  }
</script>

<label class="inline-flex items-center space-x-3 cursor-pointer select-none">
  <div
    class={[
      'w-5 h-5 rounded border-2 flex items-center justify-center transition',
      value ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400',
      !canAnswer && 'opacity-50 cursor-not-allowed'
    ]}
    on:click={toggle}
  >
    {#if value}
      <div class="w-2.5 h-2.5 bg-white rounded-sm"></div>
    {/if}
  </div>
  <span class="text-base text-gray-800">Check me</span>
</label>
