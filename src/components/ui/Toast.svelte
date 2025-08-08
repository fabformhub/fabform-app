<script>
  import { CheckCircle, Info, AlertCircle } from 'lucide-svelte';

  export let message = '';
  export let type = 'info'; // 'success', 'error', 'info'
  export let duration = 4000;

  let visible = true;

  const typeStyles = {
    success: {
      color: 'bg-green-500 text-white',
      Icon: CheckCircle
    },
    error: {
      color: 'bg-red-500 text-white',
      Icon: AlertCircle
    },
    info: {
      color: 'bg-blue-500 text-white',
      Icon: Info
    }
  };

  const { color, Icon } = typeStyles[type];

  setTimeout(() => {
    visible = false;
  }, duration);
</script>

{#if visible}
  <div
    class={`fixed top-12 right-12 px-4 py-3 rounded shadow-lg flex items-center justify-between gap-4 transition-opacity duration-500 ease-in-out ${color}`}
    role="alert"
  >
    <div class="flex items-center gap-2">
      <Icon class="w-5 h-5" />
      <span class="text-sm">{message}</span>
    </div>
    <button
      on:click={() => (visible = false)}
      class="text-white font-bold text-xl leading-none hover:opacity-75"
      aria-label="Close"
    >
      &times;
    </button>
  </div>
{/if}
