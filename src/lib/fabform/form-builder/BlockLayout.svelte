<script>
  import { BlockView } from '.';

  let { form, block, canAnswer = false, nextBlock = () => {}, errorMessage = '' } = $props();

  // form-level meta (single source of truth)
  const meta = $derived(form?.meta ?? {});

  const coverImage = $derived(
    block?.meta?.coverImageProps?.coverImage 
  );


const layout = $derived(
    block?.meta?.coverImageProps?.layout 
  );

  const formBackgroundImage= $derived(
    form?.meta?.backgroundImage
  );

  const formBackgroundColor= $derived(
    form?.meta?.bgColor
  );

  // clean font size mapping
  const fontSizeClass = $derived(
    {
      Small: 'text-sm md:text-base leading-relaxed',
      Medium: 'text-base md:text-xl leading-relaxed',
      Large: 'text-lg md:text-2xl leading-relaxed',
      'Extra Large': 'text-xl md:text-3xl leading-relaxed'
    }[meta?.fontSize] ?? 'text-base md:text-xl leading-relaxed'
  );


</script>

{#snippet blockContent()}
  <BlockView
    uiMeta={meta}
    block={block}
    canAnswer={canAnswer}
    clickHandler={nextBlock}
    {errorMessage}
  />
{/snippet}
<div
  class={`w-full min-h-screen ${fontSizeClass}`}
  style={`
    background-image: url(${formBackgroundImage}); 
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-color: ${formBackgroundColor};
  `}
>

{#if layout === 'Wallpaper'} 
    <div
      class="flex items-center justify-center w-full min-h-screen bg-cover bg-center"
      style={`background-image: url(${coverImage})`}
    >
      {@render blockContent()}
    </div>

// default if no layout selected 

  {:else if layout === 'Stack' || layout ===''}
    <div class="flex flex-col w-full min-h-screen">

      {#if coverImage}
        <div
          class="w-full h-48 md:h-72 bg-cover bg-center"
          style={`background-image: url(${coverImage})`}
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
          style={`background-image: url(${coverImage})`}
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
          style={`background-image: url(${coverImage})`}
        />
      {/if}

    </div>

  {:else}
    <div class="flex items-center justify-center min-h-screen">
      {@render blockContent()}
    </div>
  {/if}

</div>
