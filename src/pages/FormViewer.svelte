<script>
  import { onMount } from 'svelte';
  import { animate } from '@motionone/dom';
  import { ArrowDown, ArrowUp } from 'lucide-svelte';
  import { FormView } from '../components/form-builder';
  import { ThankYou } from '../blocks';
  import { SplashScreen } from '../components/ui';
  import { getBlocksByFormId } from "../services/blockService.js";  
  import { getFormById } from "../services/formService.js";  
  import { createResponse } from '../services/responseService.js';
  import { validateBlock } from '../utils/validation.js';

  export let route;

  let showSplash = true;
  let errorMessage = '';
  let blocks = [];
  let blockNo = 0;
  let submitted = false;
  let formId;
  let uiMeta = {};

  onMount(async () => {
    formId = route.result.path.params.id;
    const formRes = await getFormById(formId);
    uiMeta = formRes.data.form.meta;      
    const res = await getBlocksByFormId(formId);
    blocks = res.data.blocks.slice().sort((a, b) => a.meta.blockTypeId - b.meta.blockTypeId);
    blockNo = 0;

    // Splash screen timeout
    setTimeout(() => showSplash = false, 3000);

    // Animate first block in
    setTimeout(() => animateBlockIn(), 100);
  });

  function animateBlockIn(direction = 'bottom') {
    const el = document.querySelector('.current-block');
    if (!el) return;
    const yStart = direction === 'top' ? -window.innerHeight : window.innerHeight;
    animate(el, { y: [yStart, 0], opacity: [0, 1] }, { duration: 0.5, easing: 'ease-out' });
  }

  function animateBlockOut(direction = 'bottom', callback) {
    const el = document.querySelector('.current-block');
    if (!el) return callback?.();
    const yEnd = direction === 'top' ? -window.innerHeight : window.innerHeight;
    animate(el, { y: [0, yEnd], opacity: [1, 0] }, { duration: 0.5, easing: 'ease-in' }).finished.then(callback);
  }

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
      animateBlockOut('bottom', () => {
        blockNo += 1;
        animateBlockIn('bottom');
      });
    }
  }

  function previousBlock() {
    if (blockNo > 0) {
      animateBlockOut('top', () => {
        blockNo -= 1;
        animateBlockIn('top');
      });
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

<main class="relative min-h-screen bg-gray-100 flex flex-col items-center justify-start">
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
    {:else if blocks[blockNo]?.meta}
      <div 
        class="current-block bg-white rounded-xl shadow-lg p-8 w-11/12 md:w-1/2 mx-auto text-center mt-8 md:mt-16"
      >
        <FormView 
          uiMeta={uiMeta} 
          formMode={true} 
          bind:block={blocks[blockNo]} 
          {errorMessage} 
          {nextBlock}
        />
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
