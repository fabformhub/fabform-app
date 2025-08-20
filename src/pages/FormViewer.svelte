<script>
  import { onMount} from 'svelte';
  import { ArrowDown, ArrowUp } from 'lucide-svelte';
  import { getBlocksByFormId } from "../services/blockService.js";  
  import { getFormById } from "../services/formService.js";  
  import { FormView } from '../components/form-builder';
  import { ThankYou } from '../blocks';
  import { SplashScreen } from '../components/ui';
  import { createResponse } from '../services/responseService.js';
  import { validateBlock } from '../utils/validation.js';

  let { route } = $props();

  // Splash screen
  let showSplash = $state(true);

  // Error messages
  let errorMessage = $state();

  // Blocks data
  let blocks = $state([]);
  let blockNo = $state(0);
  let submitted = $state(false);
  let formId;
  let uiMeta = $state();

  // Animation state
  let currentBlockVisible = $state(false);
  let slideDirection = $state('bottom');

  onMount(async () => {
    formId = route.result.path.params.id;
    const formRes = await getFormById(formId);
    uiMeta = formRes.data.form.meta;

    const res = await getBlocksByFormId(formId);
    blocks = res.data.blocks.slice().sort(
      (a, b) => a.meta.blockTypeId - b.meta.blockTypeId
    );

    blockNo = 0;

    // Show first block with slide-in
    setTimeout(() => {
      currentBlockVisible = true;
      slideDirection = 'bottom';
    }, 100);

    // Hide splash after 4s
    setTimeout(() => showSplash = false, 4000);
  });

  function slideClass(direction, visible) {
    if (visible) return 'translate-y-0 opacity-100';
    return direction === 'top'
      ? '-translate-y-[100vh] opacity-0'
      : 'translate-y-[100vh] opacity-0';
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
      currentBlockVisible = false;
      slideDirection = 'bottom';
      setTimeout(() => {
        blockNo += 1;
        currentBlockVisible = true;
      }, 300);
    }
  }

  function previousBlock() {
    if (blockNo > 0) {
      currentBlockVisible = false;
      slideDirection = 'top';
      setTimeout(() => {
        blockNo -= 1;
        currentBlockVisible = true;
      }, 300);
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

<main class="relative min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">

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
        class={`bg-white rounded-xl shadow-lg p-6 w-11/12 sm:w-3/4 md:w-1/2 text-center mt-8 md:mt-16
                transition-transform duration-500 ease-in-out
                ${slideClass(slideDirection, currentBlockVisible)}`}
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
    <div class="absolute bottom-6 right-6 z-10 flex gap-4 items-center">
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
