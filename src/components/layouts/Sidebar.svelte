<script>
  import { BlockIcon, DropdownButton } from '../../components/ui';

  let {
    blocks = $bindable(),
    blockNo = $bindable(null),
    changeBlock,
    deleteBlock,
    duplicateBlock
  } = $props();

  function selectItem(id, i) {
    blockNo = i;
    changeBlock(i);
  }

  let genericLabelShown = false;
</script>

<section class="p-2 space-y-1 min-h-[100px] pb-20 overflow-hidden">
  {#each blocks as block, i (block.id)}
    {#if block.meta.blockTypeId === 1}
      <p class="text-gray-500 font-semibold mt-2 mb-1">Welcome Screen</p>
    {:else if block.meta.blockTypeId === 99}
      <p class="text-gray-500 font-semibold mt-2 mb-1">Thank You Screen</p>
    {:else if !genericLabelShown}
      <p class="text-gray-500 font-semibold mt-2 mb-1">Blocks</p>
      {@html (() => { genericLabelShown = true; return '' })()}
    {/if}

    <div
      on:click={() => selectItem(block.id, i)}
      class={[
        "block-draggable w-full sm:w-72 flex items-center justify-between gap-2 p-2 rounded-md transition-all h-16 group",
        block.meta.bgColor ?? '',
        blockNo === i
          ? 'border-2 shadow-lg scale-105'
          : 'border border-gray-300 shadow-sm my-2'
      ]}
    >
      <div class="flex items-center gap-1 flex-1 text-sm text-gray-800">
        <div class="shrink-0">
          <BlockIcon blockId={+block.meta.blockTypeId - 1} />
        </div>
        <span class="truncate mx-2 block">{block.meta.title || block.meta.question}</span>
      </div>

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
