<script>
  let { formMode = false, value = $bindable(), props } = $props();

  let min = $derived(Number(props.start ?? 0));
  let max = $derived(Number(props.end ?? 10));

  let selected = $state(value);
  let animating = $state(false);

  function selectValue(i) {
  
    if (!formMode) return;
    selected = i;
    value = i;

    animating = false;
    requestAnimationFrame(() => animating = true);
  }

  $effect(() => {
    if (value !== selected) selected = value;
  });
</script>

<style>
  .pop {
    animation: pop 0.3s ease;
  }

  @keyframes pop {
    0% { transform: scale(1); }
    40% { transform: scale(1.25); }
    100% { transform: scale(1); }
  }
</style>

<div class="w-full max-w-3xl mx-auto space-y-6">
  <div class="flex justify-center gap-3 px-2 ">
    {#each Array(max - min + 1).entries() as [i]}
      {@const num = min + i}
      <button
        onclick={() => selectValue(num)}
        class={`w-10 h-10 sm:w-12 sm:h-12 rounded font-semibold text-sm transition duration-300 transform
          flex items-center justify-center
          ${formMode ? 'cursor-pointer' : 'pointer-events-none'}
          ${selected === num
            ? `bg-indigo-600 text-white shadow-lg ${animating ? 'pop' : ''}`
            : 'bg-white text-gray-800 border border-gray-300 hover:bg-indigo-100 hover:text-indigo-700'}
        `}
      >
        {num}
      </button>
    {/each}
  </div>

  <div class="flex justify-between text-sm text-gray-500 font-medium px-2">
    <span>{props.leftLabel}</span>
    <span>{props.rightLabel}</span>
  </div>
</div>
