<script>
  import { BlockView } from '.';

  let {
    form,
    block,
    canAnswer = false,
    nextBlock = () => {},
    errorMessage = ''
  } = $props();

  const meta = $derived(form?.meta ?? {});

  const coverImage = $derived(
    block?.meta?.coverImageProps?.coverImage ||
    meta?.backgroundImage ||
    ''
  );

  const layout = $derived(
    block?.meta?.coverImageProps?.layout || ''
  );

  // simple font-size mapper (ONLY thing we need)
  const fontSize = $derived(() => {
    switch (meta.fontSize) {
      case 'Small':
        return '14px';
      case 'Medium':
        return '16px';
      case 'Large':
        return '18px';
      case 'Extra Large':
        return '22px';
      default:
        return '16px';
    }
  });
</script>

{#snippet blockContent()}
  <BlockView
    uiMeta={meta}
    canAnswer={canAnswer}
    bind:block={block}
    clickHandler={nextBlock}
    {errorMessage}
  />
{/snippet}

<div
  class="w-full min-h-screen"
  style={`
    background-color: ${meta.backgroundColor || '#ffffff'};
    color: ${meta.color || '#0f172a'};
    font-family: ${meta.fontFamily || 'system-ui'};
    font-size: ${fontSize()};
  `}
>

  {#if layout === 'Wallpaper'}
    <div
      class="flex items-center justify-center w-full min-h-screen bg-cover bg-center"
      style={coverImage ? `background-image: url('${coverImage}')` : ''}
    >
      {@render blockContent()}
    </div>

  {:else if layout === 'Stack'}
    <div class="flex flex-col w-full min-h-screen">

      {#if coverImage}
        <div
          class="w-full h-48 md:h-72 bg-cover bg-center"
          style={`background-image: url('${coverImage}')`}
        />
      {/if}

      <div class="flex flex-1 items-center justify-center p-4">
        {@render blockContent()}
      </div>
    </div>

  {:else if layout === 'Split-left'}
    <div class="flex flex-col md:flex-row w-full min-h-screen">

      {#if coverImage}
        <div
          class="w-full md:w-1/2 min-h-[250px] md:min-h-screen bg-cover bg-center"
          style={`background-image: url('${coverImage}')`}
        />
      {/if}

      <div class="w-full md:w-1/2 flex items-center justify-center p-4">
        {@render blockContent()}
      </div>

    </div>

  {:else if layout === 'Split-right'}
    <div class="flex flex-col md:flex-row w-full min-h-screen">

      <div class="w-full md:w-1/2 flex items-center justify-center p-4">
        {@render blockContent()}
      </div>

      {#if coverImage}
        <div
          class="w-full md:w-1/2 min-h-[250px] md:min-h-screen bg-cover bg-center"
          style={`background-image: url('${coverImage}')`}
        />
      {/if}

    </div>

  {:else}
    <div class="flex items-center justify-center min-h-screen">
      {@render blockContent()}
    </div>
  {/if}

</div>
