<script>
  import { onMount } from 'svelte';
  import { authService } from '../services/authService.svelte.js';
  import {
    createForm,
    getFormsByUserId,
    deleteFormById,
    updateForm,
    updateFormSlug,
    duplicateFormById,
    getFormViews
  } from '../services/formService.js';
  const { state } = authService;

  import { Plus, FileText } from 'lucide-svelte';
  import { countResponsesByFormId } from '../services/responseService.js';
  import { DashboardDetail } from '../components/ui';
  import { Dialog, RenameDialog, RenameSlugDialog } from '../components/dialogs';
  import { openDialog } from '../utils/dialog.svelte.js';
  import { Navbar } from '../components/layouts';
  import { blockTemplates } from '../templates/blockTemplates';
  import { createBlock } from '../services/blockService';
  import { APP_URL } from '../utils/global.js';
  import { QRModal } from '../components/ui';
  import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

  // ---------------------
  // Helper: generate random slug
  // ---------------------
  function generateRandomUrl() {
    return uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: '-',
      length: 2,
      style: 'lowerCase'
    });
  }

  // ---------------------
  // QR Modal state
  // ---------------------
  let showQR = false;
  let qrText = "";

  function openQRModal(IdOrSlug) {
    qrText = APP_URL + `/v/${IdOrSlug}`;
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
  let formViewCounts = {};

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

  const userId = state.user.id;

  // ---------------------
  // Fetch forms on mount
  // ---------------------
  onMount(fetchForms);

  async function fetchForms() {
    if (!userId) return;

    const res = await getFormsByUserId(userId);
    forms = res.success ? res.data.forms : [];

    for (let form of forms) {
      await getResponseCountForForm(form.id);
      await getViewCountForForm(form.id);
    }
  }

  async function getResponseCountForForm(formId) {
    const { success, data } = await countResponsesByFormId(formId);
    formResponseCounts = {
      ...formResponseCounts,
      [formId]: success ? data.count : 0
    };
  }

  async function getViewCountForForm(formId) {
    const { success, data } = await getFormViews(formId);
    formViewCounts = {
      ...formViewCounts,
      [formId]: success ? data.views : 0
    };
  }

  // ---------------------
  // Form actions
  // ---------------------
  async function renameFormSlug(formId) {
    const formResult = await openDialog(
      'Rename Form Link',
      '',
      'Cancel',
      'Rename',
      RenameSlugDialog,
      { slugName: generateRandomUrl() }
    );

    const mySlugName = formResult.slugName;
    const res = await updateFormSlug(formId, mySlugName);
    if (res.success) fetchForms();
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

  // ---------------------
  // Sticky Lifetime Offer CTA
  // ---------------------
  let showCTA = true;
  const price = "$59"; // one-time payment
  let ctaText = `Lifetime Access – Only ${price}!`;
  let ctaSubText = "Grab this limited-time deal before it’s gone!";
  let countdown = "";

  // Set offer to end **today at 23:59:59**
  const now = new Date();
  const offerEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23, 59, 59
  ).getTime();

  function handleCTAClick() {
    window.open("https://fabform.io/pricing", "_blank");
  }

  // Countdown timer
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = offerEnd - now;

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

  let interval;
  onMount(() => {
    updateCountdown();
    interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  });
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

    <!-- Upgraded In-Page Buy/Upgrade Button -->
    <button
      on:click={handleCTAClick}
      class="bg-gradient-to-r from-pink-600 to-red-500 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 font-semibold flex items-center justify-center gap-2"
    >
      <span>Get Lifetime Access – Only $59!</span>
      <span class="text-xs bg-white/20 px-2 py-1 rounded uppercase font-bold">Limited Time</span>
      <span class="ml-2 text-xs font-semibold">{countdown}</span>
    </button>

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
          formViewCount={formViewCounts[form.id]}   
          onOpen={() => openFormLink(form.id)}
          onCopy={() => copyFormLink(form.id)}
          onRenameForm={() => renameForm(form.id)}
          onRenameFormSlug={() => renameFormSlug(form.id)}
          onDuplicate={() => duplicateForm(form.id)}
          onDelete={() => deleteForm(form.id)}
          onQRCode={() => openQRModal(form.slug || form.id)}
        />
      {/each}
    </div>
  {/if}
</div>

<!-- Sticky Lifetime Offer CTA -->
{#if showCTA}
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
