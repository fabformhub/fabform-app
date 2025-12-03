<script>
  import { BlockView, } from '.';
  import {FontFrame } from '../ui';

  let { block = null, canAnswer = false, uiMeta = {}, nextBlock = () => {}, errorMessage = '' } = $props();

  const coverImage = block?.meta?.coverImageProps?.coverImage || '';
  const layout = block?.meta?.coverImageProps?.layout || '';

  const uiBackground = uiMeta?.backgroundImage?.startsWith('http')
    ? `background-image: url(${uiMeta.backgroundImage}); background-size: cover; background-repeat: no-repeat; background-position: center;`
    : `background-color: ${uiMeta?.backgroundColor || 'transparent'}`;

  const questionColor = `color: ${uiMeta?.questionColor || 'inherit'}`;
  const combinedStyle = `${questionColor}; ${uiBackground}`;


</script>
<FontFrame {uiMeta}>
  {#if layout === 'Wallpaper'}
    <div class={`flex flex-col items-center justify-center w-full h-full ${coverImage ? 'bg-cover bg-center' : ''}`} 
         style={coverImage ? `background-image: url('${coverImage}')` : ''}>
      {#if block}
        <BlockView uiMeta={uiMeta} canAnswer={canAnswer} bind:block={block}
                   clickHandler={nextBlock} {errorMessage} />
      {/if}
    </div>

  {:else if layout === 'Stack'}
    <div class="flex flex-col items-center w-full min-h-screen" style={uiBackground}>
      {#if coverImage}
        <div class="w-full h-48 md:h-64 bg-cover bg-center"
             style={`background-image: url('${coverImage}')`}></div>
      {/if}
      <div class="flex flex-col justify-center items-center w-full p-4">
        {#if block}
          <BlockView uiMeta={uiMeta} canAnswer={canAnswer} bind:block={block}
                     clickHandler={nextBlock} {errorMessage} />
        {/if}
      </div>
    </div>

  {:else if layout === 'Split-left'}
    <div class="flex flex-col md:flex-row w-full min-h-screen">
      {#if coverImage}
        <div class="w-full md:w-1/2 h-48 md:h-auto bg-cover bg-center"
             style={`background-image: url('${coverImage}')`}></div>
      {/if}
      <div class="w-full md:w-1/2 flex flex-col justify-center items-center p-4">
        {#if block}
          <BlockView uiMeta={uiMeta} canAnswer={canAnswer} bind:block={block}
                     clickHandler={nextBlock} {errorMessage} />
        {/if}
      </div>
    </div>

  {:else if layout === 'Split-right'}
    <div class="flex flex-col md:flex-row w-full min-h-screen">
      <div class="w-full md:w-1/2 flex flex-col justify-center items-center p-4">
        {#if block}
          <BlockView uiMeta={uiMeta} canAnswer={canAnswer} bind:block={block}
                     clickHandler={nextBlock} {errorMessage} />
        {/if}
      </div>
      {#if coverImage}
        <div class="w-full md:w-1/2 h-48 md:h-auto bg-cover bg-center"
             style={`background-image: url('${coverImage}')`}></div>
      {/if}
    </div>

  {:else}
    <div class="flex items-center justify-center min-h-screen w-full" style={combinedStyle}>
      {#if block}
        <BlockView uiMeta={uiMeta} canAnswer={canAnswer} bind:block={block}
                   clickHandler={nextBlock} {errorMessage} />
      {/if}
    </div>
  {/if}
</FontFrame>