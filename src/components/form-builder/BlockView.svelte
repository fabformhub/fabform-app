<script>
  import { getComponent } from "../../utils/getComponent.js";
  import { Button } from '../ui/index.js';
  import { AlertTriangle } from 'lucide-svelte';
  import { Label } from '../../components/ui';

  let { block = $bindable({}), uiMeta= $bindable({}), formMode, clickHandler, errorMessage } = $props();
  let SvelteComponent = $derived(getComponent(block?.meta?.component));

</script>

<!-- Outer container -->
<div
  class={`relative ${formMode 
    ? 'flex items-center justify-center w-screen h-screen px-6' 
    : 'max-w-lg px-4 pt-8 mx-auto mt-5'
  }`}
>
  <!-- Inner form block wrapper to limit width if desired -->
  <div class="w-full max-w-md">


    {#if block.meta?.title }

      <div>
        <Label size="${uiMeta.fontSize}" forId="title" color="${uiMeta.questionColor}">
         {block.meta?.title }
        </Label>
        </div>      
    {/if}
       {#if block.meta?.question }
      <div>              
          <Label size="${uiMeta.fontSize}" forId="question" color="${uiMeta.questionColor}">
         {block.meta?.question}
        </Label>
        </div>      
    {/if}
    {#if block?.meta?.description  }
      <div>
         <Label size="${uiMeta.fontSize}" forId="description" color="${uiMeta.questionColor}">
         {block.meta?.description }
        </Label>
        </div>      
    {/if}

{#if block && SvelteComponent}
  <SvelteComponent
    bind:value={block.value}
    {formMode}
    props={block.meta?.props}
  />
{/if}

    <div class="mt-4 flex">
      <Button 
      style={`background-color: ${uiMeta.buttonColor}; color: ${uiMeta.buttonTextColor};`}
      text={block?.meta?.buttonText} onclick={clickHandler} />
    </div>

    {#if errorMessage}
      <div class="mt-4 flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
        <AlertTriangle size={20} class="text-red-600 flex-shrink-0" />
        <p class="text-sm">{errorMessage}</p>
      </div>
    {/if}
  </div>
</div>
