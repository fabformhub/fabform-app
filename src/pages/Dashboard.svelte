<script>
  import { onMount } from 'svelte';
  import { authService } from '../services/authService.svelte.js';
  import {
    getFormsByUserId,
    createForm,
    updateForm,
    deleteFormById,
    duplicateFormById
  } from '../services/formService.js';
  import { countResponsesByFormId } from '../services/responseService.js';
  import { createBlock } from '../services/blockService.js';
  import { blockTemplates } from '../templates/blockTemplates';
  import { APP_URL } from '../utils/global.js';
  import { goto } from '@mateothegreat/svelte5-router';
  import { QRModal } from '../components/ui';
  import { Navbar} from '../components/layouts';
  import { FormCard} from '../components/ui';
  import { Dialog } from '../components/dialogs';

  // user info
  const user = authService.state.user || {};
  const userId = user.id;

  // form data
  let forms = [];
  let formResponseCounts = {};

  // QR Modal state
  let qrOpen = false;
  let qrText = "";

  const qrModalOnClose = () => qrOpen = false;

  // fetch forms and response counts
  async function fetchForms() {
    if (!userId) return;
    const res = await getFormsByUserId(userId);
    forms = res.success ? res.data.forms : [];

    for (let form of forms) {
      const { success, data } = await countResponsesByFormId(form.id);
      formResponseCounts[form.id] = success ? data.count : 0;
    }
  }

  onMount(fetchForms);

  // form actions
  async function createNewForm() {
    if (!userId) return console.error("User ID missing");

    const formData = { name: "Untitled Form", user_id: userId, meta: {} };
    const res = await createForm(formData);

    if (res.success) {
      await fetchForms();
      const formId = res.data.id;

      if (blockTemplates[0]) {
        await createBlock(formId, blockTemplates[0]);
        await createBlock(formId, blockTemplates[19]);
      }
    }
  }

  async function deleteForm(formId) {
    const res = await deleteFormById(formId);
    if (res.success) await fetchForms();
  }

  async function duplicateForm(formId) {
    const res = await duplicateFormById(formId);
    if (res.success) await fetchForms();
  }

  async function renameForm(formId, newName) {
    const res = await updateForm({ id: formId, name: newName });
    if (res.success) await fetchForms();
  }

  function showQrModal(url) {
    qrText = url;
    qrOpen = true;
  }
</script>

<Navbar />

<div class="p-6 bg-white text-black min-h-screen">
  <Dialog />

  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">My Forms</h1>
    <button
      on:click={createNewForm}
      class="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-neutral-800 transition"
    >
      New Form
    </button>
  </div>

  {#if forms.length === 0}
    <p>No forms yet. Create one to get started!</p>
  {:else}
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {#each forms as form}
        <FormCard
          form={form}
          responseCount={formResponseCounts[form.id]}
          onOpen={() => goto(APP_URL + `/v/${form.id}`)}
          onCopy={() => navigator.clipboard.writeText(APP_URL + `/v/${form.id}`)}
          onRename={(newName) => renameForm(form.id, newName)}
          onDuplicate={() => duplicateForm(form.id)}
          onDelete={() => deleteForm(form.id)}
          onQRCode={()=> showQrModal(APP_URL + `/v/${form.id}`)}
        >
        </FormCard>

      {/each}
    </div>
  {/if}

  {#if qrOpen}
  <QRModal open={qrOpen} text={qrText} onClose={qrModalOnClose} />
{/if}

</div>
