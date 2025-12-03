<script>
  import WebFont from "webfontloader";

  let { uiMeta } = $props();

  $effect(() => {
    if (!uiMeta?.fontFamily) return;
    WebFont.load({ google: { families: [uiMeta.fontFamily] } });
  });

  function getPresetClass(size) {
    if (!size) return "preset-medium";
    const normalized = String(size).trim().toLowerCase();
    if (normalized === "small") return "preset-small";
    if (normalized === "medium") return "preset-medium";
    if (normalized === "large") return "preset-large";
    if (normalized === "extra large" || normalized === "extralarge" || normalized === "xl")
      return "preset-xlarge";
    return "preset-medium";
  }
</script>

<div class={getPresetClass(uiMeta?.fontSize)} style={`font-family: '${uiMeta.fontFamily}', sans-serif`}>
  <slot />
</div>

<style>
  /* Dramatic wrapper scaling */
  .preset-small  { font-size: 1.5em; }
  .preset-medium { font-size: 2em; }
  .preset-large  { font-size: 3em; }
  .preset-xlarge { font-size: 4em; }

  /* Headings, paragraphs, and buttons scale relative to wrapper */
  :global(h1)     { font-size: 2em; }
  :global(h2)     { font-size: 1.5em; }
  :global(h3)     { font-size: 1.25em; }
  :global(p)      { font-size: 1em; }
  :global(button) { font-size: 1em; }   /* ✅ button text scales too */

  /* Optional: adjust button padding so they don’t look cramped */
  .preset-small  :global(button) { padding: 0.4em 0.8em; }
  .preset-medium :global(button) { padding: 0.5em 1em; }
  .preset-large  :global(button) { padding: 0.6em 1.2em; }
  .preset-xlarge :global(button) { padding: 0.8em 1.5em; }
</style>
