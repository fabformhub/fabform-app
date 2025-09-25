<script>
  import { onMount } from 'svelte';
  import { authService } from '../services/authService.svelte.js';
  import { getProfileByUserId } from '../services/profileService.js';
  import {
    createForm,
    getFormsByUserId,
    deleteFormById,
    updateForm,
    updateFormSlug,
    duplicateFormById,
    getFormViews
  } from '../services/formService.js';
  import { countResponsesByFormId } from '../services/responseService.js';
  import { createBlock } from '../services/blockService.js';
  import { DashboardDetail } from '../components/ui';
  import { Dialog, RenameDialog, RenameSlugDialog, QRCodeDialog } from '../components/dialogs';
  import { Navbar } from '../components/layouts';
  import { openDialog } from '../utils/dialog.svelte.js';
  import { blockTemplates } from '../templates/blockTemplates';
  import { APP_URL } from '../utils/global.js';
  import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
  import { Plus, FileText } from 'lucide-svelte';

  const { state: authState } = authService;
  const userId = authState.user?.id;

  // ----------------------
  // Reactive state
  // ----------------------
  let profile = $state(null);
  let isPaid = $state(false);
  let forms = [];
  let formResponseCounts = {};
  let formViewCounts = {};
  let showCTA = true;
  let countdown = "";

  const price = "$59"; 
  const ctaText = `Lifetime Access – Only ${price}!`;
  const ctaSubText = "Grab this limited-time deal before it’s gone!";

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

  const offerEnd = new Date();
  offerEnd.setHours(23, 59, 59, 999);

  // ----------------------
  // Helpers
  // ----------------------
  function generateRandomUrl() {
    return uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: '-',
      length: 2,
      style: 'lowerCase'
    });
  }

  function handleCTAClick() {
    window.open("https://fabform.io/pricing", "_blank");
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = offerEnd.getTime() - now;

    if (distance <= 0) {
      countdown = "Offer expired";
      showCTA = false;
      return;
    }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdown = `${hours}h ${minutes}m ${seconds}s`;
  }

  // ----------------------
  // Fetch profile and forms
  // ----------------------
  async function fetchProfile() {
    if (!userId) return;


    const res = await getProfileByUserId(userId);
    if (res.success) {
      profile = res.profile;
      isPaid = profile?.is_paid ?? false;
    
    } else {
      profile = null;
      isPaid = false;
      console.warn('Failed to fetch profile', res.error);
    }
  }

  async function fetchForms() {
    if (!userId) return;

    const res = await getFormsByUserId(userId);
    forms = res.success ? res.data.forms : [];

    for (let form of forms) {
      await fetchFormCounts(form.id);
    }
  }

  async function fetchFormCounts(formId) {
    const respRes = await countResponsesByFormId(formId);
    formResponseCounts[formId] = respRes.success ? respRes.data.count : 0;

    const viewRes = await getFormViews(formId);
    formViewCounts[formId] = viewRes.success ? viewRes.data.views : 0;
  }

  // ----------------------
  // Form actions
  // ----------------------
  async function renameForm(formId) {
    const result = await openDialog('Rename form', '', 'Cancel', 'Rename', RenameDialog, { name: 'Untitled' });
    if (result?.name?.trim()) {
      const res = await updateForm({ id: formId, name: result.name });
      if (res.success) await fetchForms();
    }
  }

  async function renameFormSlug(formId) {
    const result = await openDialog(
      'Rename Form Link',
      '',
      'Cancel',
      'Rename',
      RenameSlugDialog,
      { slugName: generateRandomUrl() }
    );
    if (result?.slugName) {
      const res = await updateFormSlug(formId, result.slugName);
      if (res.success) await fetchForms();
    }
  }

  async function deleteForm(formId) {
    const result = await openDialog('Delete Confirmation', 'Are you sure you want to delete this form?', 'No, keep it', 'Yes, delete it');
    if (result) {
      const res = await deleteFormById(formId);
      if (res.success) await fetchForms();
    }
  }

  async function createNewForm() {
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
    window.location.href = APP_URL + `/v/${id}`;
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

  // ----------------------
  // Initialize
  // ----------------------
  onMount(() => {
    fetchProfile();
    fetchForms();
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  });
</script>

<Navbar />

<div class="p-6 bg-gray-50 text-black min-h-screen">
  <Dialog />

  <!-- Header -->
  <div class="flex justify-between items-center mb-6">
    <div>
      <h1 class="text-2xl font-bold">My Forms</h1>
      

        <span class={`px-3 py-1 rounded-full text-sm font-semibold ${isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {isPaid ? 'Lifetime Plan User' : 'Trial User'}
        </span>

    </div>

    <div class="flex gap-4">
      {#if !isPaid}
      <button
        on:click={handleCTAClick}
        class="bg-gradient-to-r from-pink-600 to-red-500 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 font-semibold flex items-center justify-center gap-2"
      >
        <span>Get Lifetime Access – Only $59!</span>
        <span class="text-xs bg-white/20 px-2 py-1 rounded uppercase font-bold">Limited Time</span>
        <span class="ml-2 text-xs font-semibold">{countdown}</span>
      </button>
     {/if}
      <button
        on:click={createNewForm}
        class="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-neutral-800 transition"
      >
        <Plus class="w-5 h-5" />
        <span>New Form</span>
      </button>
    </div>
  </div>

  <!-- No forms placeholder -->
  {#if forms.length === 0}
    <div class="flex flex-col items-center justify-center py-20 bg-gray-100 rounded-lg text-center space-y-4">
      <FileText class="w-16 h-16 text-gray-400" />
      <h2 class="text-xl font-semibold text-gray-700">No forms created yet</h2>
      <p class="text-gray-500">Start by creating a new form to get started.</p>
      <button on:click={createNewForm} class="bg-black text-white px-6 py-2 rounded-xl hover:bg-neutral-800 transition">
        Create New Form
      </button>
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
          onRenameFormSlug={() => renameFormSlug(form.id)}
          onDuplicate={() => duplicateForm(form.id)}
          onDelete={() => deleteForm(form.id)}
          onQRCode={() =>
            openDialog('QR Code', '', 'Close', null, QRCodeDialog, { text: APP_URL + `/v/${form.slug || form.id}` })
          }
        />
      {/each}
    </div>
  {/if}
</div>

<!-- Sticky Lifetime Offer CTA -->
{#if showCTA && !isPaid}
  <div
    class="fixed bottom-6 right-6 bg-gradient-to-r from-pink-600 to-red-500 text-white px-6 py-4 rounded-xl shadow-lg cursor-pointer animate-bounce z-50 max-w-xs hover:scale-105 transition-transform duration-300"
    on:click={handleCTAClick}
  >
    <div class="font-bold text-lg">{ctaText}</div>
    <div class="text-sm mt-1">{ctaSubText}</div>
    <div class="mt-2 text-xs uppercase tracking-wide bg-white/20 px-2 py-1 rounded font-semibold">
      Limited Offer – Ends Today in {countdown}
    </div>
    <div class="mt-2 text-sm font-semibold">
      Don’t miss your chance to lock in lifetime access before it goes back to $30/month!
    </div>
  </div>
{/if}
