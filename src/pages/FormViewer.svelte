<script>
  import { onMount } from 'svelte';
  import { getBlocksByFormId } from "../services/blockService.js";  
  import { getFormById } from "../services/formService.js";  
  import { FormView } from '../components/form-builder';
  import { ThankYou } from '../blocks';
  import { SplashScreen } from '../components/ui';
  import { createResponse } from '../services/responseService.js';
  import { validateBlock } from '../utils/validation.js';

  let { route } = $props();
  let showSplash = true;
  let errorMessage = '';
  let blocks = [];
  let blockNo = 0;
  let submitted = false;
  let formId;
  let uiMeta = {};

  onMount(async () => {
    formId = route.result.path.params.id;
    try {
      const formRes = await getFormById(formId);
      uiMeta = formRes.data.form.meta;

      const res = await getBlocksByFormId(formId);
      blocks = res.data.blocks.slice().sort(
        (a, b) => a.meta.blockTypeId - b.meta.blockTypeId
      );
      blockNo = 0;
    } catch (err) {
      errorMessage = 'Failed to load form. Please try again.';
    }

    setTimeout(() => { showSplash = false; }, 4000);
  });

  function nextBlock() {
    const blockEl = document.getElementById('block-container');
    if (!blockEl) return;

    const block = blocks[blockNo];
    const err = validateBlock(block);
    if (err) {
      errorMessage = err;
      return;
    }

    // Animate out
    blockEl.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    blockEl.style.transform = 'translateY(50px)';
    blockEl.style.opacity = '0';

    setTimeout(() => {
      if (blockNo === blocks.length - 1) {
        submitForm();
      } else {
        blockNo += 1;

        // Reset position for animation in
        blockEl.style.transform = 'translateY(-50px)';
        blockEl.style.opacity = '0';

        setTimeout(() => {
          blockEl.style.transform = 'translateY(0)';
          blockEl.style.opacity = '1';
        }, 50);
      }
    }, 500);
  }

  function previousBlock() {
    if (blockNo <= 0) return;
    const blockEl = document.getElementById('block-container');
    if (!blockEl) return;

    blockNo -= 1;

    blockEl.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    blockEl.style.transform = 'translateY(-50px)';
    blockEl.style.opacity = '0';

    setTimeout(() => {
      blockEl.style.transform = 'translateY(0)';
      blockEl.style.opacity = '1';
    }, 50);
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

<main class="relative">
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
    {:else}
      <div id="block-container" class="transition-transform duration-500 ease-in-out">
        <FormView uiMeta={uiMeta} formMode={true} bind:block={blocks[blockNo]} {errorMessage} {nextBlock} />
      </div>
    {/if}
  {/if}

  {#if !submitted && !errorMessage}
    <div class="absolute bottom-10 right-10 z-10 flex gap-4 items-center">
      {#if blockNo > 0}
        <button 
          on:click={previousBlock} 
          class="w-8 h-8 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center"
          title="Previous"
        >
          ↑
        </button>
      {/if}
      {#if blockNo < blocks.length - 1}
        <button 
          on:click={nextBlock} 
          class="w-8 h-8 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center"
          title="Next"
        >
          ↓
        </button>
      {/if}
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
