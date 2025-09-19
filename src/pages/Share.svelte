<script>
  import { CopyLinkButton, Toast } from '../components/ui';
  import { Clipboard } from 'lucide-svelte';
  import { tooltip } from '../utils/tooltip.js';
  import { DefaultLayout } from '../components/layouts/';
  import { APP_URL } from '../utils/global.js';

  // Props
  let { route } = $props();

  // States
  let formId = $state(route?.result?.path?.params?.id ?? '');
  let embedChoice = $state('Inline Embed');
  let showToast = $state(false);
  let dropdownOpen = $state(false);

  // Derived states
  let url = $derived.by(() => `${APP_URL}/v/${formId}`);

  let embedCode = $derived.by(() => {
    switch (embedChoice) {
      case 'Inline Embed':
        return `<iframe src="${url}" style="width:100%; height:300px;" frameborder="0"></iframe>`;
      case 'Popup':
        return `<button onclick="window.open('${url}', '_blank', 'width=600,height=400')">Open Form</button>`;
      case 'Fullpage':
        return `<a href="${url}" target="_blank">Go to Fullpage Form</a>`;
      default:
        return '';
    }
  });

  // Copy handler
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(embedCode);
      showToast = true;
      setTimeout(() => (showToast = false), 3000);
    } catch (err) {
      console.error('[COPY] failed', err);
    }
  }
</script>

<DefaultLayout bind:formId={formId} activeMenuLabel="Share">
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
    <div class="w-full max-w-4xl space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-200">

      <!-- Link + Copy -->
      <div class="flex flex-col space-y-4 items-center md:items-start">
        <div class="w-full flex flex-col md:flex-row md:items-center md:space-x-2 space-y-2 md:space-y-0">
          <input
            class="w-full md:w-80 px-3 py-2 rounded-md border border-gray-300 text-gray-800 text-sm"
            type="text"
            readonly
            value={url}
          />
          <CopyLinkButton link={url} />
        </div>

        <!-- Hardcoded Dropdown -->
        <div class="relative inline-block text-left">
          <button
            class="inline-flex justify-between w-40 rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none"
            on:click={() => (dropdownOpen = !dropdownOpen)}
          >
            {embedChoice}
            <svg class="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 8l4 4 4-4" />
            </svg>
          </button>

          {#if dropdownOpen}
            <div class="absolute mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
              <div class="py-1">
                {#each ['Inline Embed', 'Popup', 'Fullpage'] as choice}
                  <button
                    class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    on:click={() => { embedChoice = choice; dropdownOpen = false; }}
                  >
                    {choice}
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Embed Code Display -->
      <div class="relative bg-gray-900 rounded-lg p-4 text-sm font-mono text-white overflow-auto max-h-[300px]">
        <pre class="whitespace-pre-wrap break-all">{embedCode}</pre>
        <button
          use:tooltip={{ text: 'Copy code', position: 'bottom' }}
          class="absolute bottom-2 right-2 p-1 rounded hover:bg-gray-700 transition"
          aria-label="Copy code"
          on:click={copyCode}
        >
          <Clipboard class="w-5 h-5 text-white" />
        </button>
      </div>
    </div>

  <!-- Toast -->
{#if showToast}
  <div class="mt-10">
    <Toast message="Code Copied!" type="success" />
  </div>
{/if}
  </div>
</DefaultLayout>
