<script>
  import { onMount, setContext } from "svelte";

  import { BlockLayout, BlockPicker } from "../components/form-builder";
  import { AddBlockButton } from "../components/ui";
  import { DefaultLayout, Sidebar } from "../components/layouts";
  import { Dialog } from "../components/dialogs";
  import { DesignEditor } from "../components/design-editor";
  import { PropertyEditor } from "../components/property-editor";
  import { debounce } from "../utils/debounce.js";

  import { createBlock, getBlocksByFormId, updateBlock, deleteBlockById, getForm, updateForm } from "$lib/services/formService.js";

  let { route } = $props();

  // STATE
  let showBlockPicker = $state(false);
  let blocks = $state([]);
  let blockNo = $state(0);
  let formId = $state(route?.result?.path?.params?.id);
  let form = $state({});


let isLoaded = $state(false);

const autoSaveForm = debounce(() => {
  console.log("Form autosaved");
  updateForm(form);
}, 5000);

const autoSaveBlock = debounce(() => {
  console.log("Block autosaved");
  updateBlock(blocks[blockNo]);
}, 5000);

$effect(() => {
const dummy = JSON.stringify(form,null,2)

  if (form) autoSaveForm();
});

$effect(() => {
const dummy = JSON.stringify(blocks[blockNo],null,2)
  if (blocks[blockNo]) autoSaveBlock();
});

  // -----------------------------
  // FETCH DATA
  // -----------------------------

  async function fetchData() {
    try {
      const formRes = await getForm(formId);
      form = formRes?.data?.form;

      const blocksRes = await getBlocksByFormId(formId);

      blocks =
        blocksRes?.data?.blocks
          ?.slice()
          ?.sort((a, b) => a.meta.blockTypeId - b.meta.blockTypeId) ?? [];

      blockNo = Math.max(0, blocks.length - 2);
      isLoaded = true;
    } catch (err) {
      console.error("FETCH ERROR:", err);
      form = null;
    }
  }

  onMount(fetchData);

  // -----------------------------
  // BLOCK ACTIONS
  // -----------------------------

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
      i === blockNo ? { ...b, ...e.detail } : b
    );
  };

  setContext("blockPickerClick", createBlockPick);
</script>


{#if form }
  <DefaultLayout {form}>

    <main class="flex flex-col h-screen mt-17">

      <div class="flex justify-center">
        <AddBlockButton largeIcon clickHandler={() => showBlockPicker = true} />
      </div>

      <DesignEditor bind:form />

      <BlockPicker
        show={showBlockPicker}
        close={() => (showBlockPicker = false)}
      />

      <Dialog />

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

        <!-- CENTER -->
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

        <!-- RIGHT -->
        <div class="w-1/4 p-2 overflow-auto border-l border-gray-200 flex flex-col">

          {#if blocks[blockNo]}
            <div class="flex-1 overflow-auto">
              <PropertyEditor bind:block={blocks[blockNo]} />
            </div>
          {/if}

        </div>

      </div>
    </main>

  </DefaultLayout>
{/if}
