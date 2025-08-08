<script>
  let { value = $bindable(), formMode = false } = $props();

  function selectYesNo(val) {
    if (!formMode) return;
    value = val;
  }

  function isSelected(val) {
    return value === val;
  }
</script>

<div class="flex space-x-6">
  <button
    class={[
      'px-8 py-3 rounded-lg text-lg font-semibold transition shadow-md focus:outline-none focus:ring-2',
      isSelected(true)
        ? 'bg-blue-600 text-white scale-105 shadow-xl ring-2 ring-blue-300 animate-[pulse_0.6s_ease-in-out]'
        : 'bg-white text-gray-700 hover:bg-blue-100 hover:text-blue-600',
      !formMode && 'opacity-50 cursor-not-allowed'
    ]}
    disabled={!formMode}
    on:click={() => selectYesNo(true)}
    aria-pressed={isSelected(true)}
  >
    Yes
  </button>

  <button
    class={[
      'px-8 py-3 rounded-lg text-lg font-semibold transition shadow-md focus:outline-none focus:ring-2',
      isSelected(false)
        ? 'bg-red-600 text-white scale-105 shadow-xl ring-2 ring-red-300 animate-[pulse_0.6s_ease-in-out]'
        : 'bg-white text-gray-700 hover:bg-red-100 hover:text-red-600',
      !formMode && 'opacity-50 cursor-not-allowed'
    ]}
    disabled={!formMode}
    on:click={() => selectYesNo(false)}
    aria-pressed={isSelected(false)}
  >
    No
  </button>
</div>
