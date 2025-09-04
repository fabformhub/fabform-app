<script>
  // Props are reactive in Svelte 5
  let { value = $bindable(), props = {}, canAnswer = false } = $props();

  // Local reactive state
  let choices = $state(props.choices ?? []);
  let multiple = $state(props.multiple ?? false);

  // Keep local state in sync if parent updates props
  $effect(() => {
    choices = props.choices ?? [];
    multiple = props.multiple ?? false;
  });

  // Toggle selection
  function toggleChoice(choice) {
    if (!canAnswer) return;

    if (multiple) {
      value = value?.includes(choice)
        ? value.filter(c => c !== choice)
        : [...(value || []), choice];
    } else {
      if (value !== choice) value = choice;
    }
  }

  function isSelected(choice) {
    return multiple ? value?.includes(choice) : value === choice;
  }
</script>

<div class="flex flex-col">
  {#each choices as choice}
    <button
      class="cursor-pointer m-2 px-6 py-4 text-lg rounded-xl transition-all duration-300 ease-in-out shadow-md transform
             bg-white text-gray-800 hover:bg-blue-100 hover:text-blue-600 hover:scale-105
             disabled:opacity-60 disabled:cursor-not-allowed"
      class:bg-blue-600={isSelected(choice)}
      class:text-white={isSelected(choice)}
      class:scale-105={isSelected(choice)}
      class:ring-2={isSelected(choice)}
      class:ring-blue-300={isSelected(choice)}
      class:animate-[pulse_0.6s_ease-in-out]={isSelected(choice)}
      disabled={!canAnswer}
      aria-pressed={isSelected(choice)}
      on:click={() => toggleChoice(choice)}
    >
      {choice}
    </button>
  {/each}
</div>
