<script>
  import { fly, fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { ArrowDown, ArrowUp } from 'lucide-svelte';
  import { getBlocksByFormId } from "../services/blockService.js";  
  import { getFormById } from "../services/formService.js";  
  import { FormView } from '../components/form-builder';
  import { ThankYou } from '../blocks';
  import { SplashScreen } from '../components/ui';
  import { createResponse } from '../services/responseService.js';
  import { validateBlock } from '../utils/validation.js';
  import { APP_URL } from '../utils/global.js';

  let { route } = $props();
  let showSplash = $state(true);
  let errorMessage = $state();

  let blocks = $state([]);
  let blockNo = $state(0);
  let submitted = $state(false);
  
  let formId;
  let uiMeta = $state();

  onMount(async () => {
    formId = route.result.path.params.id;
    const formRes = await getFormById(formId);
    uiMeta = formRes.data.form.meta;      
    const res = await getBlocksByFormId(formId);
    blocks = res.data.blocks.slice().sort(
      (a, b) => a.meta.blockTypeId - b.meta.blockTypeId
    );
    blockNo = 0;
  });

  setTimeout(() => { showSplash = false; }, 4000);

  const positions = { top: -500, bottom: 500 };
  let divState = $state({ visible: true, direction: 'top' });

  function nextBlock() {
    errorMessage = '';  
    const block = blocks[blockNo];
    const err = validateBlock(block);
    if (err) {
      errorMessage = err;
      return;
    }

    if (blockNo === blocks.length - 1) {
      submitForm();
    } else {
      blockNo = blockNo + 1;
      divState = { ...divState, visible: false, direction: 'bottom' };
      setTimeout(() => { divState = { ...divState, visible: true }; }, 700);
    }
  }

  function previousBlock() {
    if (blockNo > 0) {
      blockNo = blockNo - 1;
      divState = { ...divState, visible: false, direction: 'top' };
      setTimeout(() => { divState = { ...divState, visible: true }; }, 700);
    }
  }

  async function submitForm() {
    const responses = blocks
      .filter(block => block.value != null)
      .map(block => ({
        blockId: block.id,
        blockTypeId: block.meta.blockTypeId,
        answer: block.value
      }));
    await createResponse(formId, responses);
    submitted = true;
    blockNo = -1;
  }
</script>

<main class="min-h-screen relative overflow-auto px-4 md:px-8 py-4">
  {#if showSplash}
    <SplashScreen />
  {:else}
    {#if errorMessage && blocks.length === 0}
      <div class="text-center mt-20 text-red-600 text-lg px-4">
        <p>{errorMessage}</p>
        <p class="text-sm text-gray-500 mt-2">Please check the link or try again later.</p>
      </div>
    {:else}
      {#if submitted}
        <ThankYou />
      {:else}
        {#if blocks[blockNo]?.meta && divState.visible}
          <div 
            in:fly={{ y: divState.direction === 'top' ? positions.top : positions.bottom, opacity: 0, duration: 700 }} 
            out:fade
          >
            <FormView uiMeta={uiMeta} formMode={true} bind:block={blocks[blockNo]} {errorMessage} {nextBlock}/>
          </div>
        {/if}
      {/if}
    {/if}
  {/if}

  {#if !submitted && !errorMessage}
    <div class="fixed bottom-4 right-4 z-50 flex gap-4 items-center md:flex-col">
      <div class="flex gap-2 items-center md:flex-col">
        {#if blockNo > 0}
          <button 
            on:click={previousBlock} 
            class="w-10 h-10 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center" 
            title="Previous"
          >
            <ArrowUp size={20} />
          </button>
        {/if}

        {#if blockNo < blocks.length - 1}
          <button 
            on:click={nextBlock} 
            class="w-10 h-10 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center" 
            title="Next"
          >
            <ArrowDown size={20} />
          </button>
        {/if}
      </div>
      <a 
        href="https://fabform.io"
        target="_blank" 
        class="bg-black text-white text-sm flex items-center gap-2 py-1 px-3 rounded-md hover:bg-gray-800 mt-2 md:mt-4"
      >
        Powered by FabForm
      </a>
    </div>
  {/if}
</main>
