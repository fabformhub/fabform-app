<script>
  import { ChevronDown } from 'lucide-svelte';
  import { fly, scale } from 'svelte/transition';
  import { clickOutside } from '../utils/clickOutside.js';
  import { debounce } from '../utils/debounce.js';

  let { formMode, value = $bindable(), props } = $props();
  let { choices = [], label = '' } = props;

  let isOpen = $state(false);
  let selected = $state(value || null);
  let flashIndex = $state(null);

  const closeDebounced = debounce(() => {
    isOpen = false;
    flashIndex = null;
  }, 300);

  function toggleDropdown() {
    if (!formMode) return;
    isOpen = !isOpen;
  }

  function selectOption(option, idx) {
    if (!formMode) return;
    selected = option;
    value = option;
    flashIndex = idx;
    closeDebounced();
  }
</script>

<div
  class="relative inline-block w-64 font-sans"
  use:clickOutside={() => {
    if (formMode) isOpen = false;
  }}
>
  <button
    on:click={toggleDropdown}
    class="w-full flex justify-between items-center px-5 py-3 rounded-lg bg-white border border-gray-300 shadow-sm text-gray-700 font-medium hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
    style={!formMode ? 'pointer-events: none;' : ''}
    aria-haspopup="listbox"
    aria-expanded={isOpen}
  >
    <span class="truncate flex-grow text-left">{selected || label}</span>
    <ChevronDown
      class={`w-5 h-5 ml-2 transition-transform duration-300 text-gray-500 ${isOpen ? 'rotate-180' : ''}`}
    />
  </button>

  {#if isOpen && formMode}
    <div
      class="absolute right-0 mt-2 w-full rounded-lg bg-white border border-gray-300 shadow-lg z-50"
      role="listbox"
      tabindex="-1"
    >
      <div class="relative max-h-60 overflow-y-auto rounded-lg pr-2">
        <!-- Top scroll indicator -->
        <div class="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
        <!-- Bottom scroll indicator -->
        <div class="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />

        <ul class="p-2 space-y-1 relative z-20">
          {#each choices as option, i}
            <li
              on:click={() => selectOption(option, i)}
              class={`flex justify-between items-center px-4 py-2 rounded-md cursor-pointer select-none transition-colors duration-200
                ${
                  flashIndex === i
                    ? 'bg-gray-100 animate-pulse'
                    : selected === option
                    ? 'bg-gray-200 font-semibold text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              role="option"
              aria-selected={selected === option}
              tabindex="0"
            >
              <span>{option}</span>
              {#if selected === option}
                <span transition:scale={{ duration: 200 }} class="text-gray-700">
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}
</div>

<style>
  .rotate-180 {
    transform: rotate(180deg);
  }
</style>
