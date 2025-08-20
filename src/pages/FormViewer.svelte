<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { ArrowDown, ArrowUp } from 'lucide-svelte';
  import { getBlocksByFormId } from "../services/blockService.js";  
  import { getFormById } from "../services/formService.js";  
  import { FormView } from '../components/form-builder';
  import { ThankYou } from '../blocks';
  import { SplashScreen } from '../components/ui';
  import { createResponse } from '../services/responseService.js';
  import { validateBlock } from '../utils/validation.js';

  let { route } = $props();

  let showSplash = $state(true);
  let errorMessage = $state('');
  let blocks = $state([]);
  let blockNo = $state(0);
  let submitted = $state(false);
  let uiMeta = $state();
  let formId;

  const divState = $state({
    visible: true,
    direction: 'top'
  });

  onMount(async () => {
    formId = route.result.path.params.id;

    const formRes = await getFormById(formId);
    uiMeta = formRes.data.form.meta;

    const res = await getBlocksByFormId(formId);
    blocks = res.data.blocks.slice().sort(
      (a, b) => a.meta.blockTypeId - b.meta.blockTypeId
    );

    blockNo = 0;

    setTimeout(() => { showSplash = false; }, 3000);
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
      divState.visible = false;
      divState.direction = 'bottom';
      setTimeout(() => {
        blockNo = blockNo + 1;
        divState.visible = true;
      }, 700);
    }
  }

  function previousBlock() {
    if (blockNo > 0) {
      divState.visible = false;
      divState.direction = 'top';
      setTimeout(() => {
        blockNo = blockNo - 1;
        divState.visible = true;
      }, 700);
    }
  }

  async function submitForm() {
    const responses = blocks
      .filter(b => b.value != null)
      .map(b => ({
        blockId: b.id,
        blockTypeId: b.meta.blockTypeId,
        answer: b.value
      }));
    await createResponse(formId, responses);
    submitted = true;
    blockNo = -1;
  }

  function flyDistance() {
    return 500; // offscreen distance
  }
</script>

<main class="relative min-h-screen">
  {#if showSplash}
    <div class="absolute inset-0 flex items-center justify-center bg-gray-100 z-50">
      <SplashScreen />
    </div>
  {:else if errorMessage && blocks.length === 0}
    <div class="text-center mt-20 text-red-600 text-lg px-4">
      <p>{errorMessage}</p>
      <p class="text-sm text-gray-500 mt-2">Please check the link or try again later.</p>
    </div>
  {:else}
    {#if submitted}
      <ThankYou />
    {:else if blocks[blockNo]?.meta && divState.visible}
      <div
        in:fly={{ y: divState.direction === 'top' ? -flyDistance() : flyDistance(), opacity: 0, duration: 700, easing: cubicOut }}
        out:fly={{ y: divState.direction === 'top' ? -flyDistance() : flyDistance(), opacity: 0, duration: 700, easing: cubicOut }}
        class="bg-white rounded-xl shadow-lg p-8 w-11/12 md:w-1/2 mx-auto text-center mt-8 md:mt-16"
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
