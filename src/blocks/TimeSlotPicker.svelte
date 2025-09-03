<script>
  import { onMount } from "svelte";
  import { CalendarClock } from "lucide-svelte";

  let { canAnswer = true, value = $bindable(), props } = $props();

  // Generate mock slots for today + next 2 days
  const now = new Date();
  let availableSlots = $state([
    { start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0).toISOString(), end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30).toISOString() },
    { start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0).toISOString(), end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 30).toISOString() },
    { start: new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 11, 0).toISOString(), end: new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 11, 30).toISOString() },
    { start: new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 14, 0).toISOString(), end: new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 14, 30).toISOString() },
    { start: new Date(now.getFullYear(), now.getMonth(), now.getDate()+2, 13, 0).toISOString(), end: new Date(now.getFullYear(), now.getMonth(), now.getDate()+2, 13, 30).toISOString() },
  ]);

  let selectedDate = $state(null);
  let selectedSlot = $state(value);
  let animating = $state(false);

  // Extract unique days from slots
  let days = $derived(
    Array.from(new Set(availableSlots.map(s => new Date(s.start).toDateString())))
  );

  // Filter slots for chosen day
  let filteredSlots = $derived(
    selectedDate
      ? availableSlots.filter(s =>
          new Date(s.start).toDateString() === new Date(selectedDate).toDateString()
        )
      : []
  );

  // Auto-select first available date on mount
  onMount(() => {
    if (days.length > 0) {
      selectedDate = new Date(days[0]);
    }
  });

  function selectDate(day) {
    selectedDate = new Date(day);
    selectedSlot = null; // reset slot selection
  }

  function selectSlot(slot) {
    if (!canAnswer) return;
    selectedSlot = slot;
    value = slot;

    animating = false;
    requestAnimationFrame(() => (animating = true));
  }
</script>

<style>
  .pop { animation: pop 0.3s ease; }
  @keyframes pop { 0% { transform: scale(1); } 40% { transform: scale(1.1); } 100% { transform: scale(1); } }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>

<div class="w-full max-w-3xl mx-auto space-y-4 p-4 border rounded-lg shadow-sm bg-white">

  <!-- Header with icon -->
  <div class="flex items-center gap-2 mb-2">
    <CalendarClock class="w-5 h-5 text-indigo-600"/>
    <span class="font-semibold text-gray-700">Pick a Time Slot</span>
  </div>

  <!-- Date picker row -->
  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
    {#each days as day}
      <button
        onclick={() => selectDate(day)}
        class={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition
          ${selectedDate?.toDateString() === new Date(day).toDateString()
            ? `bg-indigo-600 text-white shadow-md ${animating ? 'pop' : ''}`
            : 'bg-white text-gray-800 border border-gray-300 hover:bg-indigo-100 hover:text-indigo-700'}
        `}
      >
        {new Date(day).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
      </button>
    {/each}
  </div>

  <!-- Slots grid -->
  {#if selectedDate}
    {#if filteredSlots.length > 0}
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 px-2">
        {#each filteredSlots as slot}
          <button
            onclick={() => selectSlot(slot)}
            class={`p-3 rounded-lg font-medium text-sm transition duration-300 transform
              flex items-center justify-center
              ${selectedSlot?.start === slot.start
                ? `bg-indigo-600 text-white shadow-lg ${animating ? 'pop' : ''}`
                : 'bg-white text-gray-800 border border-gray-300 hover:bg-indigo-100 hover:text-indigo-700'}
            `}
          >
            {new Date(slot.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </button>
        {/each}
      </div>
    {:else}
      <p class="text-center text-gray-500 text-sm px-2">No available slots for this date.</p>
    {/if}

    <!-- Selected slot summary -->
    {#if selectedSlot}
      <p class="mt-2 text-center text-gray-700 font-medium">
        📅 You selected: {new Date(selectedSlot.start).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })} at {new Date(selectedSlot.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </p>
    {/if}
  {:else}
    <p class="text-center text-gray-500 text-sm">Pick a date to see available times</p>
  {/if}
</div>
