<script>
  import { getComponent } from "../../utils/getComponent.js";
  import { Button } from '../ui/index.js';
  import { AlertTriangle } from 'lucide-svelte';

  let { block = $bindable({}), uiMeta= $bindable({}), canAnswer, clickHandler, errorMessage } = $props();
  let SvelteComponent = $derived(getComponent(block?.meta?.component));
</script>

<!-- Outer container -->
<div
  class={`relative ${canAnswer 
    ? 'flex items-center justify-center w-screen h-screen px-6' 
    : 'max-w-lg px-4 pt-8 mx-auto mt-5'
  }`}
>
  <!-- Inner form block wrapper -->
  <div class="w-full max-w-md">

    {#if block.meta?.title}
      <div>
        <label 
          for="title" 
          class={`block text-${uiMeta.fontSize} font-medium`} 
          style={`color: ${uiMeta.questionColor};`}
        >
          {block.meta?.title}
        </label>
      </div>      
    {/if}

    {#if block.meta?.question}
      <div>
        <label 
          for="question" 
          class={`block text-${uiMeta.fontSize} font-medium`} 
          style={`color: ${uiMeta.questionColor};`}
        >
          {block.meta?.question}
        </label>
      </div>      
    {/if}

    {#if block?.meta?.description}
      <div>
        <label 
          for="description" 
          class={`block text-${uiMeta.fontSize} font-normal`} 
          style={`color: ${uiMeta.questionColor};`}
        >
          {block.meta?.description}
        </label>
      </div>      
    {/if}

    {#if block && SvelteComponent}
      <SvelteComponent
        bind:value={block.value}
        {canAnswer}
        props={block.meta?.props}
      />
    {/if}

    <!-- Don't show button if it's a thank-you block -->
    {#if block?.meta?.blockTypeId !== 99}
      <div class="mt-4 flex">
        <Button 
          style={`background-color: ${uiMeta.buttonColor}; color: ${uiMeta.buttonTextColor};`}
          text={block?.meta?.buttonText} 
          onclick={clickHandler} 
        />
      </div>
    {/if}

    {#if errorMessage}
      <div class="mt-4 flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
        <AlertTriangle size={20} class="text-red-600 flex-shrink-0" />
        <p class="text-sm">{errorMessage}</p>
      </div>
    {/if}

  </div>
</div>
