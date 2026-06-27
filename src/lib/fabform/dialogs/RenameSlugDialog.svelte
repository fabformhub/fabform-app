<script>
    let { props = $bindable()} = $props();
</script>
  
  <input
    bind:value={props.slugName}
    placeholder="Enter Friendly URL name"
    class="border p-2 w-full"
  />

<p class="m-1 text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
  https://fabform/v/{props.slugName}
</p>

  