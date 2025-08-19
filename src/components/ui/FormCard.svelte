<script>
  import { goto } from '@mateothegreat/svelte5-router';
  import { DropdownButton } from '../../components/ui';

  const {
    form,
    responseCount = 0,
    onOpen,
    onCopy,
    onRename,
    onRenameFormLink,
    onDuplicate,
    onDelete,
    onQRCode
  } = $props();
</script>

<!-- Compact Black-Themed Card -->
<div
  class="relative rounded-2xl overflow-visible border border-neutral-300 bg-gradient-to-br from-neutral-100 via-white to-neutral-200 shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:rotate-[-0.5deg] hover:shadow-2xl max-w-[288px] backdrop-blur-md"
>

  <!-- Top Section -->
  <div
    on:click|stopPropagation={() => goto('/form/build/' + form.id)}
    class="p-4 cursor-pointer hover:bg-white/40 transition duration-200"
  >
    <h2 class="text-base font-bold text-black tracking-tight drop-shadow-sm">
      {form.name}
    </h2>
  </div>

  <!-- Decorative Divider -->
  <div class="h-[1px] bg-gradient-to-r from-transparent via-neutral-400 to-transparent animate-pulse"></div>

  <!-- Bottom Section -->
  <div class="relative flex items-center justify-between px-3 py-2 bg-white/30 text-sm text-black backdrop-blur-md rounded-b-2xl">

    <!-- Tiny Response Button -->
    <button
      on:click|stopPropagation={() => goto('/responses/' + form.id)}
      class="bg-black hover:bg-neutral-800 text-white text-xs px-2 py-[2px] rounded shadow-sm transition"
    >
      {responseCount} Response{responseCount === 1 ? '' : 's'}
    </button>

    <!-- Dropdown -->
    <div class="relative z-20">
      <DropdownButton
        dropdownItems={[
          { label: 'Open Form', icon: 'OpenForm', onClick: onOpen },
          { label: 'Copy Form Link', icon: 'CopyLink', onClick: onCopy },
          { label: 'Rename Form', icon: 'Rename', onClick: onRename },
          { label: 'Rename Link', icon: 'CopyLink', onClick: onRenameFormLink },
          { label: 'Duplicate', icon: 'Duplicate', onClick: onDuplicate },
          { label: 'Delete', icon: 'Delete', onClick: onDelete },
          { label: 'Create QR Code', icon: 'QRCode', onClick: onQRCode }
        ]}
      />
    </div>
  </div>
</div>
