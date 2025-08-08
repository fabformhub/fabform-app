<script>
  import {FontLoader} from '../../components/ui';
let {block =$bindable(), uiMeta = {}, formMode=false, nextBlock ={}, errorMessage=''} = $props();
const coverImage = $derived(block?.meta?.coverImageProps?.coverImage);

const layout = $derived(block?.meta?.coverImageProps?.layout);

import { BlockView } from '.';

const uiBackground = $derived(
  uiMeta && uiMeta.backgroundImage && uiMeta.backgroundImage.startsWith('http')
    ? `background-image: url(${uiMeta.backgroundImage}); background-size: cover; background-repeat: no-repeat; background-position: center;`
    : `background-color: ${uiMeta?.backgroundColor }`
);

const questionColor = $derived(
   `color: ${uiMeta?.questionColor}`
);

const combinedStyle = $derived(`${questionColor}; ${uiBackground}`);

const viewSize = formMode ?  'h-screen w-screen': 'h-full w-full';

</script>
<div class="flex items-center justify-center {viewSize}" style={combinedStyle}>

<FontLoader fontName="Special Elite" fontScale="large">

{#if layout === 'Wallpaper'|| !layout }
<div
  class={[viewSize,'flex items-center justify-center', coverImage && 'bg-cover  bg-center']}
  style={coverImage && `background-image: url('${coverImage}')`}
>
  <div class="flex flex-col justify-center items-center">
	<BlockView uiMeta={uiMeta} {formMode} bind:block={block} clickHandler={nextBlock} {errorMessage} />
  </div>
</div>

{:else if layout === 'Stack' }
<div class={[viewSize,'flex justify-end.reverse items-center flex-col']}
style={uiBackground}
>
<div

  class={['flex w-96 h-64 m-10', coverImage && 'bg-cover  bg-center']}
  style={coverImage && `background-image: url('${coverImage}')`}
>
</div>

  <div class="flex flex-col justify-center items-center">
	<BlockView uiMeta={uiMeta} {formMode} block={blocks[blockNo]} clickHandler={nextBlock} {errorMessage} />
  </div>
</div>

{:else if layout === 'Split-left'}
          <div class={[viewSize,'flex']}
          >
            <!-- Left Pane: Image -->
            <div
              class="w-1/2 bg-cover bg-center"
              style={`background-image: url('${coverImage}')`}
            ></div>
            <!-- Right Pane: Controls -->
            <div class="w-1/2 flex flex-col justify-center items-center">
              <BlockView uiMeta={uiMeta} {formMode} block={block} clickHandler={nextBlock} {errorMessage} />
            </div>
          </div>
        {:else if layout === 'Split-right'}
          <div class={[viewSize,'flex']}
          
          >
            <!-- Left Pane: Controls -->
            <div class="w-1/2 flex flex-col justify-center items-center">
              <BlockView bind:uiMeta={uiMeta} {formMode} bind:block={block} clickHandler={nextBlock} {errorMessage} />
            </div>
            <!-- Right Pane: Image -->
            <div
              class="w-1/2 bg-cover bg-center"
              style={`background-image: url('${coverImage}')`}
            ></div>
          </div>
        {/if}
</FontLoader>
</div>
