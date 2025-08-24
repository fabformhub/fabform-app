<script>
  import { supabase } from '../lib/supabaseClient';
  import { CloudUpload, Trash2, FileText } from 'lucide-svelte';
  import { authService } from '../services/authService.svelte.js';

  let { canAnswer = false } = $props();
  let fileInput;
  let uploadedFiles = [];
  let currentUserId = '';

  // Progress bar state
  let progress = 0;
  let uploading = false;

  authService.getUser().then(async (user) => {
    if (user) {
      currentUserId = user.id;
      await listUserFiles();
    }
  });

  async function listUserFiles() {
    if (!currentUserId) return;
    const { data, error } = await supabase.storage
      .from('user-files')
      .list(`users/${currentUserId}/`, { limit: 100 });

    if (!error) {
      uploadedFiles = await Promise.all(
        data.map(async (file) => {
          const { data: urlData } = supabase.storage
            .from('user-files')
            .getPublicUrl(`users/${currentUserId}/${file.name}`);
          return {
            ...file,
            publicUrl: urlData.publicUrl,
            sizeKB: file.metadata?.size ? (file.metadata.size / 1024).toFixed(1) : '0.0',
          };
        })
      );
    } else {
      alert('Could not list files: ' + error.message);
    }
  }

  function triggerFileInput() {
    if (canAnswer) fileInput.click();
  }

  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) await handleFileUpload(file);
  }

  // Simulated progress uploader
  async function handleFileUpload(file) {
    if (!canAnswer || !currentUserId) return;

    progress = 0;
    uploading = true;

    // Start simulated progress
    const fileSize = file.size;
    // Adjust speed: bigger files progress slower
    const increment = 2 + (1000000 / fileSize);
    const interval = 100;

    const timer = setInterval(() => {
      if (progress < 90) {
        progress = Math.min(progress + increment, 90);
      }
    }, interval);

    const path = `users/${currentUserId}/${file.name}`;
    const { error } = await supabase.storage.from('user-files').upload(path, file, {
      upsert: true
    });

    clearInterval(timer);

    if (error) {
      uploading = false;
      progress = 0;
      alert(`Upload failed: ${error.message}`);
      return;
    }

    // Upload complete: show 100% and then hide progress bar shortly after
    progress = 100;
    await listUserFiles();

    setTimeout(() => {
      uploading = false;
      progress = 0;
    }, 700);
  }

  async function deleteFile(fileName) {
    const path = `users/${currentUserId}/${fileName}`;
    const { error } = await supabase.storage.from('user-files').remove([path]);

    if (error) {
      alert(`Delete failed: ${error.message}`);
    } else {
      await listUserFiles();
    }
  }
</script>

<!-- Upload Box -->
<div class="w-full flex justify-center mt-10">
  <div
    class="relative border-4 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center transition-all text-center bg-white shadow-xl max-w-md w-full hover:shadow-2xl"
    on:drop|preventDefault={(e) => handleFileUpload(e.dataTransfer.files[0])}
    on:dragover|preventDefault
  >
    <CloudUpload class="w-16 h-16 text-blue-500 mb-4" />
    <p class="text-gray-500">
      {canAnswer ? 'Click or drag and drop to upload a file' : ''}
    </p>

    {#if canAnswer}
      <button on:click={triggerFileInput} class="mt-3 text-blue-600 hover:text-blue-800 font-medium">
        <CloudUpload class="inline w-5 h-5 mr-1" /> Upload File
      </button>
    {/if}

    <input
      type="file"
      class="hidden"
      bind:this={fileInput}
      on:change={handleFileChange}
      disabled={!canAnswer}
    />

    {#if uploading}
      <div class="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden">
        <div
          class="bg-blue-500 h-3 rounded-full transition-all duration-300 ease-in-out"
          style="width: {progress}%;"
        ></div>
      </div>
      <p class="text-blue-600 mt-1 font-semibold">{Math.floor(progress)}%</p>
    {/if}
  </div>
</div>

<!-- Files Grid, only show if canAnswer -->
{#if canAnswer}
  <div class="flex-grow overflow-auto max-w-6xl mx-auto mt-12 px-4 py-3">
    <div class="flex flex-wrap gap-4 justify-center">
      {#each uploadedFiles as file}
        <div
          class="flex flex-col items-center w-32 p-3 rounded-2xl bg-white shadow-sm hover:shadow-md border border-gray-300 relative"
          title={file.name}
        >
          {#if file.name.match(/\.(jpg|jpeg|png|gif)$/i)}
            <img
              src={file.publicUrl}
              alt="preview"
              class="w-24 h-24 rounded-xl object-cover shadow-sm mb-2"
            />
          {:else}
            <div
              class="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-xl shadow-inner mb-2"
            >
              <FileText class="w-10 h-10 text-gray-400" />
            </div>
          {/if}

          <span class="text-sm text-gray-900 font-medium truncate w-full text-center">
            {file.name}
          </span>
          <span class="text-xs text-gray-500">{file.sizeKB} KB</span>

          <button
            on:click={() => deleteFile(file.name)}
            class="absolute top-2 right-2 text-red-600 hover:text-red-800 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label={`Delete file ${file.name}`}
            title="Delete file"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      {/each}
    </div>
  </div>
{/if}
