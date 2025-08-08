<script>
  let { value = $bindable(), formMode = false, props } = $props();
  let { message = '' } = props ?? {};
</script>
<h1>This is a Statement</h1>
<div class="">
  <div class="px-0 py-2 text-base text-gray-800 whitespace-pre-wrap text-center">
    {value || ''}
  </div>

  {#if message}
    <p class="text-xs text-gray-500 mt-1 text-left">{message}</p>
  {/if}
</div>
