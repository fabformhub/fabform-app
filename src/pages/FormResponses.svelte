<script>
  import { onMount } from 'svelte';
  import { getResponsesByFormId, deleteResponseById } from '../services/responseService.js';
  import { bgColors } from '../constants/colors.js';
  import { Inbox, Download, Trash } from 'lucide-svelte';
  import { DefaultLayout } from '../components/layouts/';
  import { blockTemplates } from '../templates/blockTemplates.js';

  let { route } = $props();
  let formId = $state(route.result.path.params.id);

  let responses = [];
  let error;
  let selected = new Set();

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

  const toggleSelection = (id) => {
    const copy = new Set(selected);
    copy.has(id) ? copy.delete(id) : copy.add(id);
    selected = copy;
  };

  const deleteSelected = async () => {
    const idsToDelete = [...selected];
    for (const id of idsToDelete) {
      await deleteResponseById(id);
    }
    responses = responses.filter((r) => !selected.has(r.id));
    selected = new Set();
  };

  onMount(async () => {
    const res = await getResponsesByFormId(formId);
    if (res.success) {
      responses = res.data.responses;
    } else {
      error = res.error;
    }
  });

  function generateCSV() {
    if (responses.length === 0) return;

    const answerKeys = Array.from(new Set(responses.flatMap(r => r.meta?.map(m => m.blockTypeId) || [])));
    const headers = ['ID', 'Timestamp', ...answerKeys.map(key => `Answer-${key}`)];

    const rows = responses.map((response) => {
      const map = new Map(response.meta?.map(m => [m.blockTypeId, m.answer || '']));
      return [response.id, formatDate(response.created_at), ...answerKeys.map(k => map.get(k) || '')];
    });

    const csvContent = [
      headers.join(','), 
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `responses-${formId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Helper to get the icon component for a blockTypeId
  const getBlockIcon = (blockTypeId) => {
    const block = blockTemplates.find(b => b.blockTypeId === blockTypeId);
    return block ? block.icon : null;
  };
</script>

<DefaultLayout bind:formId={formId} activeMenuLabel="Responses">
  <div class="max-w-full mx-auto mt-8 px-6">
    <!-- Action Buttons -->
    <div class="flex justify-end space-x-4 mb-6">
      {#if responses.length > 0}
        <button
          on:click={generateCSV}
          class="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg shadow-md">
          <Download class="w-5 h-5" />
          <span>Download CSV</span>
        </button>
      {/if}

      {#if selected.size > 0}
        <button
          on:click={deleteSelected}
          class="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md flex items-center gap-2">
          <Trash class="w-5 h-5" />
          <span>{selected.size} selected - Delete</span>
        </button>
      {/if}
    </div>

    <!-- No Responses -->
    {#if responses.length === 0}
      <div class="flex flex-col items-center text-center text-gray-500 py-24">
        <Inbox class="w-16 h-16 mb-4 opacity-30" />
        <h2 class="text-xl font-semibold">No responses yet</h2>
        <p class="text-gray-400 mt-2">Once someone submits the form, their answers will appear here.</p>
      </div>
    {:else}
      <!-- Responses List -->
      <div class="space-y-6 overflow-y-auto max-h-[80vh] pb-4">
        {#each responses as resp}
          <div class="bg-white shadow-xl rounded-lg w-full p-4 border border-gray-200 space-y-2 relative flex items-start">
            <!-- Checkbox -->
            <input
              type="checkbox"
              checked={selected.has(resp.id)}
              on:change={() => toggleSelection(resp.id)}
              class="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />

            <!-- Response Content -->
            <div class="pl-12 w-full">
              {#if resp.meta && resp.meta.length > 0}
                {#each resp.meta as item}
                  {#if getBlockIcon(item.blockTypeId) !== null}
                    <svelte:component
                      this={getBlockIcon(item.blockTypeId)}
                      class={`w-6 h-6 text-gray-700 mr-2`}
                    />
                  {/if}
                  <div class={`p-3 ${bgColors[item.blockTypeId] || 'bg-gray-100'} rounded-lg flex items-center space-x-3`}>
                    <div class="text-gray-800 break-words">{item.answer || '---'}</div>
                  </div>
                {/each}
              {:else}
                <div class="text-gray-400 italic">No answers</div>
              {/if}

              <div class="text-sm text-gray-500 pt-3 border-t mt-2">
                {formatDate(resp.created_at)}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</DefaultLayout>
