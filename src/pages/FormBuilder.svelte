  <script>
  import { FormView } from '../components/form-builder';
  import { createBlock, getBlocksByFormId, updateBlock, deleteBlockById } from '../services/blockService';
  import { getFormById, updateForm } from "../services/formService.js";
  import { AddBlockButton } from '../components/ui';
  import { BlockPicker } from '../components/form-builder';
  import { Sidebar } from '../components/layouts';
  
  import { Dialog } from '../components/dialogs';
  import { DefaultLayout } from '../components/layouts';
  import { openDialog } from '../utils/dialog.svelte.js';
  import { debounce } from '../utils/debounce.js';
  import { blockTemplates } from '../templates/blockTemplates';
  import { DesignEditor } from '../components/design-editor';
  import { PropertyEditor } from '../components/property-editor';
  import { onMount, setContext } from 'svelte';
  setContext('blockPickerClick', createBlockPick);

  let { route } = $props();
  let showBlockPicker = $state(false);
  let showDesignPanel = $state(true);

  let blocks            = $state([]);
  let blocksThankYou    = $state([]);
  let block = $state();

  let blockNo = $state(0);

  let uiMeta = $state({});
  let formId = $state(route.result.path.params.id);
  let activeMenuLabel = $state("Build");
  let lastBlockSnapshot = "";
  let lastUiMetaSnapshot = "";

  let isLoaded = $state(false); 
  let form 
  async function fetchData() {
    try {
      
      const formRes = await getFormById(formId);
      form = formRes.data.form;
      uiMeta = form.meta;

      const res = await getBlocksByFormId(formId);
      
     
      blocks = res.data.blocks.slice().sort(
  (a, b) => a.meta.blockTypeId - b.meta.blockTypeId
);

      isLoaded = true;
    } catch (error) {
      console.error("Error fetching form or blocks:", error);
    }
    
  }

  onMount(fetchData);

  function changeColorOnForm(form) {
    uiMeta = form.meta;
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

  // ✅ Fixed: Effect to watch uiMeta changes and save
  // $effect(() => {
  //  // if (!isLoaded || !uiMeta) return;

  //   const uiMetaSnapshot = JSON.stringify(uiMeta);
  //   if (uiMetaSnapshot !== lastUiMetaSnapshot) {
  //     lastUiMetaSnapshot = uiMetaSnapshot; 
  //     alert("saving "+ formId)
  //     debouncedSaveUiMeta(uiMeta);
  //   }
  // });

  // ✅ Effect to check route and toggle panels
  $effect(() => {
    const path = route.result.path.original;
    const segments = path.split('/').filter(Boolean);
    showDesignPanel = segments[segments.length - 2] === 'design';
    activeMenuLabel = showDesignPanel ? "Design" : "Build";
  });

  async function createBlockPick(i) {
    await createBlock(formId, blockTemplates[i]);
    await fetchData();
    blockNo = blockNo + 1;
  }

  async function updateBlockPositions() {
    try {
      await Promise.all(blocks.map(block => updateBlock(block)));
    } catch (err) {
      console.error("Failed to update block positions:", err);
    }
  }

  async function deleteBlock(blockId) {
    const confirmed = await openDialog(
      "Delete Confirmation",
      "Are you sure you want to delete this block?",
      "Cancel",
      "Yes! Delete it"
    );
    if (confirmed) {
      const { error } = await deleteBlockById(blockId);
      if (error) {
        console.error('Failed to delete block:', error.message);
      } else {
        await fetchData();
        blockNo = Math.min(blockNo, Math.max(0, blocks.length - 1));
      }
    }
  }

  const changeBlock = (i) => {
    blockNo = i;
  };

  const handleBlockUpdate = (e) => {
    blocks[blockNo] = e.detail;
  };

  </script>

<DefaultLayout bind:formId={formId} {activeMenuLabel}>
  

  <main class="flex flex-col h-full mt-17">
    <BlockPicker show={showBlockPicker} close={() => showBlockPicker = false} />
    <Dialog />

    <div class="flex justify-center">
      <AddBlockButton largeIcon clickHandler={() => showBlockPicker = true} />
    </div>

    <div class="flex flex-1 overflow-hidden mt-2 min-h-[400px]">
      <div class="w-1/4 p-2 overflow-auto min-h-0">
        <div class="flex justify-end mb-2">
          <AddBlockButton clickHandler={() => showBlockPicker = true} />
        </div>


        <Sidebar
          bind:blockNo={blockNo}
          bind:blocks={blocks}
          {changeBlock}
          {deleteBlock}
          {updateBlockPositions}
        />
      </div>

      <div class="w-1/2 h-[400px] overflow-auto bg-white m-1 border border-dotted border-gray-400 rounded-xl shadow-sm flex items-center justify-center">
        {#if blocks[blockNo]}
          <FormView  bind:block={blocks[blockNo]} on:updateBlock={handleBlockUpdate} />
        {:else}
          <p class="text-gray-400">No blocks to display</p>
        {/if}
      </div>

      <div class="w-1/4 p-2 overflow-auto h-[400px] border-l border-gray-200">
        {#if showDesignPanel}
          <DesignEditor formProp ={form} {changeColorOnForm} />
        {:else if blocks[blockNo]}
          <PropertyEditor bind:block={blocks[blockNo]} />
        {/if}
      </div>
    </div>
  </main>
</DefaultLayout>
