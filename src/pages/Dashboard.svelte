<script>
  import { onMount } from 'svelte';
  import { authService } from '$lib/services/authService.svelte.js';
  import { checkUserSubscribed } from '$lib/services/subscriptionService.js';
  import { createForm, getFormsByUserId, deleteFormById, updateForm, updateFormSlug, duplicateFormById, getFormViews, createBlock } from '$lib/services/formService.js';
  import { countResponsesByFormId } from '$lib/services/responseService.js';
  import { DashboardDetail } from '$lib/fabform/ui';
  import { Dialog, RenameDialog, RenameSlugDialog, QRCodeDialog } from '$lib/fabform/dialogs';
  import { Navbar } from '$lib/fabform/layouts';
  import { openDialog } from '$lib/utils/dialog.svelte.js';
  import { blockTemplates } from '$lib/utils/blockTemplates';
  import { APP_URL } from '$lib/utils/global.js';
  import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
  import { Plus, FileText } from 'lucide-svelte';
  import { formMeta } from '$lib/fabform/constants/formMeta.js';

  let forms = [];
  let formResponseCounts = {};
  let formViewCounts = {};

  let userId = null;
  let isUserPaid = false;

  let countdown = "";
  let showUpgrade = true;

  const offerEnd = new Date();
  offerEnd.setHours(23, 59, 59, 999);

  const price = "$99";

  // -----------------------------
  // EXPERIENCE LAYER (IMPORTANT)
  // -----------------------------
  const isTrial = () => !isUserPaid;

  const uiMeta = {
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    fontFamily: 'Inter',
    fontSize: '16px'
  };

  function generateRandomUrl() {
    return uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: '-',
      length: 2
    });
  }

  function updateCountdown() {
    const diff = offerEnd.getTime() - Date.now();

    if (diff <= 0) {
      countdown = "Expired";
      showUpgrade = false;
      return;
    }

    const h = Math.floor(diff / 3.6e6);
    const m = Math.floor((diff % 3.6e6) / 6e4);
    const s = Math.floor((diff % 6e4) / 1000);

    countdown = `${h}h ${m}m ${s}s`;
  }

  function handleUpgrade() {
    window.open("https://fabform.io/pricing", "_blank");
  }

  function copyFormLink(id) {
    navigator.clipboard.writeText(APP_URL + `/v/${id}`);
  }

  function openFormLink(id) {
    window.open(`${APP_URL}/v/${id}`, "_blank");
  }

  async function fetchForms() {
    if (!userId) return;

    const res = await getFormsByUserId(userId);
    forms = res.success ? res.data.forms : [];

    for (let form of forms) {
      const r = await countResponsesByFormId(form.id);
      formResponseCounts[form.id] = r?.data?.count ?? 0;

      const v = await getFormViews(form.id);
      formViewCounts[form.id] = v?.data?.views ?? 0;
    }
  }

  async function createNewForm() {
    const res = await createForm({
      name: "Untitled Form",
      user_id: userId,
      meta: formMeta 
    });

    if (!res.success) return;

    const formId = res.data.id;

    await createBlock(formId, blockTemplates[0]);
    await createBlock(formId, blockTemplates.at(-1));

    await fetchForms();
  }

  async function renameForm(formId) {
    const result = await openDialog('Rename form', '', 'Cancel', 'Rename', RenameDialog, { name: 'Untitled' });
    if (!result?.name) return;

    await updateForm({ id: formId, name: result.name });
    await fetchForms();
  }

  async function renameFormSlug(formId) {
    const result = await openDialog('Rename link', '', 'Cancel', 'Rename', RenameSlugDialog, { slugName: generateRandomUrl() });
    if (!result?.slugName) return;

    await updateFormSlug(formId, result.slugName);
    await fetchForms();
  }

  async function deleteForm(formId) {
    const ok = await openDialog('Delete form', 'This action cannot be undone.', 'Cancel', 'Delete');
    if (!ok) return;

    await deleteFormById(formId);
    await fetchForms();
  }

  async function duplicateForm(formId) {
    await duplicateFormById(formId);
    await fetchForms();
  }

  onMount(async () => {
    await authService.getUser();
    const user = authService.state.user;

    if (!user) return;

    userId = user.id;

    const email = user.email;

    if (email) {
      const res = await checkUserSubscribed(email);
      if (res.success && res.data?.subscribed) {
        isUserPaid = true;
        showUpgrade = false;
      }
    }

    await fetchForms();
    updateCountdown();
    const i = setInterval(updateCountdown, 1000);
    return () => clearInterval(i);
  });
</script>

<Navbar />

<div class="min-h-screen bg-gray-50 text-gray-900 px-8 py-8">

  <Dialog />

  <!-- ================= HEADER (clean hierarchy) ================= -->
  <div class="flex justify-between items-end mb-8">

    <div>
      <h1 class="text-2xl font-medium tracking-tight">My Forms</h1>
      <p class="text-sm text-gray-500 mt-1">
        Build and publish forms that convert
      </p>

      <div class="mt-3 flex items-center gap-2 text-xs text-gray-500">
        <span class="w-2 h-2 rounded-full bg-gray-400"></span>
        <span>{isUserPaid ? "Active workspace" : "Trial experience"}</span>
      </div>
    </div>

    <div class="flex items-center gap-3">

      {#if !isUserPaid}
        <button
          on:click={handleUpgrade}
          class="px-4 py-2 rounded-xl text-sm border border-gray-200 bg-white hover:border-gray-300 transition"
        >
          Upgrade {price}
        </button>
      {/if}

      <button
        on:click={createNewForm}
        class="flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white hover:scale-[1.02] transition"
      >
        <Plus class="w-4 h-4" />
        New Form
      </button>

    </div>

  </div>

  <!-- ================= TRIAL SYSTEM BAR (subtle, premium) ================= -->
  {#if isTrial()}
    <div class="mb-6 px-4 py-3 rounded-xl border border-gray-200 bg-white flex items-center justify-between">

      <div class="flex items-center gap-3">
        <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>

        <div>
          <div class="text-sm font-medium">
            Trial experience active
          </div>
          <div class="text-xs text-gray-500">
            Everything is fully available — upgrade anytime to keep your workspace
          </div>
        </div>
      </div>

      <button
        on:click={handleUpgrade}
        class="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:border-gray-300 transition"
      >
        {countdown}
      </button>

    </div>
  {/if}

  <!-- ================= EMPTY STATE ================= -->
  {#if forms.length === 0}

    <div class="flex flex-col items-center justify-center py-32 text-center">

      <div class="text-5xl mb-5 animate-breathe">✨</div>

      <h2 class="text-lg font-medium">Your workspace is ready</h2>

      <p class="text-sm text-gray-500 max-w-md mt-2">
        {isTrial()
          ? "Start building your first form. Everything is unlocked in this experience."
          : "Create your first form to get started."}
      </p>

      <button
        on:click={createNewForm}
        class="mt-6 px-5 py-2 rounded-xl bg-black text-white text-sm hover:scale-[1.03] transition"
      >
        Create your first form
      </button>

    </div>

  {:else}

    <!-- ================= GRID ================= -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

      {#each forms as form (form.id)}
        <div class="transition hover:-translate-y-1 hover:shadow-md duration-200">
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
              openDialog('QR Code', '', 'Close', null, QRCodeDialog, {
                text: APP_URL + `/v/${form.slug || form.id}`
              })
            }
          />
        </div>
      {/each}

    </div>

  {/if}

</div>

<!-- ================= FLOATING CONVERSION CTA ================= -->
{#if isTrial() && showUpgrade}
  <div
    on:click={handleUpgrade}
    class="fixed bottom-6 right-6 max-w-xs p-4 rounded-xl bg-white border border-gray-200 shadow-lg cursor-pointer hover:shadow-xl transition"
  >
    <div class="text-sm font-medium">Unlock lifetime access {price}</div>
    <div class="text-xs text-gray-500 mt-1">
      Keep everything you build — no subscription
    </div>
    <div class="text-xs text-gray-400 mt-3">
      Ends in {countdown}
    </div>
  </div>
{/if}

<style>
@keyframes breathe {
  0%,100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.06); opacity: 1; }
}
.animate-breathe {
  animation: breathe 6s ease-in-out infinite;
}
</style>
