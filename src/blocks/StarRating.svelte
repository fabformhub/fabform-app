<script>
  import { Star } from 'lucide-svelte';
  import { scale } from 'svelte/transition';
  let { canAnswer, value = $bindable(), props } = $props();

  let selected = $state(value || 0);
  let hover = $state(0);

  function setRating(rating) {
    if (!canAnswer) return;
    selected = rating;
    value = rating;
  }

  function onMouseEnter(rating) {
    if (!canAnswer) return;
    hover = rating;
  }

  function onMouseLeave() {
    if (!canAnswer) return;
    hover = 0;
  }
</script>

<div class="inline-block space-y-2">
  <p class="text-gray-700 font-semibold"></p>
  <div
    class="flex items-center space-x-2"
    on:mouseleave={onMouseLeave}
    style={!canAnswer ? 'pointer-events: none;' : ''}
  >
  {#each Array(Number(props.maxRating)) as _, i}
      <span
        on:mouseenter={() => onMouseEnter(i + 1)}
        on:click={() => setRating(i + 1)}
        transition:scale={{ duration: 150 }}
        class="cursor-pointer transform transition-transform duration-200"
      >
        <Star
          class={`w-8 h-8 ${
            (hover || selected) > i ? 'text-yellow-400 fill-yellow-300' : 'text-gray-300'
          }`}
          fill={(hover || selected) > i ? 'currentColor' : 'none'}
        />
      </span>
    {/each}
  </div>
</div>
