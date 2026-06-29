
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
    class="group flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm transition
           hover:border-gray-300 hover:shadow-md active:scale-[0.99]"
  >
    <span class="text-gray-900 font-medium">{getLabel()}</span>

    <ChevronDown
      class="w-4 h-4 text-gray-400 transition group-hover:text-gray-600 group-data-[open=true]:rotate-180"
    />
  </button>

  <!-- BACKDROP (subtle luxury feel) -->
  {#if open}
    <div class="fixed inset-0 z-40" on:click={() => (open = false)}></div>

    <!-- DROPDOWN -->
    <ul
      class="absolute bottom-full mb-2 z-50 w-full overflow-hidden rounded-xl border border-gray-200 bg-white/90 backdrop-blur-xl shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-2"
    >
      {#each options as opt}
        {@const active = opt.value === value}

        <li
          on:click={() => choose(opt.value)}
          class="flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition
                 hover:bg-gray-50 active:bg-gray-100"
        >
          <span class={active ? "text-gray-900 font-medium" : "text-gray-600"}>
            {opt.label}
          </span>

          {#if active}
            <Check class="w-4 h-4 text-black" />
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>
