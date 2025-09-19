<script>
  export let code = `<div class="text-red-500">Hello World</div>`;
  let copied = false;

  async function copyCode() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for sandboxed iframes
        const textarea = document.createElement("textarea");
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }
</script>

<div class="relative bg-gray-900 text-gray-100 rounded-xl p-4">
  <pre class="overflow-x-auto text-sm"><code>{code}</code></pre>

  <button
    class="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm transition relative group"
    on:click={copyCode}
  >
    Copy
    <span
      class="absolute -top-8 right-1/2 translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition duration-200"
      class:opacity-100={copied}
    >
      {copied ? "Copied!" : "Copy to clipboard"}
    </span>
  </button>
</div>
