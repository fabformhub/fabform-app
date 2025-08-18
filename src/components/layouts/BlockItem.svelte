<script>
  import { BlockIcon, DropdownButton } from '../../components/ui';

  let {
    block,                   // the block object
    isSelected = false,      // whether this block is currently selected
    selectBlock,             // callback to mark as selected
    deleteBlock,             // callback to delete
    duplicateBlock           // callback to duplicate
  } = $props();

  function handleSelect() {
    selectBlock?.(block.id);
  }
</script>

<div
  on:click={handleSelect}
  class={[
    "w-full sm:w-72 flex items-center justify-between gap-2 p-2 rounded-md transition-all h-16 group cursor-pointer",
    block.meta.bgColor ?? '',
    isSelected
      ? "border-2 shadow-lg scale-105"
      : "border border-gray-300 shadow-sm"
  ]}
>
  <!-- Icon + Text -->
  <div class="flex items-center gap-1 flex-1 text-sm text-gray-800">
    <div class="shrink-0">
      <BlockIcon blockId={block.meta.blockTypeId - 1} />
    </div>
    <span class="truncate mx-2 block">
      {block.meta.title || block.meta.question}
    </span>
  </div>

  <!-- Action Menu -->
  <div class="shrink-0 pointer-events-auto relative opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <DropdownButton
      dropdownItems={[
        { label: "Duplicate", icon: "Duplicate", onClick: () => duplicateBlock?.(block.id) },
        { label: "Delete", icon: "Delete", onClick: () => deleteBlock?.(block.id) }
      ]}
    />
  </div>
</div>
