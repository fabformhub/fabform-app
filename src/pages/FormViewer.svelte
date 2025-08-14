<script>
  import { fly, fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { ArrowDown, ArrowUp } from 'lucide-svelte';
  import { getBlocksByFormId } from "../services/blockService.js";  
  import { getFormById } from "../services/formService.js";  
  import { FormView } from '../components/form-builder';
  import { ThankYou } from '../blocks';
  import { SplashScreen } from '../components/ui';
  import { createResponse } from '../services/responseService.js';
  import { validateBlock } from '../utils/validation.js';
  import { APP_URL } from '../utils/global.js';

  let { route } = $props();
  let showSplash = $state(true);
  let errorMessage = $state();

  let blocks = $state([]);
  let blockNo = $state(0);
  let submitted = $state(false);
  
  let formId;
  let uiMeta = $state();

  onMount(async () => {
    // First, try normal router (works in normal mode)
    formId = route?.result?.path?.params?.id;

    // If no router param (likely embedded), extract from URL segment /v/<formId>
    if (!formId) {
      const segments = window.location.pathname.split('/').filter(Boolean);
      if (segments[0] === 'v' && segments[1]) {
        formId = segments[1];
      }
    }

    if (!formId) {
      errorMessage = 'Form ID not found in URL.';
      return;
    }

    try {
      const formRes = await getFormById(formId);
      uiMeta = formRes.data.form.meta;

      const res = await getBlocksByFormId(formId);
      blocks = res.data.blocks;
      blockNo = 0;

      console.log('Form loaded', formId, blocks);
    } catch (err) {
      errorMessage = 'Failed to load form. Please check the link.';
      console.error(err);
    }
  });

  setTimeout(() => { showSplash = false; }, 4000);

  const positions = { top: -500, bottom: 500 };

  let divState = $state({ visible: true, direction: 'top' });

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
      blockNo = blockNo + 1;
      divState = { ...divState, visible: false, direction: 'bottom' };
      setTimeout(() => { divState = { ...divState, visible: true }; }, 700);
    }
  }

  function previousBlock() {
    if (blockNo > 0) {
      blockNo = blockNo - 1;
      divState = { ...divState, visible: false, direction: 'top' };
      setTimeout(() => { divState = { ...divState, visible: true }; }, 700);
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
