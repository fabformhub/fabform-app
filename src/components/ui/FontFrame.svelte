<script>
  import WebFont from "webfontloader";

  let { uiMeta } = $props();

  const meta = uiMeta ?? {};

  function getPresetClass(size) {
    if (!size) return "preset-medium";

    const normalized = String(size).trim().toLowerCase();

    if (normalized === "small") return "preset-small";
    if (normalized === "medium") return "preset-medium";
    if (normalized === "large") return "preset-large";
    if (
      normalized === "extra large" ||
      normalized === "extralarge" ||
      normalized === "xl"
    ) {
      return "preset-xlarge";
    }

    return "preset-medium";
  }

  $effect(() => {
    if (!meta.fontFamily) return;

    WebFont.load({
      google: {
        families: [meta.fontFamily]
      }
    });
  });
</script>

<div
  class={getPresetClass(meta.fontSize)}
  style={`font-family: '${meta.fontFamily || "Inter"}', sans-serif`}
>
  <slot />
</div>
