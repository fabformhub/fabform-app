<script>
  import {Link as LinkIcon} from 'lucide-svelte';  // Changed icon to Link
  import { tooltip } from '../../utils/tooltip.js'; 
  import {Toast} from "../../components/ui";

  let { link = '' } = $props();
  let copied = $state(false);

  async function copyToClipboard() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      copied = true;
      setTimeout(() => copied = false, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
</script>

<div class="flex items-center space-x-2">
  <button use:tooltip={{ text: 'Copy form link', position: 'bottom' }}
    on:click={copyToClipboard}
    class="inline-flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition"
  
    disabled={!link}
  >
    <LinkIcon class="w-5 h-5" />  <!-- Smaller link icon -->
  </button>

  {#if copied}
    <Toast message="Link copied!" />
  {/if}
</div>
