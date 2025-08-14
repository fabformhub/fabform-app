<script>
  import { Copy, Trash, SquarePen, Link, ExternalLink, MoreVertical as Dots } from 'lucide-svelte';

  export let dropdownItems = [];

  let isDropdownOpen = false;

  const handleDropdownClick = () => {
    isDropdownOpen = !isDropdownOpen;
  };

  const icons = {
    Duplicate: Copy,
    Delete: Trash,
    Rename: SquarePen,
    RenameLink: SquarePen,
    OpenForm: ExternalLink,
    CopyLink: Link,
  };

  let hoverTimeout;

  function handleMouseLeave() {
    hoverTimeout = setTimeout(() => {
      isDropdownOpen = false;
    }, 200);
  }

  function handleMouseEnter() {
    clearTimeout(hoverTimeout);
  }
</script>

<div class="relative inline-block text-left overflow-visible" on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
  <button
    on:click={handleDropdownClick}
    class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
    aria-label="More options"
  >
    <Dots class="w-4 h-4 text-gray-500 hover:text-black cursor-pointer" />
  </button>

  {#if isDropdownOpen}
    <div class="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-[9999] overflow-visible">
      {#each dropdownItems as { icon, label, onClick }}
        <button
          class="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          on:click={async () => {
            await onClick();
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
