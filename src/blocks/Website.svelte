<script>
  let { value = $bindable(), formMode = false, props } = $props();
  let {
    placeholder = 'Enter website URL...',
    icon = null,
    message = ''
  } = props ?? {};

  let inputValue = $state(value ?? '');

  function handleInput(e) {
    inputValue = e.target.value;
    value = e.target.value;
  }
</script>

<div class="relative group">
  {#if icon}
    <span class="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
      {@html icon}
    </span>
  {/if}

  <input
    type="url"
    bind:value={inputValue}
    on:input={handleInput}
    placeholder={placeholder}
    tabindex={formMode ? 0 : -1}
    disabled={!formMode}
    class={`w-full transition-all duration-300 ease-in-out rounded-xl text-base px-4 py-2 font-medium shadow-sm outline-none
      ${icon ? 'pl-10' : ''}
      ${formMode 
        ? 'bg-white text-gray-900 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300'
        : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'}
    `}
  />
</div>

{#if message}
  <p class="text-xs text-gray-500 mt-1">{message}</p>
{/if}
