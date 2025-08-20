<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { ArrowUp, ArrowDown } from 'lucide-svelte';
  import { SplashScreen } from '../components/ui';
  import { FormView } from '../components/form-builder';
  import { ThankYou } from '../blocks';
  import { getBlocksByFormId } from "../services/blockService.js";  
  import { getFormById } from "../services/formService.js";  
  import { createResponse } from '../services/responseService.js';
  import { validateBlock } from '../utils/validation.js';
  import { APP_URL } from '../utils/global.js';

  let { route } = $props();
  
  // Splash screen
  let showSplash = $state(true);

  // Form state
  let blocks = $state([]);
  let blockNo = $state(0);
  let submitted = $state(false);
  let errorMessage = $state('');
  let uiMeta = $state();

  // Animation state
  let divState = $state({
    visible: true,
    direction: 'down' // 'up' or 'down'
  });

  let formId;

  onMount(async () => {
    formId = route.result.path.params.id;

    const formRes = await getFormById(formId);
    uiMeta = formRes.data.form.meta;

    const res = await getBlocksByFormId(formId);
    blocks = res.data.blocks.slice().sort(
      (a, b) => a.meta.blockTypeId - b.meta.blockTypeId
    );

    blockNo = 0;

    // Hide splash after 3s
    setTimeout(() => { showSplash = false; }, 3000);
  });

  const flyDistance = () => '100vh'; // works for desktop & mobile

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
      divState = { ...divState, visible: false, direction: 'down' };
      setTimeout(() => {
        blockNo += 1;
        divState = { ...divState, visible: true };
      }, 500);
    }
  }

  function previousBlock() {
    if (blockNo > 0) {
      divState = { ...divState, visible: false, direction: 'up' };
      setTimeout(() => {
        blockNo -= 1;
        divState = { ...divState, visible: true };
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

<main class="relative overflow-hidden min-h-screen">
  {#if showSplash}
    <div class="absolute inset-0">
      <SplashScreen />
    </div>
  {:else if submitted}
    <ThankYou />
  {:else if blocks[blockNo]?.meta && divState.visible}
    <div
      in:fly={{ y: divState.direction === 'up' ? '-' + flyDistance() : flyDistance(), opacity: 0, duration: 500, easing: cubicOut }}
      out:fly={{ y: divState.direction === 'up' ? '-' + flyDistance() : flyDistance(), opacity: 0, duration: 500, easing: cubicOut }}
      class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-8 w-11/12 md:w-1/2 text-center"
    >
      <FormView uiMeta={uiMeta} formMode={true} bind:block={blocks[blockNo]} {errorMessage} {nextBlock}/>
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
            <ArrowUp size={16}/>
          </button>
        {/if}

        {#if blockNo < blocks.length - 1}
          <button
            on:click={nextBlock}
            class="w-8 h-8 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center"
            title="Next"
          >
            <ArrowDown size={16}/>
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
