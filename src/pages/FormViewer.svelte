<script>
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { ArrowDown, ArrowUp } from 'lucide-svelte';
  import { getBlocksByFormId } from '../services/blockService.js';
  import { getFormById } from '../services/formService.js';
  import { FormView } from '../components/form-builder';
  import { ThankYou } from '../blocks';
  import { SplashScreen } from '../components/ui';
  import { createResponse } from '../services/responseService.js';
  import { validateBlock } from '../utils/validation.js';
  import { APP_URL } from '../utils/global.js';

  let { route } = $props();
  
  let showSplash = true;
  let errorMessage = '';
  let blocks = [];
  let blockNo = 0;
  let submitted = false;
  let uiMeta = {};
  let formId;

  const positions = { top: -500, bottom: 500 };
  let divState = { visible: true, direction: 'top' };

  onMount(async () => {
    try {
      formId = route.result.path.params.id;
      const formRes = await getFormById(formId);
      uiMeta = formRes.data.form.meta || {};
      const res = await getBlocksByFormId(formId);
      blocks = res.data.blocks?.slice().sort((a,b) => a.meta.blockTypeId - b.meta.blockTypeId) || [];
      blockNo = 0;
    } catch(err) {
      console.error(err);
      errorMessage = 'Failed to load the form. Please try again later.';
    } finally {
      setTimeout(() => { showSplash = false; }, 4000);
    }
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
      blockNo++;
      divState = { ...divState, visible: false, direction: 'bottom' };
      setTimeout(() => divState.visible = true, 700);
    }
  }

  function previousBlock() {
    if (blockNo > 0) {
      blockNo--;
      divState = { ...divState, visible: false, direction: 'top' };
      setTimeout(() => divState.visible = true, 700);
    }
  }

  async function submitForm() {
    try {
      const responses = blocks.filter(b => b.value != null).map(b => ({
        blockId: b.id,
        blockTypeId: b.meta.blockTypeId,
        answer: b.value
      }));
      await createResponse(formId, responses);
      submitted = true;
      blockNo = -1;
    } catch(err) {
      console.error(err);
      errorMessage = 'Failed to submit the form.';
    }
  }
</script>

<main class="relative w-full h-full min-h-screen">
<!---  {#if showSplash}
    <SplashScreen />
  {:else}
-->
    {#if submitted}
      <ThankYou />
   <!--  {:else if blocks[blockNo] && divState.visible} -->
     <p>test</p>
    {:else}
    
      <div 
        in:fly={{ y: divState.direction === 'top' ? positions.top : positions.bottom, opacity: 0, duration: 700 }}
        out:fade
        class="w-full flex justify-center"
      >
        <FormView uiMeta={uiMeta} formMode={true} bind:block={blocks[blockNo]} {errorMessage} {nextBlock} />
      </div>
    {/if}
  
  {#if !submitted && !errorMessage && blocks.length > 0}
    <div class="fixed bottom-4 right-4 z-10 flex gap-4 items-center touch-none">
      <div class="flex gap-2 items-center">
        {#if blockNo > 0}
          <button 
            on:click={previousBlock} on:touchstart={previousBlock} 
            class="w-10 h-10 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center" 
            title="Previous"
          >
            <ArrowUp size={18} />
          </button>
        {/if}

        {#if blockNo < blocks.length - 1}
          <button 
            on:click={nextBlock} on:touchstart={nextBlock} 
            class="w-10 h-10 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center" 
            title="Next"
          >
            <ArrowDown size={18} />
          </button>
        {/if}
      </div>
      <a 
        href="https://fabform.io" 
        target="_blank" 
        class="bg-black text-white text-sm flex items-center gap-2 py-1 px-3 rounded-md hover:bg-gray-800"
      >
        Powered by FabForm
      </a>
    </div>
  {/if}
</main>

<style>
  main {
    touch-action: manipulation; /* improve touch responsiveness */
  }
</style>
