<script>
  import { goto } from '@mateothegreat/svelte5-router';
  import { Eye } from 'lucide-svelte';
  import DropdownButton from './DropdownButton.svelte';

  export let form;
  export let responseCount = 0;
  export let formViewCount = 0;

  export let onOpen;
  export let onCopy;
  export let onRenameForm;
  export let onRenameFormSlug;
  export let onDuplicate;
  export let onDelete;
  export let onQRCode;
</script>

<div class="relative rounded-2xl overflow-visible border border-neutral-300 bg-gradient-to-br from-neutral-100 via-white to-neutral-200 shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl max-w-[288px]">

  <!-- Top Section -->
  <div
    on:click={() => goto('/form/build/' + form.id)}
    class="p-4 cursor-pointer hover:bg-white/40 transition duration-200"
  >
    <h2 class="text-base font-bold text-black tracking-tight drop-shadow-sm">{form.name}</h2>
  </div>

  <div class="h-[1px] bg-gradient-to-r from-transparent via-neutral-400 to-transparent animate-pulse"></div>

  <!-- Bottom Section -->
  <div class="relative flex items-center justify-between px-3 py-2 bg-white/30 text-sm text-black backdrop-blur-md rounded-b-2xl">
    <!-- Responses Button -->
    <button
      on:click={() => goto('/responses/' + form.id)}
      class="bg-black hover:bg-neutral-800 text-white text-xs px-2 py-[2px] rounded shadow-sm transition"
    >
      {responseCount} Response{responseCount === 1 ? '' : 's'}
    </button>

    <!-- Views -->
    <div class="flex items-center gap-1">
      <Eye class="w-4 h-4" />
      <span>{formViewCount ?? 0}</span>
    </div>
  </div>

  <!-- Dropdown Button outside of blur/styling context -->
  <div class="absolute top-2 right-2">
    <DropdownButton
      dropdownItems={[
        { label: 'Open Form', icon: 'OpenForm', onClick: onOpen },
        { label: 'Copy Form Link', icon: 'CopyLink', onClick: onCopy },
        { label: 'Rename Form', icon: 'Rename', onClick: onRenameForm },
        { label: 'Customize Form Link', icon: 'RenameLink', onClick: onRenameFormSlug },
        { label: 'Duplicate', icon: 'Duplicate', onClick: onDuplicate },
        { label: 'Delete Form', icon: 'Delete', onClick: onDelete },
        { label: 'Create QR Code', icon: 'QRCode', onClick: onQRCode }
      ]}
    />
  </div>
</div>
