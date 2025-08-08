import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
    vitePlugin: {
    inspector: {
      toggleKeyCombo: 'alt-x',
      showToggleButton: 'always',
      toggleButtonPos: 'bottom-right'
    }
  },
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
}
