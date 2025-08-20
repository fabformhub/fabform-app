<script>
  import { onMount } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';
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
  let blocks = $state([]);
  let blockNo = $state(0);
  let submitted = $state(false);
  let errorMessage = $state('');
  let uiMeta = $state({});
  
  // Controls the slide direction and visibility
  let divState = $state({ visible: false, direction: 'top' });

  function flyDistance() {
    return window.innerHeight; // full screen
  }

  onMount(async () => {
    const formId = route.result.path.params.id;

    const formRes = await getFormById(formId);
    uiMeta = formRes.data.form.meta;

    const res = await getBlocksByFormId(formId);
    blocks = res.data.blocks.slice().sort(
      (a, b) => a.meta.blockTypeId - b.meta.blockTypeId
    );
    
    blockNo = 0;

    // Wait a short delay to let splash show a bit, then show first block
    setTimeout(() => {
      divState = { visible: true, direction: 'top' };
      showSplash = false;
    }, 500);
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
      divState = { ...divState, visible: false, direction: 'bottom' };
      setTimeout(() => {
        blockNo += 1;
        divState = { ...divState, visible: true };
      }, 500);
    }
  }

  function previousBlock() {
    if (blockNo > 0) {
      divState = { ...divState, visible: false, direction: 'top' };
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

    await createResponse(route.result.path.params.id, responses);
    submitted = true;
    blockNo = -1;
  }
</script>

<main>
  {#if showSplash}
    <SplashScreen />
  {:else if submitted}
    <ThankYou />
  {:else if blocks[blockNo] && divState.visible}
    <div
      in:fly={{ y: divState.direction === 'top' ? -flyDistance() : flyDistance(), duration: 500, easing: cubicOut }}
      out:fly={{ y: divState.direction === 'top' ? -flyDistance() : flyDistance(), duration: 500, easing: cubicOut }}
      class="bg-white rounded-xl shadow-lg p-8 w-11/12 md:w-1/2 mx-auto text-center mt-8 md:mt-16"
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

  {#if !submitted}
    <div class="fixed bottom-10 right-10 flex gap-4 items-center z-10">
      <div class="flex gap-2">
        {#if blockNo > 0}
          <button
            onclick={previousBlock}
            class="w-8 h-8 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center"
            title="Previous"
          >
            <ArrowUp size={16} />
          </button>
        {/if}

        {#if blockNo < blocks.length - 1}
          <button
            onclick={nextBlock}
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
