<script>
  import { APP_URL } from '../utils/global.js';

  export let message = "Thank you! 🙌";
  export let subtext = "That's all. You may now close this window.";
  export let formMode = false;
</script>

<div class="flex flex-col items-center justify-center min-h-screen text-center px-4">
  <h1 class="text-3xl font-bold mb-4">{message}</h1>
  <p class="text-lg mb-8">{subtext}</p>

  <a 
    href={formMode ? "https//fabform.io" : "#"} 
    target="_blank" 
    class="text-sm px-6 py-3 rounded-md bg-black text-white hover:bg-gray-800 
           {formMode ? '' : 'opacity-50 pointer-events-none'}"
  >
    Create your own FabForm
  </a>
</div>
