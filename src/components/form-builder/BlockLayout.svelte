<script>
  import { BlockView } from '.';
  import { FontFrame } from '../ui';

  let {
    form,
    block,
    canAnswer = false,
    nextBlock = () => {},
    errorMessage = ''
  } = $props();

  const coverImage = block?.meta?.coverImageProps?.coverImage || '';
  const layout = block?.meta?.coverImageProps?.layout || '';
</script>

<FontFrame uiMeta={form?.meta}>

  {#if layout === 'Wallpaper'}
    <div
      class="flex flex-col items-center justify-center w-full h-full"
      style={`
        color: ${form?.meta?.questionColor || 'inherit'};
        background-color: ${form?.meta?.backgroundColor || 'transparent'};
      `}
    >
      {#if block}
        <BlockView
          uiMeta={form?.meta}
          canAnswer={canAnswer}
          bind:block={block}
          clickHandler={nextBlock}
          {errorMessage}
        />
      {/if}
    </div>

  {:else if layout === 'Stack'}
    <div
      class="flex flex-col items-center w-full min-h-screen"
      style={`
        color: ${form?.meta?.questionColor || 'inherit'};
        background-color: ${form?.meta?.backgroundColor || 'transparent'};
      `}
    >
      {#if coverImage}
        <div
          class="w-full h-48 md:h-64 bg-cover bg-center"
          style={`background-image: url('${coverImage}')`}
        />
      {/if}

      <div class="flex flex-col justify-center items-center w-full p-4">
        {#if block}
          <BlockView
            uiMeta={form?.meta}
            canAnswer={canAnswer}
            bind:block={block}
            clickHandler={nextBlock}
            {errorMessage}
          />
        {/if}
      </div>
    </div>

  {:else if layout === 'Split-left'}
    <div class="flex flex-col md:flex-row w-full min-h-screen">

      {#if coverImage}
        <div
          class="w-full md:w-1/2 h-48 md:h-auto bg-cover bg-center"
          style={`background-image: url('${coverImage}')`}
        />
      {/if}

      <div
        class="w-full md:w-1/2 flex flex-col justify-center items-center p-4"
        style={`
          color: ${form?.meta?.questionColor || 'inherit'};
          background-color: ${form?.meta?.backgroundColor || 'transparent'};
        `}
      >
        {#if block}
          <BlockView
            uiMeta={form?.meta}
            canAnswer={canAnswer}
            bind:block={block}
            clickHandler={nextBlock}
            {errorMessage}
          />
        {/if}
      </div>

    </div>

  {:else if layout === 'Split-right'}
    <div class="flex flex-col md:flex-row w-full min-h-screen">

      <div
        class="w-full md:w-1/2 flex flex-col justify-center items-center p-4"
        style={`
          color: ${form?.meta?.questionColor || 'inherit'};
          background-color: ${form?.meta?.backgroundColor || 'transparent'};
        `}
      >
        {#if block}
          <BlockView
            uiMeta={form?.meta}
            canAnswer={canAnswer}
            bind:block={block}
            clickHandler={nextBlock}
            {errorMessage}
          />
        {/if}
      </div>

      {#if coverImage}
        <div
          class="w-full md:w-1/2 h-48 md:h-auto bg-cover bg-center"
          style={`background-image: url('${coverImage}')`}
        />
      {/if}

    </div>

  {:else}
    <div
      class="flex items-center justify-center min-h-screen w-full"
      style={`
        color: ${form?.meta?.questionColor || 'inherit'};
        background-color: ${form?.meta?.backgroundColor || 'transparent'};
      `}
    >
      {#if block}
        <BlockView
          uiMeta={form?.meta}
          canAnswer={canAnswer}
          bind:block={block}
          clickHandler={nextBlock}
          {errorMessage}
        />
      {/if}
    </div>
  {/if}

</FontFrame>
