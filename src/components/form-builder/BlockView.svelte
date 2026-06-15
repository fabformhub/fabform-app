<script>
  import { getComponent } from '../../utils/getComponent.js';
  import { AlertTriangle } from 'lucide-svelte';

  let {
    block = $bindable({}),
    uiMeta = $bindable({}),
    canAnswer = false,
    clickHandler,
    errorMessage = ''
  } = $props();

  const SvelteComponent = $derived(
  getComponent(block?.meta?.component)
  );
</script>

<div
  class={`relative ${
    canAnswer
      ? 'flex items-center justify-center min-h-screen px-6'
      : 'max-w-lg mx-auto mt-5 px-4 pt-8'
  }`}
>

  <div class="w-full max-w-md">

    {#if block?.meta?.question}
      <p class="mb-2" style={` color: ${uiMeta?.questionColor}; `}>
        {block.meta.question}
      </p>
    {/if}

    {#if block?.meta?.description}
      <p class="mb-4" style={`color: ${uiMeta?.questionColor}; `}>
        {block.meta.description}
      </p>
    {/if}

    {#if SvelteComponent}
      <div class="mb-4">
        <SvelteComponent
          bind:value={block.value}
          canAnswer={canAnswer}
          props={block?.meta?.props ?? {}}
        />
      </div>
    {/if}

    {#if block?.meta?.blockTypeId !== 99}
      <button
        type="button"
        onclick={clickHandler}
        class="rounded px-4 py-2"
        style={`
          background-color: ${uiMeta?.buttonColor};
          color: ${uiMeta?.buttonTextColor};
        `}
      >
        {block?.meta?.buttonText || 'Continue'}
      </button>
    {/if}

    {#if errorMessage}
      <div
        class="mt-4 flex items-start gap-2 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-700"
        role="alert"
      >
        <AlertTriangle size={20} class="mt-0.5 flex-shrink-0" />
        <p class="text-sm">{errorMessage}</p>
      </div>
    {/if}

  </div>
</div>
