<script>
  import { onMount } from 'svelte';
  import { Spinner, PageNotFound } from '../../components/ui';
  import { getFormById } from '../../services/formService.js';
  import { debounce } from '../../utils/debounce.js'; // Adjust path as needed
  import { Menu } from '../../components/layouts';

  let { activeMenuLabel, form = $bindable(), formId, children } = $props();
  
  let status = $state('loading');

  // Debounce only for 'ok' status, 5 seconds delay
  const setStatusDebounced = debounce((newStatus) => {
    status = newStatus;
  }, 500);

  onMount(async () => {
    const result = await getFormById(formId);

    if (!result.success) {
      status = 'notfound'; // immediate for 'notfound'
    }

    form = result.data.form;
    setStatusDebounced('ok'); // debounce 'ok' status
  });
</script>

{#if status === 'loading'}
  <div class="flex items-center justify-center h-screen">
    <Spinner />
  </div>
{:else if status === 'notfound'}
  <PageNotFound />
{:else}
<main class="h-screen flex flex-col">
<Menu activeMenuLabel={activeMenuLabel} formName={form.name} bind:currentFormId={formId} />
  {@render children?.()}
</main>
{/if}
