<script>
  import { onMount } from 'svelte';
  import { Ghost } from 'lucide-svelte';

  let canvas;
  let animationId;
  let particles = [];
  let mouse = { x: null, y: null };

  // Utility random function
  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Initialize particles
  function initParticles() {
    particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: random(1, 3),
        baseR: random(1, 3),
        dx: (Math.random() - 0.5) * 0.6,
        dy: (Math.random() - 0.5) * 0.6,
        opacity: random(0.2, 0.6),
        pulseDir: Math.random() < 0.5 ? 1 : -1,
        hueShift: random(-20, 20),  // small hue shift for color variety
      });
    }
  }

  // Draw connection lines between close particles
  function connectParticles(ctx) {
    const maxDistance = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist < maxDistance) {
          const lineOpacity = 0.2 * (1 - dist / maxDistance);
          ctx.strokeStyle = `rgba(168, 85, 247, ${lineOpacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }

  // Particle-mouse repulsion force
  function repelFromMouse(p) {
    if (mouse.x === null || mouse.y === null) return;

    const maxDist = 100;
    const distX = p.x - mouse.x;
    const distY = p.y - mouse.y;
    const dist = Math.hypot(distX, distY);

    if (dist < maxDist && dist > 0) {
      // Repel force magnitude proportional to distance
      const force = (maxDist - dist) / maxDist * 0.5;
      p.dx += (distX / dist) * force;
      p.dy += (distY / dist) * force;
    }
  }

  function animate(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      // Pulsate radius
      p.r += 0.02 * p.pulseDir;
      if (p.r > p.baseR + 0.5 || p.r < p.baseR - 0.5) {
        p.pulseDir *= -1;
      }

      repelFromMouse(p);

      // Apply some friction to slow particles down
      p.dx *= 0.98;
      p.dy *= 0.98;

      p.x += p.dx;
      p.y += p.dy;

      // Bounce off edges
      if (p.x < 0) { p.x = 0; p.dx *= -1; }
      if (p.x > canvas.width) { p.x = canvas.width; p.dx *= -1; }
      if (p.y < 0) { p.y = 0; p.dy *= -1; }
      if (p.y > canvas.height) { p.y = canvas.height; p.dy *= -1; }

      // Draw particle with hue shift for color variation
      ctx.beginPath();
      ctx.shadowColor = `hsla(${275 + p.hueShift}, 80%, 70%, 0.6)`;
      ctx.shadowBlur = 8;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${275 + p.hueShift}, 70%, 60%, ${p.opacity})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    connectParticles(ctx);

    animationId = requestAnimationFrame(() => animate(ctx));
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  onMount(() => {
    const ctx = canvas.getContext('2d');

    resize();
    animate(ctx);

    // Pause animation when tab inactive
    function handleVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate(ctx);
      }
    }

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Track mouse position for interaction
    function onMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function onMouseLeave() {
      mouse.x = null;
      mouse.y = null;
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout', onMouseLeave);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', onMouseLeave);
      cancelAnimationFrame(animationId);
    };
  });
</script>

<div 
  role="main" 
  aria-label="Page not found error message" 
  class="relative flex items-center justify-center min-h-screen bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-950 text-white overflow-hidden"
>
  <canvas bind:this={canvas} class="absolute inset-0 w-full h-full z-0 pointer-events-none" aria-hidden="true"></canvas>

  <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-0" aria-hidden="true">
    <div class="w-40 h-40 bg-purple-600 rounded-full blur-3xl opacity-30"></div>
  </div>

  <div class="text-center animate-fade-in-up z-10 relative">
    <Ghost 
      class="w-24 h-24 mx-auto text-purple-400 drop-shadow-xl animate-float" 
      aria-hidden="true" 
      focusable="false"
    />
    <h1 class="text-6xl sm:text-7xl font-extrabold mt-6 mb-4 tracking-tight text-white drop-shadow-xl" tabindex="0">
      Oops!
    </h1>
    <p class="text-2xl sm:text-3xl text-zinc-400 font-medium" tabindex="0">
      Page not found <span class="text-purple-400" aria-hidden="true">:(</span>
    </p>
  </div>
</div>

<style>
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .animate-fade-in-up {
    animation: fade-in-up 1s ease-out both;
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
</style>
