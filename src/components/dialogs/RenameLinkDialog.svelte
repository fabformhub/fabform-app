<script>
    let { props = $bindable()} = $props();
</script>
  
  <input
    bind:value={props.name}
    placeholder="Enter Link id"
    class="border p-2 w-full"
  />
  