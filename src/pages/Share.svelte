<script>
  import { CopyLinkButton, Dropdown, Toast } from '../components/ui';
  import { Clipboard } from 'lucide-svelte';
  import { tooltip } from '../utils/tooltip.js';
  import { DefaultLayout } from '../components/layouts/';
  import { APP_URL } from '../utils/global.js';

  let { route } = $props();
  let formId = $state(route.result.path.params.id);
  let form = $state()
  let url = APP_URL + `/v/${formId}`;
  let embedChoice = $state('Inline Embed');
  let embedCode = $state('');

  
  $effect(() => {
    switch (embedChoice) {
      case 'Inline Embed':
        embedCode = `<iframe src="${url}" style="width:100%; height:300px;" frameborder="0"></iframe>`;
        break;
      case 'Popup':
        embedCode = `<button onclick="window.open('${url}', '_blank', 'width=600,height=400')">Open Form</button>`;
        break;
      case 'Fullpage':
        embedCode = `<a href="${url}" target="_blank">Go to Fullpage Form</a>`;
        break;
      default:
        embedCode = '';
    }
  });

  let showToast = $state(false);
  
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(embedCode);
      showToast = true;
      setTimeout(() => (showToast = false), 3000);
    } catch {
    
    }

  }
</script>
 
<DefaultLayout  bind:formId={formId} activeMenuLabel="Share">

<div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
  
  <div class="w-full max-w-4xl space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
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

      <Dropdown
        choices={['Inline Embed', 'Popup', 'Fullpage']}
        bind:value={embedChoice}
      />
    </div>

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

  {#if showToast}
    <Toast message= "Code Copied!" type="success"  />
  {/if}
</div>
 </DefaultLayout>