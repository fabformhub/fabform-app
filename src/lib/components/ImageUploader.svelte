<script>
  import { CloudUpload, X, RefreshCw } from "lucide-svelte";
  import { onDestroy } from "svelte";
  import { uploadImage, deleteImage } from "$lib/storage";

  let { id, imageType = "block", image = $bindable() } = $props();
  let input;

  // ─────────────────────────────────────────────
  // STATE (runes-only)
  // ─────────────────────────────────────────────
  let dragging = $state(false);
  let uploading = $state(false);
  let hover = $state(false);
  let activeUploadId = 0;

  let blobUrl = $state(null);

  const err = (...a) => console.error(...a);

  // ─────────────────────────────────────────────
  // DERIVED STATE
  // ─────────────────────────────────────────────
  let preview = $derived(blobUrl || image);
  let hasImage = $derived(!!preview);

  // ─────────────────────────────────────────────
  // CLEANUP
  // ─────────────────────────────────────────────
  function cleanupBlob() {
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      blobUrl = null;
    }
  }

  onDestroy(() => cleanupBlob());

  // ─────────────────────────────────────────────
  // FILE PICKER
  // ─────────────────────────────────────────────
  function openPicker() {
    input?.click();
  }

  function handleChange(e) {
    handleFile(e.target.files?.[0]);
  }

  function handleDragOver(e) {
    e.preventDefault();
    dragging = true;
  }

  function handleDragLeave() {
    dragging = false;
  }

  function handleDrop(e) {
    e.preventDefault();
    dragging = false;
    handleFile(e.dataTransfer.files?.[0]);
  }

  // ─────────────────────────────────────────────
  // UPLOAD (race-safe)
  // ─────────────────────────────────────────────
  async function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;

    const uploadId = ++activeUploadId;

    cleanupBlob();

    blobUrl = URL.createObjectURL(file);
    uploading = true;

    try {
      const result = await uploadImage({
        file,
        folder: imageType === "form" ? "f" : "b",
        id
      });

      if (uploadId !== activeUploadId) return;

      image = result.url;

    } catch (e) {
      err("Upload failed:", e);

      if (uploadId !== activeUploadId) return;

      cleanupBlob();
    } finally {
      if (uploadId === activeUploadId) {
        uploading = false;
      }
    }
  }

  // ─────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────
  async function removeImage(e) {
    e?.stopPropagation();

    try {
      if (image) {
        await deleteImage(image);
      }
    } catch (e) {
      err("Delete failed:", e);
    }

    cleanupBlob();
    image = null;

    if (input) input.value = "";
  }
</script>

<!-- hidden input -->
<input
  bind:this={input}
  type="file"
  accept="image/*"
  class="hidden"
  on:change={handleChange}
/>

<!-- ───────────────────────────────────────────── -->
<!-- EMPTY STATE (BOSS LEVEL) -->
<!-- ───────────────────────────────────────────── -->
{#if !hasImage}
  <div
    class="group relative w-full rounded-[32px]
           overflow-hidden cursor-pointer
           bg-gradient-to-b from-slate-50 to-white
           border border-slate-200
           shadow-[0_20px_60px_rgba(0,0,0,0.06)]
           transition-all duration-500
           hover:shadow-[0_25px_80px_rgba(0,0,0,0.10)]
           hover:border-slate-300"
    class:scale-[1.01]={dragging}
    class:border-sky-400={dragging}
    class:bg-sky-50={dragging}
    on:click={openPicker}
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
  >

    <!-- ambient glow -->
    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700">
      <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px]
                  bg-gradient-radial from-sky-200/30 via-transparent to-transparent blur-3xl" />
    </div>

    <div class="relative py-28 text-center px-8">

      <!-- icon -->
      <div class="relative mx-auto w-24 h-24">

        <div class="absolute inset-0 rounded-full bg-sky-100/40 blur-xl scale-125 opacity-0 group-hover:opacity-100 transition" />

        <div class="relative w-24 h-24 rounded-full
                    bg-white border border-slate-200
                    shadow-[0_10px_30px_rgba(0,0,0,0.06)]
                    flex items-center justify-center
                    transition-all duration-500
                    group-hover:scale-[1.05]">

          <CloudUpload size={40} class="text-slate-400" />
        </div>
      </div>

      <h3 class="mt-10 text-2xl font-semibold text-slate-900 tracking-tight">
        Drop your image anywhere
      </h3>

      <p class="mt-3 text-slate-500 text-sm max-w-md mx-auto">
        Or click to upload. 
      </p>

    </div>
  </div>

<!-- ───────────────────────────────────────────── -->
<!-- IMAGE STATE (FINAL BOSS SYSTEM) -->
<!-- ───────────────────────────────────────────── -->
{:else}
  <div
    class="group relative overflow-hidden rounded-[32px] cursor-pointer bg-black"
    on:click={openPicker}
    on:mouseenter={() => hover = true}
    on:mouseleave={() => hover = false}
  >

    <!-- IMAGE -->
    <img
      src={preview}
      class="w-full aspect-[16/9] object-cover
             transition duration-700 ease-out
             group-hover:scale-[1.035]
             group-hover:brightness-[0.72]"
    />

    <!-- depth layer -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

    <!-- ring -->
    <div class="absolute inset-0 ring-1 ring-white/0 group-hover:ring-white/15 transition rounded-[32px]" />

    <!-- CONTROL DOCK -->
    <div
      class="absolute top-5 right-5 flex gap-2
             transition-all duration-300"
      style="
        transform: translateY({hover ? '0px' : '8px'});
        opacity: {hover ? 1 : 0};
      "
    >

      <!-- REPLACE -->
      <button
        on:click|stopPropagation={openPicker}
        class="group/btn relative w-10 h-10 rounded-full
               bg-white/5 hover:bg-white/12
               backdrop-blur-[22px]
               border border-white/10
               shadow-[0_12px_50px_rgba(0,0,0,0.55)]
               flex items-center justify-center
               transition-all duration-300
               hover:scale-[1.09]"
      >
        <RefreshCw size={14} class="text-white/85 group-hover/btn:rotate-[-12deg]" />
      </button>

      <!-- REMOVE -->
      <button
        on:click|stopPropagation={removeImage}
        class="group/btn relative w-10 h-10 rounded-full
               bg-white/5 hover:bg-red-500/25
               backdrop-blur-[22px]
               border border-white/10
               shadow-[0_12px_50px_rgba(0,0,0,0.55)]
               flex items-center justify-center
               transition-all duration-300
               hover:scale-[1.06]"
      >
        <X size={15} class="text-white/80" />
      </button>
    </div>

    <!-- UPLOAD STATE (BOSS CHIP) -->
    {#if uploading}
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="flex items-center gap-3 px-4 py-2 rounded-full
                    bg-white/5 backdrop-blur-2xl
                    border border-white/10
                    shadow-[0_12px_50px_rgba(0,0,0,0.55)]
                    text-white/80 text-[11px]">

          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute h-full w-full rounded-full bg-white/50"></span>
            <span class="relative h-2 w-2 rounded-full bg-white/90"></span>
          </span>

          Uploading

          <span class="w-10 h-[2px] bg-white/10 overflow-hidden relative rounded-full">
            <span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></span>
          </span>

        </div>
      </div>
    {/if}

  </div>
{/if}
