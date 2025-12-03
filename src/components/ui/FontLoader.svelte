<script>
  import { onMount } from 'svelte';
  import WebFont from 'webfontloader';

  let { uiMeta} = $props();

  const sizeMap = {
    Small: '0.875rem',      // ~14px
    Medium: '1rem',         // ~16px
    Large: '1.75rem',       // ~28px
    'Extra Large': '2.5rem' // ~40px
  };

  let fontSize = $derived(sizeMap[uiMeta.fontSize] || '1rem');
  let loaded = $state(false);

  function loadGoogleFont() {
  
    WebFont.load({
      google: { families: [uiMeta.fontFamily] },
      active: () => { loaded = true; },
      inactive: () => { loaded = false; }
    });
  }

  onMount(() => {
    loadGoogleFont();
  });
</script>
{uiMeta}
{#if loaded}
<p>****************</p>
<p> fontFamily {uiMeta.fontFamily}</p>
<p> fontSize {uiMeta.fontSize}</p>

  <div style="font-family: '{uiMeta.fontFamily}', {fallback}; font-size: {fontSize}; transition: opacity 0.3s;">
    <slot />
  </div>
{:else}
  <div style="font-family: {fallback}; font-size: {fontSize}; opacity: 0.5;">
    <slot />
  </div>
{/if}
