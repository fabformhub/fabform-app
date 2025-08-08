<script>
  import { Menu } from './';
  let { children } = $props();
</script>

<div class="flex flex-col min-h-screen">
  <!-- Top Section: Menu -->
  <div class="m-10">
    <Menu formId={1} />
  </div>

  <!-- Bottom Section: Other Layout -->
  <div class="bg-white m-5 rounded-xl shadow-md p-4">
    <h1 class="text-2xl font-semibold mb-4">Other Layout</h1>
    {@render children?.()}
  </div>
</div>
