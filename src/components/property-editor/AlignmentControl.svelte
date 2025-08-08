<script>
  import { AlignLeft, AlignCenter } from "lucide-svelte";
  let {textAlign = $bindable()} = $props();
</script>

<div class="flex space-x-3 mt-3 z-0">
  <button
    class="p-2 border rounded-lg hover:bg-gray-200 relative group"
    onclick={() => (textAlign = "left")}
  >
    <AlignLeft class="w-3 h-3 m-1" />
    <span class="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
      Left
    </span>
  </button>

  <button
    class="p-2 border rounded-lg hover:bg-gray-200 relative group"
    onclick={() => (textAlign = "center")}
  >
    <AlignCenter class="w-3 h-3 m-1" />
    <span class="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
      Center
    </span>
  </button>
</div>
