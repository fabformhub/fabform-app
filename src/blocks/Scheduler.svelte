<script>
  import { Calendar } from 'lucide-svelte';

  const props = $props();
  let show = $state(false);

  function openPopup() {
    show = true;
  }

  function closePopup() {
    show = false;
  }

  const label = props.label ?? 'Choose a slot';
</script>

<!-- Trigger Button -->
<button
  on:click={openPopup}
  class="flex items-center gap-2 px-4 py-2 bg-white text-black border border-gray-300 rounded hover:bg-gray-100 shadow-sm"
>
  <Calendar class="w-5 h-5" />
  {label}
</button>

<!-- Fullscreen Modal -->
{#if show}
  <div class="fixed inset-0 z-50">
    <!-- Background overlay -->
    <div
      class="absolute inset-0 bg-black bg-opacity-50"
      on:click={closePopup}
    ></div>

    <!-- Fullscreen iframe container -->
    <div class="absolute inset-0">
      <button
        on:click={closePopup}
        class="absolute top-4 right-4 z-10 bg-white text-black text-xl px-3 py-1 rounded shadow hover:bg-gray-100"
        aria-label="Close"
      >
        ×
      </button>
      <iframe
        src="https://calendly.com/irishgeoffrey"
        class="w-full h-full border-none"
        frameborder="0"
      ></iframe>
    </div>
  </div>
{/if}
