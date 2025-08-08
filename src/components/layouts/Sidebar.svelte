<script>
  import { flip } from 'svelte/animate';
  import { dndzone } from 'svelte-dnd-action';
  import { BlockIcon, DropdownButton } from '../../components/ui';

  // Props with $props(), including blockNo controlled by parent
  let {
    blocks = $bindable(),
    blockNo = $bindable(null),
    changeBlock,
    deleteBlock,
    duplicateBlock,
    updateBlockPositions
  } = $props();

  const flipDurationMs = 300;

  function handleDndConsider(e) {
    blocks = e.detail.items;
  }

  function handleDndFinalize(e) {
    blocks = e.detail.items.map((block, index) => ({
      ...block,
      position: index + 1,
    }));
    updateBlockPositions();
  }

  function selectItem(id, i) {
    blockNo = i;
    changeBlock(i);
  }
</script>

<section
  use:dndzone={{ items: blocks, flipDurationMs }}
  on:consider={handleDndConsider}
  on:finalize={handleDndFinalize}
  class="p-2 space-y-1 min-h-[100px] pb-20 overflow-hidden"
>
  {#each blocks as block, i (block.id)}
    <div
      on:click={() => selectItem(block.id, i)}
      animate:flip={{ duration: flipDurationMs }}
      class={[
        "block-draggable w-full sm:w-72 flex items-center justify-between gap-2 p-2 rounded-md transition-all h-16 group",
        block.meta.bgColor ?? '',
        blockNo === i
          ? 'border-2 shadow-lg scale-105'
          : 'border border-gray-300 shadow-sm'
      ]}
    >
      <!-- Icon and Truncating Text -->
      <div class="flex items-center gap-1 flex-1 text-sm text-gray-800">
        <div class="shrink-0">
          <BlockIcon blockId={+block.meta.blockTypeId - 1} />
        </div>
        <span class="truncate mx-2 block">{block.meta.title || block.meta.question}</span>
      </div>

      <!-- Action Buttons -->
      <div class="shrink-0 pointer-events-auto relative opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <DropdownButton
          dropdownItems={[
            { label: "Duplicate", icon: "Duplicate", onClick: () => duplicateBlock(block.id) },
            { label: "Delete", icon: "Delete", onClick: () => deleteBlock(block.id) }
          ]}
        />
      </div>
    </div>
  {/each}
</section>