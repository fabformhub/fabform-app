<script>
  import { onMount } from 'svelte';
  import { authService } from '../services/authService.svelte.js';
  import {
    createForm,
    getFormsByUserId,
    deleteFormById,
    updateForm,
    duplicateFormById
  } from '../services/formService.js';
  import { goto } from '@mateothegreat/svelte5-router';
  import { Plus, FileText } from 'lucide-svelte';
  import { countResponsesByFormId } from '../services/responseService.js';
  import { DashboardDetail } from '../components/ui';
  import { Dialog, RenameDialog } from '../components/dialogs';
  import { openDialog } from '../utils/dialog.svelte.js';
  import { Navbar } from '../components/layouts';
  import { blockTemplates } from '../templates/blockTemplates';
  import { createBlock } from '../services/blockService';
  import { APP_URL } from '../utils/global.js';
  import { QRModal } from '../components/ui';

  // ---------------------
  // QR Modal state
  // ---------------------
  let showQR = false;
  let qrText = "";

  function openQRModal(formId) {
    qrText = APP_URL + `/v/${formId}`;
    showQR = true;
  }

  function closeQRModal() {
    showQR = false;
  }
  // ---------------------
  // Forms state
  // ---------------------
  let forms = [];
  let formResponseCounts = {};
  const { userSession } = authService; // reactive user session

  const uiMeta = {
    backgroundImage: '',
    backgroundColor: '#f9fafb',
    questionColor: '#1f2937',
    answerColor: '#374151',
    buttonColor: '#2563eb',
    buttonTextColor: '#ffffff',
    starRatingColor: '#facc15',
    font: 'Inter',
    logo: null,
    roundedCorner: true,
    fontSize: 'Medium'
  };

  // ---------------------
  // Fetch forms on mount
  // ---------------------
  onMount(fetchForms);

  async function fetchForms() {
    const userId = authService.userSession.user.id;
    if (!userId) return;

    const res = await getFormsByUserId(userId);
    forms = res.success ? res.data.forms : [];

    for (let form of forms) {
      await getResponseCountForForm(form.id);
    }
  }

  async function getResponseCountForForm(formId) {
    const { success, data } = await countResponsesByFormId(formId);
    formResponseCounts = {
      ...formResponseCounts,
      [formId]: success ? data.count : 0
    };
  }

  // ---------------------
  // Form actions
  // ---------------------
  async function renameFormLink(formId) {
    const result = await openDialog(
      'Rename form link',
      '',
      'Cancel',
      'Rename',
      RenameDialog,
      { name: 'my-form-link' }
    );
    if (result?.name?.trim()) {
      const res = await updateForm({ id: formId, link: result.name });
      if (res.success) fetchForms();
    }
  }

  async function renameForm(formId) {
    const result = await openDialog(
      'Rename form',
      '',
      'Cancel',
      'Rename',
      RenameDialog,
      { name: 'Untitled' }
    );
    if (result?.name?.trim()) {
      const res = await updateForm({ id: formId, name: result.name });
      if (res.success) fetchForms();
    }
  }

  async function deleteForm(formId) {
    const result = await openDialog(
      'Delete Confirmation',
      'Are you sure you want to delete this form?',
      'No, keep it',
      'Yes, delete it'
    );
    if (result) {
      const res = await deleteFormById(formId);
      if (res.success) await fetchForms();
    }
  }

  async function createNewForm() {
    const userId = userSession.user?.id;
    if (!userId) return console.error("User ID missing");

    const formData = { name: "Untitled Form", user_id: userId, meta: { ...uiMeta } };
    const res = await createForm(formData);
    if (res.success) {
      await fetchForms();
      const formId = res.data.id;
      await createBlock(formId, blockTemplates[0]);
      await createBlock(formId, blockTemplates[blockTemplates.length - 1]);
    }
  }

  function copyFormLink(id) {
    navigator.clipboard.writeText(APP_URL + `/v/${id}`);
  }

  function openFormLink(id) {
    goto(`/v/${id}`);
  }

  async function duplicateForm(formId) {
    const { success, data } = await duplicateFormById(formId);
    if (success) {
      await openDialog('Form Duplicated', 'Your form was successfully duplicated.', 'Close', null);
      fetchForms();
    } else {
      await openDialog('Duplicate Failed', 'Failed to duplicate form: ' + (data?.error || 'Unknown error'), 'Close', null);
    }
  }
</script>

<Navbar />

<div class="p-6 bg-gray-50 text-black min-h-screen">
  <Dialog />

  <!-- QR Modal -->
  {#if showQR}
    <QRModal open={showQR} text={qrText} onClose={closeQRModal} />
  {/if}

  <!-- Header -->
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">My Forms</h1>
    <button
      on:click={createNewForm}
      class="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-neutral-800 transition"
    >
      <Plus class="w-5 h-5" />
      <span>New Form</span>
    </button>
  </div>

  <!-- No forms placeholder -->
  {#if forms.length === 0}
    <div class="flex flex-col items-center justify-center py-20 bg-gray-100 rounded-lg text-center space-y-4">
      <FileText class="w-16 h-16 text-gray-400" />
      <h2 class="text-xl font-semibold text-gray-700">No forms created yet</h2>
      <p class="text-gray-500">Start by creating a new form to get started.</p>
      <button
        on:click={createNewForm}
        class="bg-black text-white px-6 py-2 rounded-xl hover:bg-neutral-800 transition"
      >
        Create New Form
      </button>
    </div>
  {:else}
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {#each forms as form}
        <DashboardDetail
          form={form}
          responseCount={formResponseCounts[form.id]}
          onOpen={() => openFormLink(form.id)}
          onCopy={() => copyFormLink(form.id)}
          onRenameForm={() => renameForm(form.id)}
          onRenameFormLink={() => renameFormLink(form.id)}
          onDuplicate={() => duplicateForm(form.id)}
          onDelete={() => deleteForm(form.id)}
          onQRCode={() => openQRModal(form.id)}
        />
      {/each}
    </div>
  {/if}
</div>
