<script>
  import { FontLoader } from '../../components/ui';
  import { BlockView } from '.';

  let { block = $bindable(), uiMeta = {}, formMode = false, nextBlock = () => {}, errorMessage = '' } = $props();

  const coverImage = $derived(block?.meta?.coverImageProps?.coverImage);
  const layout = $derived(block?.meta?.coverImageProps?.layout);

  const uiBackground = $derived(
    uiMeta && uiMeta.backgroundImage && uiMeta.backgroundImage.startsWith('http')
      ? `background-image: url(${uiMeta.backgroundImage}); background-size: cover; background-repeat: no-repeat; background-position: center;`
      : `background-color: ${uiMeta?.backgroundColor || 'transparent'}`
  );

  const questionColor = $derived(`color: ${uiMeta?.questionColor || 'inherit'}`);
  const combinedStyle = $derived(`${questionColor}; ${uiBackground}`);

  const viewSize = formMode ? 'min-h-screen w-full' : 'h-full w-full';
</script>

<div class={`flex flex-col items-center justify-center ${viewSize}`} style={combinedStyle}>
  <FontLoader fontName="Special Elite" fontScale="large">
    
    {#if layout === 'Wallpaper' || !layout}
      <div class={`flex flex-col items-center justify-center w-full h-full ${coverImage ? 'bg-cover bg-center' : ''}`} 
           style={coverImage ? `background-image: url('${coverImage}')` : ''}>
        <BlockView uiMeta={uiMeta} {formMode} bind:block={block} clickHandler={nextBlock} {errorMessage} />
      </div>

    {:else if layout === 'Stack'}
      <div class="flex flex-col items-center w-full min-h-screen" style={uiBackground}>
        {#if coverImage}
          <div class="w-full h-48 md:h-64 bg-cover bg-center" style={`background-image: url('${coverImage}')`}></div>
        {/if}
        <div class="flex flex-col justify-center items-center w-full p-4">
          <BlockView uiMeta={uiMeta} {formMode} bind:block={block} clickHandler={nextBlock} {errorMessage} />
        </div>
      </div>

    {:else if layout === 'Split-left'}
      <div class="flex flex-col md:flex-row w-full min-h-screen">
        <div class="w-full md:w-1/2 h-48 md:h-auto bg-cover bg-center" style={`background-image: url('${coverImage}')`}></div>
        <div class="w-full md:w-1/2 flex flex-col justify-center items-center p-4">
          <BlockView uiMeta={uiMeta} {formMode} bind:block={block} clickHandler={nextBlock} {errorMessage} />
        </div>
      </div>

    {:else if layout === 'Split-right'}
      <div class="flex flex-col md:flex-row w-full min-h-screen">
        <div class="w-full md:w-1/2 flex flex-col justify-center items-center p-4">
          <BlockView uiMeta={uiMeta} {formMode} bind:block={block} clickHandler={nextBlock} {errorMessage} />
        </div>
        <div class="w-full md:w-1/2 h-48 md:h-auto bg-cover bg-center" style={`background-image: url('${coverImage}')`}></div>
      </div>
    {/if}

  </FontLoader>
</div>
