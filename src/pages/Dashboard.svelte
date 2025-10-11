<script>
  import { onMount } from 'svelte';
  import { authService } from '../services/authService.svelte.js';
  import {
    createForm,
    getFormsByUserId,
    deleteFormById,
    updateForm,
    duplicateFormById,
    getFormViews
  } from '../services/formService.js';
  import { countResponsesByFormId } from '../services/responseService.js';
  import { createBlock } from '../services/blockService.js';
  import { DashboardDetail } from '../components/ui';
  import { Dialog, RenameDialog, QRCodeDialog } from '../components/dialogs';
  import { Navbar } from '../components/layouts';
  import { openDialog } from '../utils/dialog.svelte.js';
  import { blockTemplates } from '../templates/blockTemplates';
  import { APP_URL } from '../utils/global.js';
  import { Plus, FileText } from 'lucide-svelte';

  let user = null;
  let forms = [];
  let formResponseCounts = {};
  let formViewCounts = {};
  let formError = "";
  let isUserPaid = false;

  async function loadUser() {
    user = authService.state.user || await authService.getUser();
    if (user) {
      isUserPaid = user.user_metadata?.isPaid ?? false;
      await loadForms();
    }
  }

  async function loadForms() {
    if (!user) return;
    try {
      const res = await getFormsByUserId(user.id);
      forms = res.success && Array.isArray(res.data.forms) ? res.data.forms : [];
      
      // Load counts
      await Promise.all(forms.map(async form => {
        const respRes = await countResponsesByFormId(form.id);
        formResponseCounts[form.id] = respRes.success ? respRes.data.count : 0;

        const viewRes = await getFormViews(form.id);
        formViewCounts[form.id] = viewRes.success ? viewRes.data.views : 0;
      }));

    } catch (err) {
      formError = "Failed to load forms";
      forms = [];
    }
  }

  async function createNewForm() {
    formError = "";
    if (!user) {
      formError = "User not loaded yet";
      return;
    }

    const formData = { name: "Untitled Form", user_id: user.id, meta: {} };
    try {
      const res = await createForm(formData);
      if (res.success) {
        const formId = res.data.id;
        await createBlock(formId, blockTemplates[0]);
        await createBlock(formId, blockTemplates[blockTemplates.length - 1]);
        await loadForms();
      } else {
        formError = res.data?.error || "Failed to create form";
      }
    } catch (err) {
      formError = err.message || "Error creating form";
    }
  }

  function openFormLink(id) {
    window.location.href = APP_URL + `/v/${id}`;
  }

  function copyFormLink(id) {
    navigator.clipboard.writeText(APP_URL + `/v/${id}`);
  }

  async function renameForm(formId) {
    const result = await openDialog('Rename form', '', 'Cancel', 'Rename', RenameDialog, { name: 'Untitled' });
    if (result?.name?.trim()) {
      const res = await updateForm({ id: formId, name: result.name });
      if (res.success) await loadForms();
    }
  }

  async function deleteForm(formId) {
    const result = await openDialog('Delete Confirmation', 'Are you sure?', 'Cancel', 'Delete');
    if (result) {
      const res = await deleteFormById(formId);
      if (res.success) await loadForms();
    }
  }

  async function duplicateForm(formId) {
    const { success } = await duplicateFormById(formId);
    if (success) await loadForms();
  }

  onMount(loadUser);
</script>

<Navbar />

<div class="p-6 min-h-screen bg-gray-50 text-black">
  <Dialog />

  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">My Forms</h1>
    <button onclick={createNewForm} class="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-neutral-800 transition">
      <Plus class="w-5 h-5"/>
      New Form
    </button>
  </div>

  {#if formError}
    <div class="mb-4 p-4 bg-red-100 text-red-800 rounded">{formError}</div>
  {/if}

  {#if forms.length === 0}
    <div class="flex flex-col items-center justify-center py-20 bg-gray-100 rounded-lg text-center space-y-4">
      <FileText class="w-16 h-16 text-gray-400"/>
      <h2 class="text-xl font-semibold text-gray-700">No forms created yet</h2>
      <p class="text-gray-500">Click "New Form" to get started.</p>
    </div>
  {:else}
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {#each forms as form}
        <DashboardDetail
          form={form}
          responseCount={formResponseCounts[form.id]}
          formViewCount={formViewCounts[form.id]}
          onOpen={() => openFormLink(form.id)}
          onCopy={() => copyFormLink(form.id)}
          onRenameForm={() => renameForm(form.id)}
          onDelete={() => deleteForm(form.id)}
          onDuplicate={() => duplicateForm(form.id)}
        />
      {/each}
    </div>
  {/if}
</div>
