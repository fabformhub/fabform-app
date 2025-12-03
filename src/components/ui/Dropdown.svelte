<script>
  let { 
    choices = [], 
    choiceSelected, 
    value = $bindable(), 
    canAnswer = true,   // ✅ default to true
    props 
  } = $props();

  let selectedValue = $state(value ?? '');

  function handleChange(e) {
    selectedValue = e.target.value;
    value = selectedValue;            // keep bind:value in sync
    choiceSelected?.(selectedValue);  // notify parent
  }
</script>

<div class="relative w-full m-0 p-0">
  <select
    bind:value={selectedValue}
    on:change={handleChange}
    disabled={!canAnswer}
    class={`block w-full bg-transparent border-0 border-b-2 text-xl py-2 px-0 outline-none transition-all duration-300
      ${canAnswer 
        ? 'text-gray-900 border-gray-400 focus:border-indigo-500 cursor-pointer' 
        : 'text-gray-400 border-gray-200 cursor-not-allowed'
      }`}
  >
    {#if props?.placeholder}
      <option value="" disabled hidden>{props.placeholder}</option>
    {/if}
    {#each choices as choice}
      <option value={choice}>{choice}</option>
    {/each}
  </select>

  {#if canAnswer}
    <span class="absolute bottom-0 left-0 h-0.5 w-0 bg-indigo-500 transition-all duration-300 peer-focus:w-full"></span>
  {/if}
</div>
