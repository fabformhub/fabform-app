<script>
  let { value = $bindable(), canAnswer = false, props } = $props();
  let inputValue = $state(value ?? '');

  $effect(() => {
    value = inputValue;
  });
</script>

<div class="relative w-full m-0 p-0">
  <input
    type="text"
    bind:value={inputValue}
    placeholder={props.placeholder}
    readonly={!canAnswer}
    class={`block w-full bg-transparent border-0 border-b-2 text-xl py-2 px-0 outline-none transition-all duration-300
      ${canAnswer
        ? 'text-gray-900 border-gray-400 focus:border-indigo-500 cursor-text'
        : 'text-gray-400 border-gray-200 cursor-not-allowed'}
    `}
  />

  {#if canAnswer}
    <span class="absolute bottom-0 left-0 h-0.5 w-0 bg-indigo-500 transition-all duration-300 peer-focus:w-full"></span>
  {/if}
</div>
