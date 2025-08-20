<script>
  import { onMount } from 'svelte';
  import { SplashScreen } from '../components/ui';
  import { FormView } from '../components/form-builder';
  import { ThankYou } from '../blocks';
  import { ArrowDown, ArrowUp } from 'lucide-svelte';
  import { getBlocksByFormId } from "../services/blockService.js";  
  import { getFormById } from "../services/formService.js";  
  import { createResponse } from '../services/responseService.js';
  import { validateBlock } from '../utils/validation.js';

  let { route } = $props();
  let showSplash = $state(true);
  let errorMessage = $state('');

  let blocks = $state([]);
  let blockNo = $state(0);
  let submitted = $state(false);
  
  let formId;
  let uiMeta = $state();

  let divState = $state({
    visible: false,
    direction: 'top' // 'top' or 'bottom'
  });

  onMount(async () => {
    formId = route.result.path.params.id;
    const formRes = await getFormById(formId);
    uiMeta = formRes.data.form.meta;      
    const res = await getBlocksByFormId(formId);
    blocks = res.data.blocks.slice().sort((a,b) => a.meta.blockTypeId - b.meta.blockTypeId);
    
    // Hide splash after 4 seconds
    setTimeout(() => { 
      showSplash = false; 
      // Show first block
      divState = { visible: true, direction: 'top' };
    }, 4000);
  });

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
      divState = { visible: false, direction: 'bottom' };
      setTimeout(() => {
        blockNo = blockNo + 1;
        divState = { visible: true, direction: 'bottom' };
      }, 100);
    }
  }

  function previousBlock() {
    if (blockNo > 0) {
      divState = { visible: false, direction: 'top' };
      setTimeout(() => {
        blockNo = blockNo - 1;
        divState = { visible: true, direction: 'top' };
      }, 100);
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

<main class="min-h-screen flex flex-col items-center justify-center p-4">
  {#if showSplash}
    <SplashScreen />
  {:else if errorMessage && blocks.length === 0}
    <div class="text-center mt-20 text-red-600 text-lg px-4">
      <p>{errorMessage}</p>
      <p class="text-sm text-gray-500 mt-2">Please check the link or try again later.</p>
    </div>
  {:else}
    {#if submitted}
      <ThankYou />
    {:else if blocks[blockNo]}
      <div
        class="bg-white rounded-xl shadow-lg p-8 w-11/12 md:w-1/2 mx-auto text-center mt-8 md:mt-16
               transition-transform transition-opacity duration-700 ease-in-out"
        style="transform: translateY({divState.visible ? '0' : divState.direction === 'top' ? '-100vh' : '100vh'});
               opacity: {divState.visible ? 1 : 0};"
      >
        <FormView uiMeta={uiMeta} formMode={true} bind:block={blocks[blockNo]} {errorMessage} {nextBlock}/>
      </div>
    {/if}
  {/if}

  {#if !submitted && !errorMessage}
    <div class="absolute bottom-10 right-10 z-10 flex gap-4 items-center">
      <div class="flex gap-2 items-center">
        {#if blockNo > 0}
          <button 
            on:click={previousBlock} 
            class="w-8 h-8 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center" 
            title="Previous"
          >
            <ArrowUp size={16} />
          </button>
        {/if}

        {#if blockNo < blocks.length - 1}
          <button 
            on:click={nextBlock} 
            class="w-8 h-8 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center" 
            title="Next"
          >
            <ArrowDown size={16} />
          </button>
        {/if}
      </div>
      <a 
        href="https://fabform.io"
        target="_blank" 
        class="bg-black text-white text-sm flex items-center gap-2 py-1 px-4 rounded-md hover:bg-gray-800"
      >
        Powered by FabForm
      </a>
    </div>
  {/if}
</main>
