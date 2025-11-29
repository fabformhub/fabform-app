<script>
  import { flip } from 'svelte/animate';
  import { dndzone } from 'svelte-dnd-action';
  import { DropdownButton } from '../../components/ui';

  // Svelte 5: bindable props so reassignments to blocks/blockNo propagate correctly
  let {
    blocks = $bindable([]),
    blockNo = $bindable(null),
    changeBlock,
    deleteBlock,
    duplicateBlock,
    updateBlockPositions
  } = $props();

  const flipDurationMs = 300;

  function selectItem(id, i) {
    blockNo = i;
    changeBlock(i);
  }

  // svelte-dnd-action handlers
  function handleDndConsider(e) {
    // Optimistic update while dragging
    blocks = e.detail.items;
  }

  function handleDndFinalize(e) {
    // Final order; assign positions and persist
    const updated = e.detail.items.map((block, index) => ({
      ...block,
      position: index + 1
    }));
    blocks = updated;
    updateBlockPositions?.(updated);
  }

  const normalBlocksExist = blocks.some(
    (b) => b.meta.blockTypeId !== 1 && b.meta.blockTypeId !== 99
  );
</script>

<section
  use:dndzone={{ items: blocks, flipDurationMs }}
  on:consider={handleDndConsider}
  on:finalize={handleDndFinalize}
  class="p-2 space-y-1 min-h-[100px] pb-20 overflow-hidden"
>
  {#each blocks as block, i (block.id)}
    <!-- Single keyed child per iteration, required for animate:flip -->
    <div animate:flip={{ duration: flipDurationMs }}>
      {#if block.meta.blockTypeId === 1}
        <p class="text-gray-500 font-semibold mt-2 mb-1">Welcome Screen</p>
      {:else if block.meta.blockTypeId === 99}
        <p class="text-gray-500 font-semibold mt-2 mb-1">Thank You Screen</p>
      {:else if i === 0 && normalBlocksExist}
        <p class="text-gray-500 font-semibold mt-2 mb-1">Blocks</p>
      {/if}

      <div
        on:click={() => selectItem(block.id, i)}
        class={`block-draggable w-full sm:w-72 flex items-center justify-between gap-2 p-2 rounded-md transition-all h-16 group
                ${block.meta.bgColor ?? ''}
                ${blockNo === i ? 'border-2 shadow-lg scale-105' : 'border border-gray-300 shadow-sm my-2'}`}
      >
        <div class="flex items-center gap-1 flex-1 text-sm text-gray-800">
          <div class="shrink-0">
            {#if block.meta.icon}
              <svelte:component this={block.meta.icon} class="w-5 h-5 text-blue-600" />
            {/if}
          </div>
          <span class="truncate mx-2 block">{block.meta.title || block.meta.question}</span>
        </div>

        <div class="shrink-0 pointer-events-auto relative opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <DropdownButton
            dropdownItems={[
              { label: 'Duplicate', icon: 'Duplicate', onClick: () => duplicateBlock(block.id) },
              { label: 'Delete', icon: 'Delete', onClick: () => deleteBlock(block.id) }
            ]}
          />
        </div>
      </div>
    </div>
  {/each}
</section>

<style>
  /* Drag feedback from svelte-dnd-action (applied to direct children) */
  .block-draggable.svelte-dnd-dragged {
    opacity: 0.6;
    transform: scale(1.03);
  }
  .block-draggable.svelte-dnd-placeholder {
    border: 2px dashed #3b82f6;
    background-color: #f0f9ff;
  }
</style>
