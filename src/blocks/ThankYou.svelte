<script>
    const { message = "Thank you! 🙌", subtext = "That's all. You may now close this window." } = $props();
   import { APP_URL } from '../utils/global.js';
  </script>
  
  <div class="flex flex-col items-center justify-center min-h-screen text-center px-4">
    <h1 class="text-3xl font-bold mb-4">{message}</h1>
    <p class="text-lg mb-8">{subtext}</p>
  
    <a 
      href="{APP_URL}" 
      target="_blank" 
      class="bg-black text-white text-sm px-6 py-3 rounded-md hover:bg-gray-800"
    >
      Create your own FabForm
    </a>
  </div>
  