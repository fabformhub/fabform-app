<script>
  import { onMount} from 'svelte';
  import { FormView } from '../components/form-builder';
  import { ThankYou } from '../blocks';
  import { ArrowDown, ArrowUp } from 'lucide-svelte';
  import { getBlocksByFormId } from '../services/blockService.js';
  import { getFormById } from '../services/formService.js';
  import { createResponse } from '../services/responseService.js';
  import { validateBlock } from '../utils/validation.js';

  let { route } = $props();

  // let showSplash = $state(true); // commented out for now
  let showSplash = $state(false);
  let errorMessage = $state('');
  let blocks = $state([]);
  let blockNo = $state(0);
  let submitted = $state(false);
  let uiMeta = {};
  let formId;

  // Slide state
  let divVisible = $state(true);
  let divDirection = $state('top');
  let animClass = $state('slide-in');

  $effect(() => {
    animClass = divVisible
      ? 'slide-in'
      : divDirection === 'top'
        ? 'slide-out-top'
        : 'slide-out-bottom';
  });

  onMount(async () => {
    try {
      formId = route.result.path.params.id;
      const formRes = await getFormById(formId);
      uiMeta = formRes.data.form.meta;

      const res = await getBlocksByFormId(formId);
      blocks = res.data.blocks.slice().sort(
        (a, b) => a.meta.blockTypeId - b.meta.blockTypeId
      );
      blockNo = 0;

      // Example splash timeout if we bring it back:
      // setTimeout(() => { showSplash = false; }, 2000);
    } catch (err) {
      errorMessage = 'Failed to load form. Please try again later.';
      console.error(err);
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
      divVisible = false;
      divDirection = 'bottom';
      setTimeout(() => {
        blockNo += 1;
        divDirection = 'top';
        divVisible = true;
      }, 400); // matches CSS transition duration
    }
  }

  function previousBlock() {
    if (blockNo > 0) {
      divVisible = false;
      divDirection = 'top';
      setTimeout(() => {
        blockNo -= 1;
        divDirection = 'bottom';
        divVisible = true;
      }, 400);
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

<style>
  .slide-in {
    transform: translateY(0);
    opacity: 1;
    transition: transform 0.4s ease, opacity 0.4s ease;
  }
  .slide-out-top {
    transform: translateY(-100vh);
    opacity: 0;
    transition: transform 0.4s ease, opacity 0.4s ease;
  }
  .slide-out-bottom {
    transform: translateY(100vh);
    opacity: 0;
    transition: transform 0.4s ease, opacity 0.4s ease;
  }
</style>

<main class="relative min-h-screen bg-gray-50">
  {#if showSplash}
    <!-- <SplashScreen /> -->
  {:else}

    {#if errorMessage && blocks.length === 0}
      <div class="text-center mt-20 text-red-600 text-lg px-4">
        <p>{errorMessage}</p>
        <p class="text-sm text-gray-500 mt-2">Please check the link or try again later.</p>
      </div>
    {:else if submitted}
      <ThankYou />
    {:else if blocks[blockNo]}
      <div class="relative w-full max-w-md mx-auto h-60 overflow-hidden">
        <div class="absolute w-full h-full {animClass}">
          <div class="bg-white h-full text-black flex items-center justify-center rounded-xl shadow-lg p-4">
            <FormView
              uiMeta={uiMeta}
              formMode={true}
              bind:block={blocks[blockNo]}
              {errorMessage}
              {nextBlock}
            />
          </div>
        </div>
      </div>
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
      </div>
    {/if}
  {/if}
</main>
