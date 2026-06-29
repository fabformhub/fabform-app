<script>
  let {
    choices = [],
    value = $bindable(),
    placeholder = "Select..."
  } = $props();

  let open = $state(false);

  const selected = $derived(
    choices.find(c => c.value === value)
  );

  function select(option) {
    value = option.value; // IMPORTANT: store string only
    open = false;
  }

  function toggle() {
    open = !open;
  }
</script>

<div class="relative w-full">
  <!-- Trigger -->
  <button
    type="button"
    class="w-full flex items-center justify-between px-3 py-2 border rounded-md bg-white hover:bg-gray-50"
    on:click={toggle}
  >
    <span class="text-sm text-gray-700">
      {selected?.label ?? placeholder}
    </span>

    <svg class="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
    </svg>
  </button>

  <!-- Dropdown -->
  {#if open}
    <div class="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg overflow-hidden">
      {#each choices as option}
        <button
          type="button"
          class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
          on:click={() => select(option)}
        >
          {option.label}
        </button>
      {/each}
    </div>
  {/if}
</div>
