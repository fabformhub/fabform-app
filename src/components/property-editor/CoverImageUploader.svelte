<script>
  export let blockId;
  export let coverImage = '';
  import { supabase } from '../../lib/supabaseClient';
  import { Trash2 } from 'lucide-svelte';

  let uploading = false;
  let errorMessage = '';
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

  function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('border-blue-500', 'border-4');
  }

  function handleDragLeave(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('border-blue-500', 'border-4');
  }

  async function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('border-blue-500', 'border-4');

    const file = event.dataTransfer.files?.[0];
    if (file) await handleFileUpload(file);
  }

  async function handleFileInput(event) {
    const file = event.target.files?.[0];
    if (file) await handleFileUpload(file);
  }

  async function handleFileUpload(file) {
    errorMessage = '';

    if (!allowedTypes.includes(file.type)) {
      errorMessage = 'Only JPG, PNG, and GIF files are allowed.';
      return;
    }

    if (!blockId) {
      errorMessage = 'Missing block ID.';
      return;
    }

    uploading = true;

    // Delete previous file
    if (coverImage) {
      try {
        const oldPath = coverImage.split('/block-images/')[1]?.split('?')[0];
        console.log('Trying to delete (upload step):', oldPath);
        await supabase.storage.from('block-images').remove([oldPath]);
      } catch (err) {
        console.warn('Failed to delete previous image:', err);
      }
    }

    const ext = file.name.split('.').pop();
    const filePath = `coverImages/${blockId}.${ext}`;

    const { error: uploadError } = await supabase
      .storage
      .from('block-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
      errorMessage = 'Upload failed: ' + uploadError.message;
      uploading = false;
      return;
    }

    const { data } = supabase.storage.from('block-images').getPublicUrl(filePath);
    coverImage = `${data.publicUrl}?t=${Date.now()}`; // force cache busting
    uploading = false;
  }

  async function handleDelete() {
    if (!coverImage) return;

    const oldPath = coverImage.split('/block-images/')[1]?.split('?')[0];
    console.log('Trying to delete (manual):', oldPath);
    const { error: deleteError } = await supabase.storage.from('block-images').remove([oldPath]);

    if (deleteError) {
      errorMessage = 'Failed to delete image: ' + deleteError.message;
      return;
    }

    coverImage = '';
  }
</script>

<div
  class="relative w-full h-64 border-4 border-dashed border-gray-300 rounded-lg flex justify-center items-center cursor-pointer"
  on:dragover={handleDragOver}
  on:dragleave={handleDragLeave}
  on:drop={handleDrop}
  on:click={() => document.getElementById('fileInput')?.click()}
>
  {#if uploading}
    <div class="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <p class="text-white text-xl">Uploading...</p>
    </div>
  {:else if coverImage}
    <div class="w-full h-full flex justify-center items-center relative">
      <img src={coverImage} alt="Uploaded image" class="w-full h-full object-cover rounded-lg" />
      <button
        class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
        on:click|stopPropagation={handleDelete}
        aria-label="Delete image"
      >
        <Trash2 class="w-5 h-5" />
      </button>
    </div>
  {:else}
    <span class="text-gray-500">Drag & Drop an image here or click to select</span>
  {/if}

  <input
    id="fileInput"
    type="file"
    accept=".jpg,.jpeg,.png,.gif"
    class="hidden"
    on:change={handleFileInput}
  />
</div>

{#if errorMessage}
  <p class="text-red-500 mt-2">{errorMessage}</p>
{/if}
