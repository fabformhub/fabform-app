<script>
  import { onMount } from 'svelte';
  import { Spinner, PageNotFound } from '../../components/ui';
  import { getForm } from '../../services/formService.js';
  import { debounce } from '../../utils/debounce.js'; // Adjust path as needed
  import { Menu } from '../../components/layouts';

  let { activeMenuLabel, form = $bindable(), children } = $props();
  
</script>

<main class="h-screen flex flex-col">
<Menu activeMenuLabel={activeMenuLabel} bind:form={form} />
  {@render children?.()}
</main>
