<script>
  import { onMount } from 'svelte';
  import { ArrowDown, ArrowUp } from 'lucide-svelte';
  import { getBlocksByFormId } from '../services/blockService.js';
  import { getFormById } from '../services/formService.js';
  import { FormView } from '../components/form-builder';
  import { ThankYou } from '../blocks';
  import { SplashScreen } from '../components/ui';
  import { createResponse } from '../services/responseService.js';
  import { validateBlock } from '../utils/validation.js';
  import { fly } from 'svelte/transition';

  let { route } = $props();

  // Reactive state
  let showSplash = $state(false); // Splash disabled for now
  let errorMessage = $state('');
  let blocks = $state([]);
  let blockNo = $state(0);
  let submitted = $state(false);
  let uiMeta = $state({});
  let direction = $state('bottom'); // "top" or "bottom" for fly transition

  let formId;
  let currentAnimation = $state(''); // For fly transition

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

      if (blocks.length === 0) {
        errorMessage = 'No form data available.';
      }

    } catch (err) {
      errorMessage = 'Failed to load form. Please try again later.';
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
      direction = 'bottom';
      currentAnimation = 'slide-out-top';
      setTimeout(() => {
        blockNo += 1;
        currentAnimation = 'slide-in-bottom';
      }, 500);
    }
  }

  function previousBlock() {
    if (blockNo > 0) {
      direction = 'top';
      currentAnimation = 'slide-out-bottom';
      setTimeout(() => {
        blockNo -= 1;
        currentAnimation = 'slide-in-top';
      }, 500);
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

<main class="min-h-screen flex flex-col items-center justify-start py-8 px-4">
  {#if showSplash}
    <SplashScreen />
  {:else if errorMessage && blocks.length === 0}
    <div class="flex flex-col items-center justify-center mt-20 text-center">
      <img src="/assets/no-data-illustration.svg" alt="No data" class="w-48 h-48 mb-4" />
      <p class="text-red-600 text-lg font-semibold">{errorMessage}</p>
      <p class="text-gray-500 mt-2 text-sm">Please check the link or try again later.</p>
    </div>
  {:else if submitted}
    <ThankYou />
  {:else if blocks[blockNo]?.meta}
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mt-8 flex flex-col items-center"
         transition:fly={{ y: direction === 'bottom' ? 500 : -500, duration: 500, opacity: 0 }}>
      <FormView
        uiMeta={uiMeta}
        formMode={true}
        bind:block={blocks[blockNo]}
        {errorMessage}
        {nextBlock}
      />

      <!-- Navigation Buttons -->
      <div class="flex gap-2 mt-6 items-center">
        {#if blockNo > 0}
          <button
            on:click={previousBlock}
            class="w-10 h-10 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center"
            title="Previous"
          >
            <ArrowUp size={16} />
          </button>
        {/if}

        {#if blockNo < blocks.length - 1}
          <button
            on:click={nextBlock}
            class="w-10 h-10 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center"
            title="Next"
          >
            <ArrowDown size={16} />
          </button>
        {/if}

        <a
          href="https://fabform.io"
          target="_blank"
          class="bg-black text-white text-sm flex items-center gap-2 py-1 px-4 rounded-md hover:bg-gray-800 ml-auto"
        >
          Powered by FabForm
        </a>
      </div>
    </div>
  {/if}
</main>

<style>
main {
  background-color: #f9fafb;
}

/* Old CSS animations removed, using Svelte fly */
</style>
