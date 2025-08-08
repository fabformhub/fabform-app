<script>
  let { checked = $bindable(false) } = $props();
</script>

<label class="flex items-center space-x-2 cursor-pointer select-none">
  <input 
    type="checkbox" 
    bind:checked={checked}
    class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500" 
  />
</label>
