<script>
  import { onMount} from 'svelte';
  import { animate } from '@motionone/dom';
  import { ArrowDown, ArrowUp } from 'lucide-svelte';
  import { FormView } from '../components/form-builder';
  import { ThankYou } from '../blocks';
  import { SplashScreen } from '../components/ui';
  import { getBlocksByFormId } from '../services/blockService.js';
  import { getFormById } from '../services/formService.js';
  import { createResponse } from '../services/responseService.js';
  import { validateBlock } from '../utils/validation.js';

  let { route } = $props();
  let showSplash = state(true);
  let errorMessage = state();
  let blocks = state([]);
  let blockNo = state(0);
  let submitted = state(false);
  let uiMeta = state();
  let direction = state('bottom');

  let formContainer;

  onMount(async () => {
    const formId = route.result.path.params.id;

    try {
      const formRes = await getFormById(formId);
      uiMeta = formRes.data.form.meta;

      const res = await getBlocksByFormId(formId);
      blocks = res.data.blocks.slice().sort(
        (a, b) => a.meta.blockTypeId - b.meta.blockTypeId
      );

      blockNo = 0;
      direction = 'bottom';
      showSplash.set(false);

      slideIn();
    } catch (err) {
      errorMessage.set('Failed to load form. Please try again later.');
      showSplash.set(false);
    }
  });

  function slideIn() {
    if (!formContainer) return;

    // move off screen
    formContainer.style.transform = `translateY(${direction.get() === 'top' ? '-100vh' : '100vh'})`;
    formContainer.style.opacity = 0;

    animate(formContainer, 
      { translateY: '0vh', opacity: 1 },
      { duration: 0.6, easing: 'ease-in-out' }
    );
  }

  function nextBlock() {
    errorMessage.set('');
    const block = blocks.get()[blockNo.get()];
    const err = validateBlock(block);

    if (err) {
      errorMessage.set(err);
      return;
    }

    if (blockNo.get() === blocks.get().length - 1) {
      submitForm();
    } else {
      direction.set('bottom');
      slideOut(() => {
        blockNo.update(n => n + 1);
        slideIn();
      });
    }
  }

  function previousBlock() {
    if (blockNo.get() > 0) {
      direction.set('top');
      slideOut(() => {
        blockNo.update(n => n - 1);
        slideIn();
      });
    }
  }

  function slideOut(callback) {
    if (!formContainer) return;

    animate(formContainer, 
      { translateY: direction.get() === 'top' ? '-100vh' : '100vh', opacity: 0 },
      { duration: 0.4, easing: 'ease-in-out' }
    ).finished.then(callback);
  }

  async function submitForm() {
    const responses = blocks.get()
      .filter(b => b.value != null)
      .map(b => ({
        blockId: b.id,
        blockTypeId: b.meta.blockTypeId,
        answer: b.value
      }));

    await createResponse(route.result.path.params.id, responses);
    submitted.set(true);
    blockNo.set(-1);
  }
</script>

<main class="relative min-h-screen flex flex-col items-center justify-start p-4">
  {#if $showSplash}
    <SplashScreen />
  {:else if $errorMessage && $blocks.length === 0}
    <div class="text-center mt-20 text-red-600 text-lg px-4">
      <p>{$errorMessage}</p>
      <p class="text-sm text-gray-500 mt-2">Please check the link or try again later.</p>
    </div>
  {:else}
    {#if $submitted}
      <ThankYou />
    {:else if $blocks[$blockNo]?.meta}
      <div 
        bind:this={formContainer}
        class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-auto text-center mt-8 md:mt-16"
      >
        <FormView 
          uiMeta={$uiMeta} 
          formMode={true} 
          bind:block={$blocks[$blockNo]} 
          {errorMessage} 
          {nextBlock} 
        />
      </div>
    {/if}
  {/if}

  {#if !$submitted && !$errorMessage}
    <div class="fixed bottom-4 right-4 flex gap-4 items-center">
      {#if $blockNo > 0}
        <button on:click={previousBlock} class="w-10 h-10 bg-gray-800 text-white rounded-md flex items-center justify-center hover:bg-gray-700" title="Previous">
          <ArrowUp size={16} />
        </button>
      {/if}

      {#if $blockNo < $blocks.length - 1}
        <button on:click={nextBlock} class="w-10 h-10 bg-gray-800 text-white rounded-md flex items-center justify-center hover:bg-gray-700" title="Next">
          <ArrowDown size={16} />
        </button>
      {/if}
    </div>
  {/if}
</main>
