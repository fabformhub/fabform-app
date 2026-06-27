<script>
  import { Menu } from '$lib/fabform/layouts';
  let { setActive, form, children } = $props();
</script>

<main class="h-screen flex flex-col">
  <Menu {setActive} {form} />
  {@render children?.()}
</main>

