<script>
  let { value = $bindable(), props = {}, formMode = false } = $props();

  let {
    choices = [],
    multiple = false
  } = props;

  function toggleChoice(choice) {
    if (multiple) {
      value = value?.includes(choice)
        ? value.filter(c => c !== choice)
        : [...(value || []), choice];
    } else {
      value = choice;
    }
  }

  function isSelected(choice) {
    return multiple ? value?.includes(choice) : value === choice;
  }
</script>
<div class="flex flex-col">
  {#each choices as choice}
    <button
      class={[
        'cursor-pointer m-2 px-6 py-4 text-lg rounded-xl transition-all duration-300 ease-in-out shadow-md transform',
        isSelected(choice)
          ? 'bg-blue-600 text-white scale-105 shadow-xl ring-2 ring-blue-300 animate-[pulse_0.6s_ease-in-out]'
          : 'bg-white text-gray-800 hover:bg-blue-100 hover:text-blue-600 hover:scale-105',
        !formMode && 'opacity-60 cursor-not-allowed'
      ]}
      disabled={!formMode}
      on:click={() => toggleChoice(choice)}
    >
      {choice}
    </button>
  {/each}
  </div>