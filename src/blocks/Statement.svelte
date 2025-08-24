<script>
  let { value = $bindable(), canAnswer = false, props } = $props();
  let { message = '' } = props ?? {};
</script>
<div class="">
  <div class="px-0 py-2 text-base text-gray-800 whitespace-pre-wrap text-center">
    {value || ''}
  </div>

  {#if message}
    <p class="text-xs text-gray-500 mt-1 text-left">{message}</p>
  {/if}
</div>
