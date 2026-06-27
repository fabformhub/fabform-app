<script>
  import { onMount, onDestroy } from 'svelte';
  import {
    MoreVertical as Dots,
    Copy,
    Trash,
    SquarePen,
    Link,
    ExternalLink,
    QrCode
  } from 'lucide-svelte';

import { clickOutside } from '../../utils/clickOutside';

  export let dropdownItems = [];

  let isOpen = false;
  let buttonEl;
  let dropdownEl;

  const WIDTH = 192;
  let coords = { top: 0, left: 0 };

  const icons = {
    Duplicate: Copy,
    Delete: Trash,
    Rename: SquarePen,
    RenameLink: SquarePen,
    OpenForm: ExternalLink,
    CopyLink: Link,
    QRCode: QrCode
  };

  function updatePosition() {
    if (!buttonEl) return;

    const rect = buttonEl.getBoundingClientRect();

    coords = {
      top: rect.bottom + 6,
      left: Math.min(rect.left, window.innerWidth - WIDTH - 8)
    };
  }

  function open() {
    isOpen = true;

    requestAnimationFrame(() => {
      updatePosition();

      // PORTAL: move to body AFTER render
      if (dropdownEl && dropdownEl.parentNode !== document.body) {
        document.body.appendChild(dropdownEl);
      }
    });
  }

  function close() {
    isOpen = false;
  }

  function toggle() {
    isOpen ? close() : open();
  }

  function handleScrollOrResize() {
    if (isOpen) updatePosition();
  }

  onMount(() => {
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
  });

  onDestroy(() => {
    dropdownEl?.remove();
  });
</script>

<!-- Trigger -->
<div class="relative inline-block" bind:this={buttonEl}>
  <button
    on:click={toggle}
    class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
  >
    <Dots class="w-4 h-4 text-gray-500 hover:text-black" />
  </button>
</div>

<!-- DROPDOWN (PORTAL) -->
{#if isOpen}
  <div
    bind:this={dropdownEl}
    use:clickOutside={() => close()}
    class="fixed w-48 bg-white rounded-md shadow-lg z-[999999] border border-gray-100 py-1"
    style="top: {coords.top}px; left: {coords.left}px;"
  >
    {#each dropdownItems as { icon, label, onClick }}
      <button
        class="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        on:click={() => {
          close();        // IMPORTANT: close first
          onClick?.();    // then run action
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
