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
  let showSplash = $state(false); // temporarily disabled splash for mobile
  let errorMessage = $state('');
  let blocks = $state([]);
  let blockNo = $state(0);
  let submitted = $state(false);
  let uiMeta = $state({});
  let direction = $state('bottom'); // top or bottom
  let currentAnimation = $state('');

  let formId;

  onMount(async () => {
    formId = route.result.path.params.id;
    console.log("Form ID:", formId);

    try {
      const formRes = await getFormById(formId);
      if (!formRes.success) {
        console.error("Form fetch error:", formRes.error);
        errorMessage = "Failed to load form metadata.";
        return;
      }
      uiMeta = formRes.data.form.meta;

      const res = await getBlocksByFormId(formId);
      if (!res.success) {
        console.error("Blocks fetch error:", res.error);
        errorMessage = "Failed to load form blocks.";
        return;
      }
      blocks = res.data.blocks.slice().sort(
        (a, b) => a.meta.blockTypeId - b.meta.blockTypeId
      );

      if (blocks.length === 0) {
        errorMessage = "No form data available.";
      }

      blockNo = 0;
    } catch (err) {
      console.error("Unexpected fetch error:", err);
      errorMessage = "Failed to load form. Please try again later.";
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
      blockNo += 1;
    }
  }

  function previousBlock() {
    if (blockNo > 0) {
      direction = 'top';
      blockNo -= 1;
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

<main class="flex flex-col justify-start items-center min-h-screen px-4">
  {#if showSplash}
    <SplashScreen />
  {:else if errorMessage && blocks.length === 0}
    <div class="text-center mt-20 text-red-600 text-lg">
      <p>{errorMessage}</p>
      <p class="text-sm text-gray-500 mt-2">Please check the link or try again later.</p>
    </div>
  {:else}
    {#if submitted}
      <ThankYou />
    {:else if blocks[blockNo]?.meta}
      {#if direction === 'bottom'}
        <div transition:fly={{ y: window.innerHeight, duration: 500, opacity: 0 }} 
             class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-auto text-center mt-8">
          <FormView
            uiMeta={uiMeta}
            formMode={true}
            bind:block={blocks[blockNo]}
            {errorMessage}
            {nextBlock}
          />
        </div>
      {:else if direction === 'top'}
        <div transition:fly={{ y: -window.innerHeight, duration: 500, opacity: 0 }} 
             class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-auto text-center mt-8">
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
  {/if}

  {#if !submitted && !errorMessage && blocks.length > 0}
    <div class="flex gap-4 items-center mt-6">
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
        class="bg-black text-white text-sm flex items-center gap-2 py-1 px-4 rounded-md hover:bg-gray-800"
      >
        Powered by FabForm
      </a>
    </div>
  {/if}
</main>
