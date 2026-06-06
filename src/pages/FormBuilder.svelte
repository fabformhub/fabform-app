<script>
  import { onMount, setContext } from "svelte";

  import { BlockLayout, BlockPicker } from "../components/form-builder";
  import { AddBlockButton } from "../components/ui";
  import { DefaultLayout, Sidebar } from "../components/layouts";
  import { Dialog } from "../components/dialogs";
  import { DesignEditor } from "../components/design-editor";
  import { PropertyEditor } from "../components/property-editor";
  import { debounce } from '../utils/debounce.js';
  import { createBlock, getBlocksByFormId,updateBlock, deleteBlockById, getForm } from "../services/formService.js";
  import { openDialog } from "../utils/dialog.svelte.js";

  let { route } = $props();

  let showBlockPicker = $state(false);
  let blocks = $state([]);
  let blockNo = $state(0);
  let uiMeta = $state();
  let formId = $state(route?.result?.path?.params?.id);
  let form = $state();
  let isLoaded = $state(false);
  let lastBlockSnapshot = "";
  let activeMenuLabel = $state("Build");

  function setActive(label) {
    activeMenuLabel = label;
  }

  async function saveToDatabase(block) {
    try {
      await updateBlock(block);
    } catch (error) {
      console.error("Failed to save block:", error);
    }
  }

  const debouncedSaveBlock = debounce(saveToDatabase, 2000);
  //const debouncedSaveUiMeta = debounce(saveUiMeta, 2000);

  // ✅ Effect to watch block changes and save
  $effect(() => {
    const block = blocks[blockNo];
    if (!isLoaded || !block) return;

    const blockSnapshot = JSON.stringify(block);
    if (blockSnapshot !== lastBlockSnapshot) {
      lastBlockSnapshot = blockSnapshot;
      debouncedSaveBlock(block);
    }
  });

  async function fetchData() {
    console.log("=== FETCH START ===");
    console.log("formId:", formId);
    console.log("route:", route);

    try {
      const formRes = await getForm(formId);
      console.log("FORM RESPONSE:", formRes);

      form = formRes?.data?.form;

      if (form) {
        uiMeta = form.meta ?? {};
      } else {
        console.warn("Form is NULL or undefined");
      }

      const blocksRes = await getBlocksByFormId(formId);
      console.log("BLOCKS RESPONSE:", blocksRes);

      blocks = blocksRes?.data?.blocks
        ?.slice()
        ?.sort((a, b) => a.meta.blockTypeId - b.meta.blockTypeId) ?? [];

      if (blocks.length === 0) blockNo = 0;
      else if (blockNo >= blocks.length) blockNo = blocks.length - 1;

      isLoaded = true;
      console.log("=== FETCH COMPLETE ===");

    } catch (err) {
      console.error("FETCH ERROR:", err);
      form = null;
    }
  }

  onMount(fetchData);

  function formChanged(updatedForm) {
    uiMeta = updatedForm.meta;
  }

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
    blocks[blockNo] = e.detail;
  };

  setContext("blockPickerClick", createBlockPick);
</script>

{#if form === null}
  <p class="text-red-500 p-4">Failed to load form.</p>

{:else if !isLoaded}
  <p class="text-gray-500 p-4">Loading form...</p>

{:else}
  <DefaultLayout {setActive} {form}>
    <main class="flex flex-col h-full mt-17">

      <BlockPicker show={showBlockPicker} close={() => (showBlockPicker = false)} />
      <Dialog />

      <div class="flex justify-center">
        <AddBlockButton largeIcon clickHandler={() => (showBlockPicker = true)} />
      </div>

      <div class="flex flex-1 overflow-hidden mt-2 min-h-[400px]">

        <div class="w-1/4 p-2 overflow-auto min-h-0">
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

        <div class="w-1/2 h-[400px] overflow-auto bg-white m-1 border border-dotted border-gray-400 rounded-xl shadow-sm flex items-center justify-center">
          {#if blocks[blockNo]}
            <BlockLayout
              uiMeta={uiMeta}
              canAnswer={false}
              bind:block={blocks[blockNo]}
              on:updateBlock={handleBlockUpdate}
            />
          {:else}
            <p class="text-gray-400">No blocks to display</p>
          {/if}
        </div>

        <div class="w-1/4 p-2 overflow-auto h-[400px] border-l border-gray-200">
          {#if activeMenuLabel === "Design" && form?.meta}
            <DesignEditor bind:form {formChanged} />
          {:else if blocks[blockNo]}
            <PropertyEditor bind:block={blocks[blockNo]} />
          {:else}
            <p class="text-gray-400">Loading...</p>
          {/if}
        </div>

      </div>
    </main>
  </DefaultLayout>
{/if}

