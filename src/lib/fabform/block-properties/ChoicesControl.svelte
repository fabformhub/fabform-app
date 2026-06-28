<script>
  import { Trash2 } from 'lucide-svelte';

  let { choices = $bindable(), selected = [], multiple = 0, ...props } = $props();

  function addChoice() {
    choices = [...choices, `New Choice ${choices.length}`];
  }

  function deleteChoice(index) {
    choices = choices.filter((_, i) => i !== index);
  }

  function handleKeydown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addChoice();
    }
  }
</script>

<div class="container mx-auto p-4 relative">
  <div class="absolute top-4 right-4">
    <button
      onclick={addChoice}
      class="w-8 h-8 rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 flex items-center justify-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m7-7H5" />
      </svg>
    </button>
  </div>

  <div class="mt-12">
    <ul class="space-y-2">
      {#each choices as choice, index}
        <li class="flex items-center space-x-2">
          <input
            bind:value={choices[index]}
            onkeydown={handleKeydown}
            class="border px-2 py-1 rounded w-full"
            placeholder="Enter your choice"
            {...props}
          />
          <button
            onclick={() => deleteChoice(index)}
            class="text-red-500 hover:text-red-700"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </li>
      {/each}
    </ul>
  </div>
</div>
