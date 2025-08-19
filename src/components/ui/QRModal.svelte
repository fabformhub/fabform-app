<script>
  import { onMount } from 'svelte';

  let { open = false, text = "", onClose = () => {} } = $props();

  let canvas;
  let QRCode;

  onMount(async () => {
    const module = await import('qrcode');
    QRCode = module.default;

    if (open) renderQRCode();
  });

  function renderQRCode() {
    if (QRCode && canvas) {
      QRCode.toCanvas(canvas, text, { width: 60 }).catch(err => console.error(err));
    }
  }

  $effect(() => {
    if (open) renderQRCode();
  });
</script>

{#if open}
<div
  class="fixed inset-0 flex items-center justify-center z-50"
  on:click={() => onClose()}
>
  <div class="bg-white p-2 rounded shadow-sm relative flex flex-col items-center" on:click|stopPropagation>
    <canvas bind:this={canvas}></canvas>
    <div class="mt-2 text-xs text-gray-700 break-words text-center max-w-[150px]">
      {text}
    </div>
    <!-- Close icon -->
    <button
      class="absolute top-1 right-1 text-gray-600 hover:text-gray-800 text-sm font-bold"
      on:click={onClose}
      aria-label="Close"
    >
      ×
    </button>
  </div>
</div>
{/if}
