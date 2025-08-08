<script>
  let { value = $bindable(), formMode = false, props } = $props();
  let { icon = null } = props ?? {};

  let inputValue = $state(value ?? '');

  function handleInput(e) {
    inputValue = e.target.value;
    value = e.target.value;
  }
</script>

<!-- No margin, no padding, full width -->
<div class="relative w-full m-0 p-0">
  {#if icon}
    <span class="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
      {@html icon}
    </span>
  {/if}

  <input
    type="text"
    bind:value={inputValue}
    on:input={handleInput}
    placeholder={props.placeholder}
    tabindex={formMode ? 0 : -1}
    class={`peer block w-full bg-transparent border-0 border-b-2 text-xl py-2 px-0 outline-none transition-all duration-300
      ${icon ? 'pl-8' : ''}
      ${formMode
        ? 'text-gray-900 border-gray-400 focus:border-indigo-500'
        : 'text-gray-400 border-gray-200 cursor-not-allowed'}
    `}
  />

  {#if formMode}
    <!-- Underline animation -->
    <span class="absolute bottom-0 left-0 h-0.5 w-0 bg-indigo-500 transition-all duration-300 peer-focus:w-full"></span>
  {/if}
</div>
