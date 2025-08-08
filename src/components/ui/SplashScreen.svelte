<script>
    import { Rocket } from 'lucide-svelte';
    import { onMount } from 'svelte';
  
    let progress = 0;
  
    onMount(() => {
      const interval = setInterval(() => {
        if (progress < 100) {
          progress += 1;
        } else {
          clearInterval(interval);
        }
      }, 20);
    });
  </script>
  
  <div class="w-screen min-h-screen flex items-center justify-center bg-neutral-50 text-gray-800 animate-fadeIn">
    <div class="flex flex-col items-center gap-2">
      <!-- Powered By -->
      <div class="text-sm text-gray-600 font-light tracking-wide animate-fadeIn delay-100">
        Powered By
      </div>
  
      <!-- Icon + FabForm text -->
      <div class="flex items-center gap-2 animate-slideUp delay-200">
        <Rocket class="w-8 h-8 text-pink-500 drop-shadow animate-pulse-slow" />
        <span class="text-xl font-semibold tracking-tight animate-bounce-slow">FabForm</span>
      </div>
  
      <!-- Progress Bar -->
      <div class="w-48 h-2.5 mt-3 bg-neutral-300 rounded-full overflow-hidden animate-slideIn delay-300">
        <div
          class="h-full bg-pink-500 transition-all duration-700 ease-out"
          style="width: {progress}%"
        ></div>
      </div>
    </div>
  </div>
  
  <style>
    .animate-fadeIn {
      animation: fadeIn 0.8s ease forwards;
      opacity: 0;
    }
  
    .animate-slideUp {
      animation: slideUp 0.6s ease forwards;
      transform: translateY(20px);
      opacity: 0;
    }
  
    .animate-slideIn {
      animation: slideIn 0.6s ease forwards;
      transform: translateY(10px);
      opacity: 0;
    }
  
    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    .delay-300 { animation-delay: 0.3s; }
  
    @keyframes fadeIn {
      to { opacity: 1; }
    }
  
    @keyframes slideUp {
      to { transform: translateY(0); opacity: 1; }
    }
  
    @keyframes slideIn {
      to { transform: translateY(0); opacity: 1; }
    }
  
    /* Custom slow pulse and bounce */
    .animate-pulse-slow {
      animation: pulse 2.5s ease-in-out infinite;
    }
  
    .animate-bounce-slow {
      animation: bounce 2.4s ease infinite;
    }
  
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.05); }
    }
  
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
  </style>
  