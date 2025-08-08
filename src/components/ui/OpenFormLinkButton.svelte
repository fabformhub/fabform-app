<script>
    import { ExternalLink } from 'lucide-svelte';
    import { tooltip } from '../../utils/tooltip.js';
    let {url = ''} = $props();
  </script>
  
  <button use:tooltip={{ text: 'Open form link', position: 'bottom' }}
    class="inline-flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition"
    on:click={() => url && window.open(url, '_blank')}
  > 
    <ExternalLink class="w-5 h-5" />
  </button>
  