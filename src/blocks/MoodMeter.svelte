<script>
  let { formMode = false, value = $bindable() } = $props();

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

  const moods = [
    { id: 1, label: 'Very Sad', color: '#ef4444' },
    { id: 2, label: 'Sad', color: '#f97316' },
    { id: 3, label: 'Neutral', color: '#9ca3af' },
    { id: 4, label: 'Happy', color: '#22c55e' }
  ];

  function getFaceSVG(rating) {
    switch (rating) {
      case 1: // very sad
        return `
          <circle cx="40" cy="40" r="28" fill="#ef4444" stroke="#b91c1c" stroke-width="2" />
          <circle cx="28" cy="32" r="4" fill="#000" />
          <circle cx="52" cy="32" r="4" fill="#000" />
          <path d="M28 50 Q40 38 52 50" stroke="#000" stroke-width="3" fill="none" stroke-linecap="round" /> 
          <circle cx="25" cy="48" r="3" fill="#3b82f6" />
        `;
      case 2: // sad
        return `
          <circle cx="40" cy="40" r="28" fill="#f97316" stroke="#c2410c" stroke-width="2" />
          <circle cx="28" cy="32" r="4" fill="#000" />
          <circle cx="52" cy="32" r="4" fill="#000" />
          <path d="M28 48 Q40 40 52 48" stroke="#000" stroke-width="3" fill="none" stroke-linecap="round" />
        `;
      case 3: // neutral
        return `
          <circle cx="40" cy="40" r="28" fill="#9ca3af" stroke="#6b7280" stroke-width="2" />
          <circle cx="28" cy="32" r="4" fill="#000" />
          <circle cx="52" cy="32" r="4" fill="#000" />
          <line x1="28" y1="48" x2="52" y2="48" stroke="#000" stroke-width="3" stroke-linecap="round" />
        `;
      case 4: // happy
        return `
          <circle cx="40" cy="40" r="28" fill="#22c55e" stroke="#15803d" stroke-width="2" />
          <circle cx="25" cy="30" r="5" fill="#000" />
          <circle cx="55" cy="30" r="5" fill="#000" />
          <path d="M24 38 Q40 56 56 38" stroke="#000" stroke-width="3" fill="none" stroke-linecap="round" />
        `;
    }
  }
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
  button svg {
    pointer-events: none;
  }
</style>

<div class="w-full max-w-3xl mx-auto space-y-6">
  <div class="flex justify-between gap-3 px-2">
    {#each moods as { id, label }}
      <button
        on:click={() => selectValue(id)}
        class={`flex-grow rounded transition duration-300 transform flex flex-col items-center justify-center p-1
          ${formMode ? 'cursor-pointer' : 'pointer-events-none'}
          ${selected === id
            ? `${animating ? 'pop' : ''}`
            : 'opacity-70 hover:opacity-100'}
        `}
        aria-label={`Mood rating: ${label}`}
      >
        <svg width="64" height="64" viewBox="0 0 80 80" aria-hidden="true" focusable="false" >
          {@html getFaceSVG(id)}
        </svg>
        <span class="mt-1 text-sm text-gray-700">{label}</span>
      </button>
    {/each}
  </div>
</div>
