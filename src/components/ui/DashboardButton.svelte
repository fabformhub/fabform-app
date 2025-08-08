<script>
  import { ArrowLeft } from 'lucide-svelte';
  import { goto } from '@mateothegreat/svelte5-router';

  function goDashboard() {
    goto('/dashboard'); 
  }
</script>

<div class="group relative inline-block m-1">
  <button class="cursor-pointer" on:click={goDashboard}>
    <ArrowLeft
      class="w-8 h-8 stroke-current fill-none 
      hover:scale-125 duration-200 hover:stroke-blue-500"
      stroke-width="2"
    />
  </button>
</div>
