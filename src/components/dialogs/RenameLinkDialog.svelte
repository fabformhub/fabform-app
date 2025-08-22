<script>
    let { props = $bindable()} = $props();
</script>
  
  <input
    bind:value={props.id}
    placeholder="Enter Form id"
    class="border p-2 w-full"
  />
  