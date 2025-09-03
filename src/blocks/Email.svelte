<script>
  let { value = $bindable(), canAnswer = false, props } = $props();

  let {
    placeholder = 'Enter your email...',
    icon = null,
    message = ''
  } = props ?? {};

  let inputValue = $state(value ?? '');

  // keep external value synced with local state
  $effect(() => {
    value = inputValue;
  });

  // derived email validation
  let isValid = $derived(
    inputValue === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)
  );
</script>

<div class="relative group">
  {#if icon}
    <span class="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
      {@html icon}
    </span>
  {/if}

  <input
    type="email"
    bind:value={inputValue}
    placeholder={placeholder}
    tabindex={canAnswer ? 0 : -1}
    disabled={!canAnswer}
    aria-invalid={!isValid}
    class={`w-full transition-all duration-300 ease-in-out rounded-xl text-base px-4 py-2 font-medium shadow-sm outline-none
      ${icon ? 'pl-10' : ''}
      ${canAnswer 
        ? `${isValid 
            ? 'bg-white text-gray-900 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300' 
            : 'bg-white text-gray-900 border border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-300'}`
        : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'}
    `}
  />
</div>

{#if message}
  <p class="text-xs text-gray-500 mt-1">{message}</p>
{/if}

{#if !isValid && inputValue}
  <p class="text-xs text-red-500 mt-1">Please enter a valid email address.</p>
{/if}
