<script>
  import { onMount } from 'svelte';
  import { MoreVertical as Dots, Copy, Trash, SquarePen, Link, ExternalLink, QrCode } from 'lucide-svelte';

  export let dropdownItems = [];

  let isDropdownOpen = false;
  let buttonEl;
  let dropdownStyles = "";
  const dropdownWidth = 192; // w-48

  const icons = {
    Duplicate: Copy,
    Delete: Trash,
    Rename: SquarePen,
    RenameLink: SquarePen,
    OpenForm: ExternalLink,
    CopyLink: Link,
    QRCode: QrCode
  };

  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;

    if (isDropdownOpen && buttonEl) {
      const rect = buttonEl.getBoundingClientRect();

      // position relative to button
      let left = 0;
      let top = rect.height + 4; // 4px gap below button

      dropdownStyles = `top:${top}px; left:${left}px;`;
    }
  }

  function handleClickOutside(event) {
    if (buttonEl && !buttonEl.contains(event.target)) {
      isDropdownOpen = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });
</script>

<!-- Trigger -->
<div class="relative inline-block" bind:this={buttonEl}>
  <button
    on:click={toggleDropdown}
    class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
    aria-label="More options"
  >
    <Dots class="w-4 h-4 text-gray-500 hover:text-black cursor-pointer" />
  </button>

  <!-- Dropdown -->
  {#if isDropdownOpen}
    <div
      class="absolute w-48 bg-white rounded-md shadow-lg z-50"
      style={dropdownStyles}
    >
      {#each dropdownItems as { icon, label, onClick }}
        <button
          class="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          on:click={async () => {
            await onClick?.();
            isDropdownOpen = false;
          }}
        >
          {#if icons[icon]}
            {@const Icon = icons[icon]}
            <Icon class="w-4 h-4 text-gray-500" />
          {/if}
          {label}
        </button>
      {/each}
    </div>
  {/if}
</div>
