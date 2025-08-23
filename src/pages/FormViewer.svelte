<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { ArrowDown, ArrowUp } from 'lucide-svelte';
  import { BlockLayout } from '../components/form-builder';
  import { SplashScreen } from '../components/ui';
  import { getBlocksByFormId } from '../services/blockService.js';
  import { getFormById } from '../services/formService.js';
  import { createResponse } from '../services/responseService.js';
  import { validateBlock } from '../utils/validation.js';

  let { route } = $props();

  
  let showSplash = $state(true);
  let errorMessage = $state('');
  let blocks = $state([]);
  let blockNo = $state(0);
  let submitted = $state(false);
  let formId;
  let uiMeta;
  let formMode

  let direction = $state('bottom');
  let flyParams = $state({ y: 0, duration: 1000, opacity: 0.7 });
  let firstBlockLoaded = $state(false);

  function updateFlyParams() {
    const vh = window.innerHeight;
    const offsetMultiplier = 1.5;
    flyParams = {
      y: direction === 'top' ? -vh * offsetMultiplier : vh * offsetMultiplier,
      duration: 1000,
      opacity: 0.7,
      easing: t => 1 - Math.pow(1 - t, 3)
    };
  }

  onMount(() => {
    setTimeout(() => showSplash = false, 4000);
    loadForm();

    window.addEventListener('resize', updateFlyParams);
    window.addEventListener('orientationchange', updateFlyParams);
    return () => {
      window.removeEventListener('resize', updateFlyParams);
      window.removeEventListener('orientationchange', updateFlyParams);
    };
  });

  async function loadForm() {
    formId = route.result.path.params.id;
    const formRes = await getFormById(formId);
    uiMeta = formRes.data.form.meta;

    const res = await getBlocksByFormId(formId);
    blocks = res.data.blocks
      .slice()
      .sort((a, b) => a.meta.blockTypeId - b.meta.blockTypeId)
      
    blockNo = 0;
    direction = 'bottom';
    updateFlyParams();
    firstBlockLoaded = true;
  }

  async function submitResponses() {
    const responses = blocks
      .filter(b => b.value != null)
      .map(b => ({
        blockId: b.id,
        blockTypeId: b.meta.blockTypeId,
        answer: b.value
      }));

    
    await createResponse(formId, responses);
    submitted = true;
  }

  async function nextBlock() {
    errorMessage = '';
    const block = blocks[blockNo];

    // Skip validation for ThankYou block
    if (block.type !== 'thankyou') {
      const err = validateBlock(block);
      if (err) { 
        errorMessage = err; 
        return; 
      }
    }

    // Only submit when the current block is second-to-last (before ThankYou)
    if (blockNo === blocks.length - 2) {
      await submitResponses();
    }

    // Move to next block
    if (blockNo < blocks.length - 1) {
      direction = 'bottom';
      updateFlyParams();
      blockNo += 1;
    }
  }

  function previousBlock() {
    if (blockNo > 0) {
      direction = 'top';
      updateFlyParams();
      blockNo -= 1;
    }
  }
</script>

<main class="relative w-full h-full">
  {#if showSplash}
    <div transition:fade={{ duration: 600 }}>
      <SplashScreen />
    </div>

  {:else if errorMessage && blocks.length === 0}
    <div class="text-center mt-20 text-red-600 text-lg px-4">
      <p>{errorMessage}</p>
      <p class="text-sm text-gray-500 mt-2">Please check the link or try again later.</p>
    </div>

  {:else if firstBlockLoaded}
    {#key blockNo}
      <div in:fly="{flyParams}">
        
          <BlockLayout 
            uiMeta={uiMeta} 
            formMode={formMode} 
            bind:block={blocks[blockNo]} 
            {errorMessage} 
            {nextBlock}
          />
        
      </div>
    {/key}
  {/if}

    <div class="absolute bottom-10 right-10 z-10 flex gap-4 items-center">
      <div class="flex gap-2 items-center">
        {#if blockNo > 0}
          <button on:click={previousBlock} class="w-8 h-8 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center" title="Previous">
            <ArrowUp size={16} />
          </button>
        {/if}
        {#if blockNo < blocks.length - 2}
          <button on:click={nextBlock} class="w-8 h-8 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center" title="Next">
            <ArrowDown size={16} />
          </button>
        {/if}

      <a
  href="https://fabform.io"
  target="_blank"
  class="bg-black text-white text-sm flex items-center gap-2 py-1 px-4 rounded-md hover:bg-gray-800"
>
  <span class="text-gray-300">Powered by</span>
  <span class="text-white">FabForm</span>
</a>
  
</div>
</div>
    
  
</main>
