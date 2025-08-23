<script>
  import { onMount } from 'svelte';
  import { tick } from 'svelte';

  let { open = false, text = "", onClose = () => {} } = $props();
  let canvas;
  let QRCode;

  onMount(async () => {
    const module = await import('qrcode');
    QRCode = module.default;

    if (open) await generateQRCode();
  });

  // Re-run whenever `open` or `text` changes
  $effect(async () => {
    if (open) {
      await tick(); // wait for DOM
      await generateQRCode();
    }
  });

  async function generateQRCode() {
    if (QRCode && canvas && text) {
      QRCode.toCanvas(canvas, text, { width: 150 }).catch(console.error);
    }
  }
</script>

{#if open}
  <div class="fixed inset-0 flex items-center justify-center bg-black/30 z-50" on:click={onClose}>
    <div class="bg-white p-4 rounded shadow-sm relative flex flex-col items-center" on:click|stopPropagation>
      <canvas bind:this={canvas}></canvas>
      <div class="mt-2 text-sm text-gray-700 break-words text-center max-w-[180px]">{text}</div>
      <button class="absolute top-1 right-1 text-gray-600 hover:text-gray-800 font-bold" on:click={onClose}>×</button>
    </div>
  </div>
{/if}
