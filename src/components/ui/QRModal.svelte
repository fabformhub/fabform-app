<script>
  import { onMount, tick } from "svelte";
  import { Download } from "lucide-svelte";

  let { open = false, text = "", onClose = () => {} } = $props();

  let canvas;
  let QRCode;

  onMount(async () => {
    const module = await import("qrcode");
    QRCode = module.default;
    if (open) await generateQRCode();
  });

  $effect(async () => {
    if (open && QRCode && canvas && text) {
      await tick();
      await generateQRCode();
    }
  });

  async function generateQRCode() {
    if (QRCode && canvas && text) {
      QRCode.toCanvas(canvas, text, { width: 150 }).catch(console.error);
    }
  }

  function downloadQRCode() {
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }
</script>

{#if open}
  <div
    class="fixed inset-0 flex items-center justify-center bg-black/30 z-50"
    on:click={onClose}
  >
    <div
      class="bg-white p-4 rounded shadow-sm relative flex flex-col items-center"
      on:click|stopPropagation
    >
      <canvas bind:this={canvas}></canvas>
      <div class="mt-2 text-sm text-gray-700 break-words text-center max-w-[180px]">
        {text}
      </div>
      <button
        class="absolute top-1 right-1 text-gray-600 hover:text-gray-800 font-bold"
        on:click={onClose}
      >
        ×
      </button>
      <button
        class="absolute top-1 right-8 text-gray-600 hover:text-gray-800 group"
        on:click={downloadQRCode}
        aria-label="Download QR code"
      >
        <Download class="w-5 h-5" />
        <span class="absolute -top-6 right-0 scale-0 group-hover:scale-100 transition-transform bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
          Download QR code
        </span>
      </button>
    </div>
  </div>
{/if}
