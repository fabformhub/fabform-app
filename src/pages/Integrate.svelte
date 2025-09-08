<!-- Integrations.svelte - Svelte 5 mockup for a paid "Integrations" page
     Simplified layout without search, with a complementary palette.
     Drop this into a Svelte 5 + Tailwind project for a visual prototype.
-->
<script>
  let showPreview = false;

  const integrations = [
    { id: 'slack', name: 'Slack', description: 'Send form responses to Slack channels.', badge: 'Paid', logo: 'S' },
    { id: 'google-sheets', name: 'Google Sheets', description: 'Log submissions to a spreadsheet.', badge: 'Paid', logo: 'G' },
    { id: 'zapier', name: 'Zapier', description: 'Connect to 5,000+ apps via Zapier.', badge: 'Paid', logo: 'Z' },
    { id: 'mailchimp', name: 'Mailchimp', description: 'Sync subscribers from responses.', badge: 'Paid', logo: 'M' },
    { id: 'webhook', name: 'Webhooks', description: 'Real-time POSTs on new submissions.', badge: 'Paid', logo: 'W' },
    { id: 'notion', name: 'Notion', description: 'Create pages for each response.', badge: 'Paid', logo: 'N' },
  ];

  function openPaidCTA(name) {
    showPreview = true;
  }
</script>

<div class="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 p-8 font-sans">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <header class="flex items-center justify-between mb-10">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">FB</div>
        <div>
          <h1 class="text-3xl font-extrabold leading-tight text-slate-800">Integrations</h1>
          <p class="text-sm text-slate-500">Connect your forms to tools you already use — available on paid plans.</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <a href="https://fabform.io/pricing/" target="_blank" class="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:brightness-95">Upgrade</a>
      </div>
    </header>

    <!-- Grid -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each integrations as integ}
        <article class="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-600">{integ.logo}</div>
            <div class="flex-1">
              <div class="flex items-center justify-between gap-2">
                <h3 class="text-lg font-semibold text-slate-800">{integ.name}</h3>
                <span class="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700">{integ.badge}</span>
              </div>
              <p class="text-sm text-slate-500 mt-1">{integ.description}</p>

              <div class="mt-4 flex items-center gap-3">
                <button on:click={() => openPaidCTA(integ.name)} class="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm shadow">Connect</button>
                <button class="px-3 py-2 rounded-lg border text-sm text-slate-600">Learn</button>
              </div>
            </div>
          </div>

          <!-- Paid ribbon -->
          <div class="absolute -bottom-3 left-4 px-3 py-1 rounded-full text-xs bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg">Paid feature</div>
        </article>
      {/each}
    </section>

    <!-- CTA / Pricing blurb -->
    <footer class="mt-12 bg-white rounded-2xl p-8 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <h4 class="text-xl font-semibold text-slate-800">Integrations are part of Pro</h4>
        <p class="text-sm text-slate-500">Connect to Slack, Sheets, Zapier and more. Upgrade to unlock live integrations and automated workflows.</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="text-2xl font-extrabold text-slate-800">$59 <span class="text-base font-medium">lifetime deal</span></div>
        <a href="https://fabform.io/pricing/" target="_blank" class="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow">Upgrade now</a>
      </div>
    </footer>
  </div>

  <!-- Modal (visual only) -->
  {#if showPreview}
    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="w-full max-w-2xl bg-white rounded-2xl p-8 shadow-2xl relative">
        <button on:click={() => (showPreview = false)} class="absolute right-4 top-4 text-slate-500">✕</button>
        <div class="flex gap-6">
          <div class="w-24 h-24 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center text-3xl font-bold">FB</div>
          <div>
            <h3 class="text-xl font-bold text-slate-800">Upgrade to Pro to connect integrations</h3>
            <p class="text-sm text-slate-500 mt-1">This mockup demonstrates the paid-flow. In the live app you would be redirected to billing and then to an OAuth / connection screen.</p>
            <div class="mt-4 flex items-center gap-3">
              <a href="https://fabform.io/pricing/" target="_blank" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">Upgrade for $59 lifetime deal</a>
              <button class="px-4 py-2 border rounded-lg text-slate-600">Contact sales</button>
            </div>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 border rounded-lg">
            <div class="text-xs text-slate-500">What you get</div>
            <ul class="mt-2 text-sm text-slate-700 list-disc list-inside">
              <li>Unlimited integrations</li>
              <li>Priority support</li>
              <li>Team shared credentials</li>
            </ul>
          </div>
          <div class="p-4 border rounded-lg">
            <div class="text-xs text-slate-500">Billing</div>
            <div class="mt-2 text-sm text-slate-700">
              One-time payment of $59 for a lifetime deal. Upgrade instantly, no code required.
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  :global(body) { background: transparent; }
</style>
