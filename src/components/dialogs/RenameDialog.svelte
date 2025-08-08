<script>
    let { props = $bindable()} = $props();
</script>
  
  <input
    bind:value={props.name}
    placeholder="Enter form name"
    class="border p-2 w-full"
  />
  