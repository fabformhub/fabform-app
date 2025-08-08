<script>
  import { Calendar } from 'lucide-svelte';

  // Destructure with defaults from $props directly
  let { value = $bindable(), formMode = false, props = {} } = $props();
  let { label = 'Pick a date' } = props; // label is still here if you want to use it somewhere else or remove it

  // Local state initialized from parent prop value
  let selectedDate = $state(value || '');

  let inputRef;

  // Update both local and external value on input
  function onDateChange(event) {
    selectedDate = event.target.value;
    value = selectedDate;
  }

  function openCalendar() {
    if (!formMode) return;
    if (inputRef?.showPicker) {
      inputRef.showPicker();
    } else {
      inputRef?.focus();
    }
  }
</script>

<style>
  input[type="date"]::-webkit-calendar-picker-indicator {
    display: none;
  }
  input[type="date"]::-moz-calendar-picker-indicator {
    display: none;
  }
</style>

<div
  class="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm"
  class:cursor-not-allowed={!formMode}
>
  <input
    bind:this={inputRef}
    type="date"
    value={selectedDate}
    on:input={onDateChange}
    class="appearance-none text-gray-700 text-lg outline-none bg-transparent flex-grow"
    readonly={!formMode}
    tabindex={formMode ? 0 : -1}
    on:click|stopPropagation={() => formMode && openCalendar()}
  />
  <button
    type="button"
    on:click={openCalendar}
    class="ml-2 p-1 rounded-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    aria-label="Open calendar"
    disabled={!formMode}
  >
    <Calendar class="w-5 h-5 text-indigo-600" />
  </button>
</div>
