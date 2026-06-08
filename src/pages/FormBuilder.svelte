<script>
  import { onMount, setContext } from "svelte";

  import { BlockLayout, BlockPicker } from "../components/form-builder";
  import { AddBlockButton } from "../components/ui";
  import { DefaultLayout, Sidebar } from "../components/layouts";
  import { Dialog } from "../components/dialogs";
  import { DesignEditor } from "../components/design-editor";
  import { PropertyEditor } from "../components/property-editor";
  import { debounce } from "../utils/debounce.js";
  import {
    createBlock,
    getBlocksByFormId,
    updateBlock,
    deleteBlockById,
    getForm
  } from "../services/formService.js";
  import { openDialog } from "../utils/dialog.svelte.js";
  import { PenTool } from "lucide-svelte";

  let { route } = $props();

  let showBlockPicker = $state(false);
  let blocks = $state([]);
  let blockNo = $state(0);
  let formId = $state(route?.result?.path?.params?.id);
  let form = $state();
  let isLoaded = $state(false);
  let activeMenuLabel = $state("Build");
  let designEditorOpen = $state(false);

  const blockSnapshots = {};

  function setActive(label) {
    activeMenuLabel = label;
  }

  function toggleEditor() {
    designEditorOpen = !designEditorOpen;
  }

  async function saveToDatabase(block) {
    try {
      await updateBlock(block);
    } catch (error) {
      console.error("Failed to save block:", error);
    }
  }

  const debouncedSaveBlock = debounce(saveToDatabase, 2000);

  $effect(() => {
    const block = blocks[blockNo];
    if (!isLoaded || !block?.id) return;

    const snapshot = JSON.stringify(block);

    if (blockSnapshots[block.id] !== snapshot) {
      blockSnapshots[block.id] = snapshot;
      debouncedSaveBlock(block);
    }
  });

  async function fetchData() {
    try {
      const formRes = await getForm(formId);
      form = formRes?.data?.form;

      const blocksRes = await getBlocksByFormId(formId);

      blocks =
        blocksRes?.data?.blocks
          ?.slice()
          ?.sort((a, b) => a.meta.blockTypeId - b.meta.blockTypeId) ?? [];

      if (blocks.length === 0) blockNo = 0;
      else if (blockNo >= blocks.length) blockNo = blocks.length - 1;

      isLoaded = true;
    } catch (err) {
      console.error("FETCH ERROR:", err);
      form = null;
    }
  }

  onMount(fetchData);

  async function createBlockPick(block) {
    await createBlock(formId, block);
    await fetchData();
  }

  async function deleteBlock(blockId) {
    const confirmed = await openDialog(
      "Delete Confirmation",
      "Are you sure you want to delete this block?",
      "Cancel",
      "Yes! Delete it"
    );

    if (confirmed) {
      await deleteBlockById(blockId);
      await fetchData();
    }
  }

  const changeBlock = (i) => {
    blockNo = i;
  };

  const handleBlockUpdate = (e) => {
    blocks = blocks.map((b, i) =>
      i === blockNo ? e.detail : b
    );
  };

  setContext("blockPickerClick", createBlockPick);
</script>

{#if form === null}
  <p class="text-red-500 p-4">Failed to load form.</p>

{:else if !isLoaded}
  <p class="text-gray-500 p-4">Loading form...</p>

{:else}
  <DefaultLayout {setActive} {form}>
    <!-- FULL HEIGHT ROOT -->
    <main class="flex flex-col h-screen mt-17">

      <DesignEditor bind:form bind:open={designEditorOpen} />
      <BlockPicker show={showBlockPicker} close={() => (showBlockPicker = false)} />
      <Dialog />

      <!-- TOP ACTION BAR -->
      <div class="flex justify-center gap-2 py-2">
        <AddBlockButton largeIcon clickHandler={() => (showBlockPicker = true)} />

        <button
          class="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
          onclick={() => (designEditorOpen = !designEditorOpen)}
        >
          <PenTool class="w-4 h-4 text-gray-600" />
          <span class="text-sm font-medium">Design</span>
        </button>
      </div>

      <!-- BUILDER GRID -->
      <div class="flex flex-1 overflow-hidden items-stretch">

        <!-- LEFT SIDEBAR -->
        <div class="w-1/4 p-2 overflow-auto border-r border-gray-200">
          <div class="flex justify-end mb-2">
            <AddBlockButton clickHandler={() => (showBlockPicker = true)} />
          </div>

          <Sidebar
            bind:blockNo={blockNo}
            bind:blocks={blocks}
            {changeBlock}
            {deleteBlock}
          />
        </div>

        <!-- CENTER CANVAS -->
        <div class="w-1/2 overflow-auto bg-white m-1 border border-dotted border-gray-400 rounded-xl shadow-sm flex items-center justify-center">
          {#if blocks[blockNo]}
            <BlockLayout
              form={form}
              canAnswer={false}
              bind:block={blocks[blockNo]}
              on:updateBlock={handleBlockUpdate}
            />
          {:else}
            <p class="text-gray-400">No blocks to display</p>
          {/if}
        </div>

        <!-- RIGHT PROPERTY PANEL (FIXED) -->
        <div class="w-1/4 p-2 overflow-auto border-l border-gray-200 flex flex-col">
          {#if blocks[blockNo]}
            <div class="flex-1 overflow-auto">
              <PropertyEditor bind:block={blocks[blockNo]} />
            </div>
          {:else}
            <p class="text-gray-400">Loading...</p>
          {/if}
        </div>

      </div>
    </main>
  </DefaultLayout>
{/if}
