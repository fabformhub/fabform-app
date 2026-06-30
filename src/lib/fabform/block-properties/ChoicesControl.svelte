<script>
  import { ChevronDown, Check } from "@lucide/svelte";

  let { options = [], value = $bindable(null) } = $props();

  let open = $state(false);

  function choose(v) {
    value = v;
    open = false;
  }

  function getLabel() {
    return options.find(o => o.value === value)?.label ?? "Select...";
  }
</script>

<div class="relative w-full">

  <!-- TRIGGER -->
  <button
    type="button"
    on:click={() => (open = !open)}
    class="group relative flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm
           shadow-sm transition-all duration-200
           hover:border-gray-300 hover:shadow-md
           focus:outline-none focus:ring-2 focus:ring-black/5"
  >
    <span class="text-gray-900 font-medium tracking-tight">
      {getLabel()}
    </span>

    <ChevronDown
      class="w-4 h-4 text-gray-400 transition-transform duration-200
             group-hover:text-gray-600
             {open ? 'rotate-180' : ''}"
    />
  </button>

  <!-- BACKDROP -->
  {#if open}
    <div class="fixed inset-0 z-40" on:click={() => (open = false)}></div>

    <!-- DROPDOWN -->
    <ul
      class="absolute bottom-full mb-2 z-50 w-full overflow-hidden rounded-2xl
             border border-gray-200 bg-white shadow-2xl
             ring-1 ring-black/5
             origin-bottom
             animate-in fade-in zoom-in-95"
    >

      {#each options as opt}
        {@const active = opt.value === value}

        <li
          on:click={() => choose(opt.value)}
          class="relative flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm
                 transition-all duration-150
                 hover:bg-gray-50 active:bg-gray-100"
        >

          <!-- ACTIVE BACKGROUND PILL -->
          <span
            class="absolute inset-x-2 inset-y-1 rounded-lg transition
                   {active ? 'bg-gray-100' : ''}"
          ></span>

          <span
            class="relative z-10 tracking-tight
                   {active ? 'text-gray-900 font-medium' : 'text-gray-500'}"
          >
            {opt.label}
          </span>

          {#if active}
            <Check class="relative z-10 w-4 h-4 text-black" />
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>
