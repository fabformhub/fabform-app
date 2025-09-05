<script>
  import { dialog, closeDialog } from '../../utils/dialog.svelte.js';
  import { fade, scale } from 'svelte/transition';
  import { onMount, tick } from 'svelte';
  import { Download } from 'lucide-svelte';

  let canvas;
  let QRCode;
  let qrColor = "#000000";
  const bgColor = "#ffffff";
  const qrSize = 220;
  const textAreaHeight = 20;
  const headingHeight = 30; // space above QR

  // heading state (defaults here)
  let headingText = "How Are We Doing?";

  async function generateQRCode() {
    if (!canvas || !QRCode || !dialog.props?.text) return;

    await tick(); // ensure canvas is rendered
    const ctx = canvas.getContext("2d");

    const qrCanvas = document.createElement("canvas");
    await QRCode.toCanvas(qrCanvas, dialog.props.text, {
      width: qrSize,
      margin: 0,
      color: { dark: qrColor, light: bgColor }
    });

    const qrActualHeight = qrCanvas.height;

    // total canvas size = heading + qr + footer
    canvas.width = qrSize;
    canvas.height = headingHeight + qrActualHeight + textAreaHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw heading
    ctx.fillStyle = "#111";
    ctx.font = "bold 16px Verdana, Geneva, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(headingText, qrSize / 2, 5);

    // draw QR code under heading
    ctx.drawImage(qrCanvas, 0, headingHeight);

    // draw footer
    ctx.fillStyle = "#555";
    ctx.font = "bold 12px Verdana, Geneva, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Powered by FabForm.io", qrSize / 2, headingHeight + qrActualHeight + 6);
  }

  function downloadQRCode() {
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  onMount(async () => {
    const module = await import("qrcode");
    QRCode = module.default;
    if (dialog.show && dialog.props?.text) generateQRCode();
  });

  // Svelte 5 reactive effect
  $effect(() => {
    if (dialog.show && QRCode && canvas && dialog.props?.text) {
      generateQRCode();
    }
  });
</script>

{#if dialog.show && dialog.props?.text}
<div 
  class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" 
  on:click={() => closeDialog(false)}
  tabindex="0"
  transition:fade
>
  <div
    class="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center gap-4"
    role="dialog"
    aria-modal="true"
    on:click|stopPropagation
    transition:scale={{ duration: 200 }}
  >
    <canvas bind:this={canvas}></canvas>

    <div class="flex flex-col items-center mt-2">
      <label class="text-sm mb-2 font-medium text-gray-600">Change QR Color</label>
      <input 
        type="color" 
        bind:value={qrColor} 
        on:input={generateQRCode} 
        class="w-14 h-14 p-0 border-0 rounded cursor-pointer"
      />
    </div>

    <!-- New Heading Input -->
    <div class="flex flex-col items-center mt-4 w-full">
      <label class="text-sm mb-2 font-medium text-gray-600">Change Heading</label>
      <input
        type="text"
        bind:value={headingText}
        on:input={generateQRCode}
        class="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter heading..."
      />
    </div>

    <div class="flex gap-3 mt-3">
      <button 
        class="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold flex items-center gap-2"
        on:click={downloadQRCode}
      >
        <Download class="w-5 h-5"/>
        Download
      </button>
    </div>
  </div>
</div>
{/if}
