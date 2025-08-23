<script>
  let { value = $bindable(), formMode, props } = $props();
  let { icon = null } = props ?? {};

  let inputValue = $state(value ?? '');

  $effect(() => {
    value = inputValue;
  });
</script>

<div class="relative w-full m-0 p-0">
  {#if icon}
    <span 
      class="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      aria-hidden="true"
    >
      {@html icon}
    </span>
  {/if}
 
  <input
    type="text"
    bind:value={inputValue}
    placeholder={props.placeholder}
    tabindex={formMode ? 0 : -1}
    disabled={formMode}
    class={`peer block w-full bg-transparent border-0 border-b-2 text-xl py-2 px-0 outline-none transition-all duration-300
      ${icon ? 'pl-8' : ''}
      
        'text-gray-900 border-gray-400 focus:border-indigo-500 cursor-text'
        
    `}
  />

  {#if formMode}
    <span class="absolute bottom-0 left-0 h-0.5 w-0 bg-indigo-500 transition-all duration-300 peer-focus:w-full"></span>
  {/if}
</div>
