<script>
  let { value = $bindable(), formMode = false, props } = $props();
  let { message = '' } = props ?? {};
  let inputValue = $state(value ?? '');
  let size = $derived(props?.size ?? 'Medium');

  const sizeClasses = {
    'Small': 'w-80 h-32',
    'Medium': 'w-96 h-40',
    'Large': 'w-[32rem] h-48',
    'Extra Large': 'w-[32rem] h-64'
  };

  function handleInput(e) {
    if (formMode) {
      inputValue = e.target.value;
      value = e.target.value;
    }
  }
</script>

<div class="w-full px-4 py-2">
  <textarea
    bind:value={inputValue}
    on:input={handleInput}
    placeholder={props.placeholder}
    class={`border rounded-xl p-4 resize-none text-base shadow-sm focus:outline-none
      ${sizeClasses[size]}
      ${
        formMode
          ? 'text-gray-900 border-gray-400 focus:border-indigo-500'
          : 'text-gray-400 border-gray-200 cursor-not-allowed'
      }
    `}
  />

  {#if message}
    <p class="text-sm text-gray-600 mt-2 ml-1 italic">{message}</p>
  {/if}
</div>
