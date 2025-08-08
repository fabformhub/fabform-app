<script>
  import { onMount } from 'svelte';
  import {
    createForm,
    getFormsByUserId,
    deleteFormById,
    updateForm,
    duplicateFormById
  } from '../services/formService.js';
  import { authService } from '../services/authService.svelte.js';
  import { goto } from '@mateothegreat/svelte5-router';
  import { Plus, FileText } from 'lucide-svelte';
  import { countResponsesByFormId } from '../services/responseService.js';
  import { FormCard } from '../components/ui';
  import { Dialog, RenameDialog } from '../components/dialogs';
  import { openDialog } from '../utils/dialog.svelte.js';
  import { Navbar } from '../components/layouts';
  import { blockTemplates } from '../templates/blockTemplates';
  import { createBlock } from '../services/blockService';
  
  let forms = [];
  let formResponseCounts = {};
  const { state } = authService;

  const uiMeta = {
  backgroundImage: '',
  backgroundColor: '#f9fafb',         // Light gray (soft, modern base)
  questionColor: '#1f2937',           // Slate-900 – deep readable gray
  answerColor: '#374151',             // Slate-700 – subtle but clear
  buttonColor: '#2563eb',             // Blue-600 – modern call-to-action
  buttonTextColor: '#ffffff',         // White – best contrast on blue
  starRatingColor: '#facc15',         // Amber-400 – warm, vibrant star
  font: 'Inter',                      // Clean sans-serif font
  logo: null,
  roundedCorner: true,
  fontSize: 'Medium'
};

  onMount(fetchForms);

  async function fetchForms() {
    const userId = state.user?.id;
    if (!userId) return;

    const res = await getFormsByUserId(userId);
    forms = res.success ? res.data.forms : [];

    for (let form of forms) {
      await getResponseCountForForm(form.id);
    }
  }

  async function getResponseCountForForm(formId) {
    const { success, data } = await countResponsesByFormId(formId);
    formResponseCounts[formId] = success ? data.count : 0;
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

    if (result && result.name) {
      const response = await updateForm({ id: formId, name: result.name });
      if (response.success) {
        fetchForms();
      }
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
      if (res.success) {
        await fetchForms();
      }
    }
  }

async function createNewForm() {
  const userId = state.user?.id;

  if (!userId) {
    console.error("User ID is missing");
    return;
  }

  const formData = {
    name: "Untitled Form",
    user_id: userId,
    meta: { ...uiMeta },
  };

  const res = await createForm(formData);

  if (res.success) {
    await fetchForms();
    const formId = res.data.id;

    if (blockTemplates[0]) {
      await createBlock(formId, blockTemplates[0]);
    } else {
      console.warn("blockTemplates[0] is undefined.");
    }
  } else {
    console.error("Failed to create form:", res.error);
  }
}

  function copyFormLink(id) {
    const link = `/v/${id}`;
    navigator.clipboard.writeText(link);
  }

  function openFormLink(id) {
    goto(`/v/${id}`);
  }

  async function duplicateForm(formId) {
    const { success, data } = await duplicateFormById(formId);
    if (success) {
      alert('Form duplicated successfully!');
      fetchForms();
    } else {
      alert('Failed to duplicate form: ' + data.error);
    }
  }
</script>

<Navbar />

<!-- Forms UI -->
<div class="p-6 bg-white text-black min-h-screen">
  <Dialog />

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
        <FormCard
          form={form}
          responseCount={formResponseCounts[form.id]}
          onOpen={() => openFormLink(form.id)}
          onCopy={() => copyFormLink(form.id)}
          onRename={() => renameForm(form.id)}
          onDuplicate={() => duplicateForm(form.id)}
          onDelete={() => deleteForm(form.id)}
        />
      {/each}
    </div>
  {/if}
</div>
