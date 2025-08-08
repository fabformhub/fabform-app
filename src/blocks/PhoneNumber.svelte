<script>
  import { countries } from '../constants/countries.js';
  import { clickOutside } from '../utils/clickOutside.js';

  let { value = $bindable(), formMode = false, props } = $props();
  
  let selectedCountry = $state(countries[0]);
  let number = $state('');
  let showDropdown = $state(false);

  $effect(() => {
    value = number ? `${selectedCountry.code}${number}` : '';
  });

  function handleInput(e) {
    if (!formMode) {
      e.preventDefault();
      return;
    }
    number = e.target.value.replace(/\D/g, '');
  }

  function toggleDropdown() {
    if (formMode) {
      showDropdown = !showDropdown;
    }
  }

  function selectCountry(country) {
    if (!formMode) return;
    selectedCountry = country;
    showDropdown = false;
  }
</script>

<style>
  /* Override cursor styles */
  .disabled-cursor {
    cursor: pointer;
  }
  button.disabled,
  input.disabled {
    cursor: not-allowed;
  }
</style>

<div class={`flex flex-col space-y-2 w-full max-w-xs ${!formMode ? 'disabled-cursor' : ''}`}>
  <label class="text-gray-700 text-base font-medium"></label>

  <div class="relative flex items-center space-x-2 w-full">
    <button
      type="button"
      class={`flex items-center space-x-2 min-w-[100px] bg-transparent text-base
        border-b-2 border-gray-300
        ${formMode ? 'focus:border-indigo-500 focus:outline-none' : 'opacity-50 cursor-not-allowed'}`}
      on:click={toggleDropdown}
      tabindex={formMode ? 0 : -1}
      aria-disabled={!formMode}
    >
      <span>{selectedCountry.flag}</span>
      <span>{selectedCountry.code}</span>
      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <input
      type="text"
      class={`flex-1 bg-transparent text-lg
        border-b-2 border-gray-300
        focus:border-indigo-500 focus:outline-none
        ${formMode ? 'text-gray-800 cursor-text' : 'text-gray-400 cursor-not-allowed'}
      `}
      bind:value={number}
      on:input={handleInput}
      tabindex={formMode ? 0 : -1}
      inputmode="numeric"
      pattern="\d*"
      placeholder="123456789"
      readonly={!formMode}
      aria-readonly={!formMode}
    />

    {#if showDropdown}
      <ul
        use:clickOutside={() => (showDropdown = false)}
        class="absolute top-full left-0 mt-2 w-[360px] bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg shadow-xl z-50 max-h-[calc(100vh-6rem)] overflow-auto text-sm transition-all duration-200"
      >
        <li class="px-4 py-2 font-semibold text-gray-600 sticky top-0 bg-white/90 backdrop-blur-sm border-b">
          Select a country
        </li>
        {#each countries as country}
          <li
            class="px-4 py-3 hover:bg-indigo-50 cursor-pointer flex items-center justify-between transition-all duration-150"
            on:click={() => selectCountry(country)}
          >
            <span class="flex items-center space-x-2">
              <span>{country.flag}</span>
              <span>{country.name}</span>
            </span>
            <span class="text-gray-500">{country.code}</span>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>
