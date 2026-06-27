<script>
    let { props = $bindable()} = $props();
</script>
  
  <input
    bind:value={props.name}
    placeholder="Rename form name"
    class="border p-2 w-full"
  />
  