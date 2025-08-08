<script>
  import { onMount } from 'svelte';
  import FontFaceObserver from 'fontfaceobserver';
  let {fontName = 'Roboto', fontScale = 'medium',  fallback = 'sans-serif'} =$props();

  const sizeMap = {
    small: '1rem',
    medium: '1.5rem',
    large: '2rem'
  };

  let fontSize = $derived(sizeMap[fontScale] || '1.5rem');
  let loaded = $state(false);

  function loadGoogleFont(font) {
    const formatted = font.replace(/ /g, '+');
    if (!document.getElementById(`gf-${formatted}`)) {
      const link = document.createElement('link');
      link.id = `gf-${formatted}`;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${formatted}&display=swap`;
      document.head.appendChild(link);
    }
  }

  onMount(() => {
    loadGoogleFont(fontName);
    const observer = new FontFaceObserver(fontName);
    observer.load(null, 10000).then(() => {
      loaded = true;
    }).catch(() => {
      loaded = false;
    });
  });
</script>

{#if loaded}
  <div style="font-family: '{fontName}', {fallback}; font-size: {fontSize}; transition: opacity 0.3s;">
    <slot />
  </div>
{:else}
  <div style="font-family: {fallback}; font-size: {fontSize}; opacity: 0.5;">
    <slot />
  </div>
{/if}
