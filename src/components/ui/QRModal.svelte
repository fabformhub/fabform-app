<script>
  import { onMount, tick } from "svelte";
  import { Download } from "lucide-svelte";

  let { text = "" } = $props();
  let open = $state(false);  // make open reactive
  let qrColor = $state("#000000");
  const bgColor = "#ffffff";
  let canvas;
  let QRCode;

  const qrSize = 220;
  const textAreaHeight = 20;

  onMount(async () => {
    const module = await import("qrcode");
    QRCode = module.default;
    if (open) generateQRCode();
  });

  async function generateQRCode() {
    if (!canvas || !QRCode || !text) return;
    await tick();
    const ctx = canvas.getContext("2d");

    const qrCanvas = document.createElement("canvas");
    await QRCode.toCanvas(qrCanvas, text, {
      width: qrSize,
      margin: 0,
      color: { dark: qrColor, light: bgColor }
    });

    const qrActualHeight = qrCanvas.height;
    canvas.width = qrSize;
    canvas.height = qrActualHeight + textAreaHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(qrCanvas, 0, 0);

    ctx.fillStyle = "#555";
    ctx.font = "bold 12px Verdana, Geneva, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Powered by Fabform.io", qrSize / 2, qrActualHeight + 6);
  }

  $effect(() => {
    if (open && QRCode && canvas && text) generateQRCode();
  });

  function downloadQRCode() {
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function close() {
    open = false;
    canvas = null;
  }
</script>

{#if open}
<div class="fixed inset-0 flex items-center justify-center bg-black/30 z-50" on:click={close}>
  <div class="bg-white p-6 rounded-2xl shadow-lg relative flex flex-col items-center gap-4 min-w-[280px]" on:click|stopPropagation>
    
    <button class="absolute top-3 right-3 text-gray-600 hover:text-gray-800 font-bold text-xl" on:click={close}>×</button>

    <canvas bind:this={canvas}></canvas>

    <div class="flex flex-col items-center mt-2">
      <label class="text-sm mb-2 font-medium text-gray-600">Change QR Color</label>
      <input type="color" bind:value={qrColor} on:input={generateQRCode} class="w-14 h-14 p-0 border-0 rounded cursor-pointer"/>
    </div>

    <div class="flex gap-3 mt-3">
      <button class="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold flex items-center gap-2"
              on:click={downloadQRCode}>
        <Download class="w-5 h-5"/>
        Download
      </button>
    </div>
    
  </div>
</div>
{/if}
