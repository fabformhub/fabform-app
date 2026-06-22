<script>
  import { CloudUpload, X, RefreshCw } from "lucide-svelte";
  import { onDestroy } from "svelte";
  import { uploadImage, deleteImage } from "$lib/storage";

  let { id, imageType = "form", backgroundImage = $bindable() } = $props();

  let input;

  // ─────────────────────────────────────────────
  // STATE (runes-only)
  // ─────────────────────────────────────────────
  let dragging = $state(false);
  let uploading = $state(false);
  let activeUploadId = 0;

  let blobUrl = $state(null);

  const DEV = false;
  const log = (...a) => DEV && console.log(...a);
  const err = (...a) => DEV && console.error(...a);

  // ─────────────────────────────────────────────
  // DERIVED STATE
  // ─────────────────────────────────────────────
  let preview = $derived(blobUrl || backgroundImage || null);
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

  onDestroy(() => {
    cleanupBlob();
  });

  // ─────────────────────────────────────────────
  // FILE PICKER
  // ─────────────────────────────────────────────
  function openPicker() {
    input?.click();
  }

  function handleChange(e) {
    handleFile(e.target.files?.[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    dragging = false;
    handleFile(e.dataTransfer.files?.[0]);
  }

  function handleDragOver(e) {
    e.preventDefault();
    dragging = true;
  }

  function handleDragLeave() {
    dragging = false;
  }

  // ─────────────────────────────────────────────
  // UPLOAD FLOW
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

      backgroundImage = result.url;
      log("Uploaded:", result.url);

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
  // REMOVE
  // ─────────────────────────────────────────────
  async function removeImage(e) {
    e?.stopPropagation();

    try {
      if (backgroundImage) {
        await deleteImage(backgroundImage);
      }
    } catch (e) {
      err("Delete failed:", e);
    }

    cleanupBlob();
    backgroundImage = null;

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
<!-- EMPTY STATE -->
<!-- ───────────────────────────────────────────── -->
{#if !hasImage}
  <div
    class="group relative w-full rounded-[32px] border border-dashed border-slate-200 bg-white cursor-pointer overflow-hidden transition hover:border-slate-400 hover:shadow-sm"
    class:border-sky-400={dragging}
    class:bg-sky-50={dragging}
    on:click={openPicker}
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
  >
    <div class="py-24 text-center">
      <div class="w-24 h-24 rounded-full bg-slate-50 mx-auto flex items-center justify-center">
        <CloudUpload size={42} class="text-slate-400" />
      </div>

      <h3 class="mt-8 text-2xl font-semibold text-slate-900">
        Drop your image here
      </h3>

      <p class="mt-3 text-slate-500">
        or click to upload
      </p>
    </div>
  </div>

<!-- ───────────────────────────────────────────── -->
<!-- IMAGE STATE -->
<!-- ───────────────────────────────────────────── -->
{:else}
  <div
    class="group relative overflow-hidden rounded-[32px] cursor-pointer bg-black"
    on:click={openPicker}
  >
    <!-- IMAGE -->
    <img
      src={preview}
      alt="Uploaded image"
      class="w-full aspect-[16/9] object-cover transition duration-500 group-hover:scale-[1.04] group-hover:brightness-75"
    />

    <!-- cinematic ring -->
    <div class="absolute inset-0 ring-1 ring-white/0 group-hover:ring-white/15 transition rounded-[32px]" />

    <!-- gradient -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition" />

    <!-- ───────────────────────────────────────────── -->
    <!-- PREMIUM ACTION DOCK -->
    <!-- ───────────────────────────────────────────── -->
    <div class="absolute top-5 right-5 flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition duration-200">

      <div class="flex gap-2">

        <!-- REPLACE -->
        <button
          type="button"
          on:click|stopPropagation={openPicker}
          class="group/btn relative w-11 h-11 rounded-full bg-black/45 hover:bg-black/75 backdrop-blur-xl border border-white/10 shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <RefreshCw size={16} class="text-white/90" />

          <div class="absolute top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 transition text-[11px] text-white/80 bg-black/70 px-2 py-1 rounded-md backdrop-blur-md whitespace-nowrap">
            Replace
          </div>
        </button>

        <!-- DELETE -->
        <button
          type="button"
          on:click|stopPropagation={removeImage}
          class="group/btn relative w-11 h-11 rounded-full bg-black/45 hover:bg-red-500/80 backdrop-blur-xl border border-white/10 shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <X size={18} class="text-white/90" />

          <div class="absolute top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 transition text-[11px] text-white/80 bg-black/70 px-2 py-1 rounded-md backdrop-blur-md whitespace-nowrap">
            Remove
          </div>
        </button>

      </div>
    </div>

    <!-- UPLOADING OVERLAY -->
    {#if uploading}
      <div class="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm backdrop-blur-sm">
        Uploading...
      </div>
    {/if}
  </div>
{/if}
