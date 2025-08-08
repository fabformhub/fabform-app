<script>
  import { PlusSquare } from 'lucide-svelte';
  import { tooltip } from '../../utils/tooltip.js';

  let { clickHandler, largeIcon = false } = $props();

  let iconSize = largeIcon ? 'w-8 h-8' : 'w-5 h-5';
</script>

<button
  use:tooltip={{ text: 'Add Block', position: 'bottom' }}
  class="inline-flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition"
  on:click={clickHandler}
>
  <PlusSquare class={iconSize} />
</button>
