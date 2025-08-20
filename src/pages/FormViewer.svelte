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
  let errorMessage = $state();

  let blocks = $state([]);
  let blockNo = $state(0);
  let submitted = $state(false);
  
  let formId;
  let uiMeta = $state();
  let flyDistance = $state(0);

  let divState = $state({
    visible: true,
    direction: 'down'
  });

  onMount(async () => {
    formId = route.result.path.params.id;
    const formRes = await getFormById(formId);
    uiMeta = formRes.data.form.meta;
    const res = await getBlocksByFormId(formId);
    blocks = res.data.blocks.slice().sort((a, b) => a.meta.blockTypeId - b.meta.blockTypeId);
    blockNo = 0;

    flyDistance = window.innerHeight;
    window.addEventListener('resize', () => flyDistance = window.innerHeight);

    setTimeout(() => { showSplash = false; }, 4000);
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
      blockNo += 1;
      divState = { ...divState, visible: false, direction: 'down' };
      setTimeout(() => divState = { ...divState, visible: true }, 500);
    }
  }

  function previousBlock() {
    if (blockNo > 0) {
      blockNo -= 1;
      divState = { ...divState, visible: false, direction: 'up' };
      setTimeout(() => divState = { ...divState, visible: true }, 500);
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
</script>

<main class="relative flex justify-center items-center min-h-screen overflow-hidden">
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
    {:else if blocks[blockNo]?.meta && divState.visible}
      <div
        class="bg-white rounded-xl shadow-lg p-8 w-11/12 md:w-1/2 mx-auto text-center absolute will-change-transform"
        in:fly={{ y: divState.direction === 'up' ? -flyDistance : flyDistance, duration: 500, easing: cubicOut }}
        out:fly={{ y: divState.direction === 'up' ? -flyDistance : flyDistance, duration: 500, easing: cubicOut }}
      >
        <FormView uiMeta={uiMeta} formMode={true} bind:block={blocks[blockNo]} {errorMessage} {nextBlock} />
      </div>
    {/if}
  {/if}

  {#if !submitted && !errorMessage}
    <div class="absolute bottom-10 right-10 z-10 flex gap-4 items-center">
      <div class="flex gap-2 items-center">
        {#if blockNo > 0}
          <button onclick={previousBlock} class="w-8 h-8 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center" title="Previous">
            <ArrowUp size={16} />
          </button>
        {/if}
        {#if blockNo < blocks.length - 1}
          <button onclick={nextBlock} class="w-8 h-8 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center" title="Next">
            <ArrowDown size={16} />
          </button>
        {/if}
      </div>
    </div>
  {/if}
</main>
