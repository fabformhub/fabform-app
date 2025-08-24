<script>
  import { onMount } from 'svelte';
  import { RefreshCw, Undo2 } from 'lucide-svelte';

  export let value = '';
  // export let canAnswer = true; // <-- Can re-add later

  let canvas;
  let ctx;
  let strokes = [];
  let currentStroke = [];
  let isDrawing = false;

  function resizeCanvas() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    const savedStrokes = [...strokes];

    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx = canvas.getContext('2d');
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    strokes = savedStrokes;
    redraw();
  }

  function getPos(event) {
    const rect = canvas.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function startDraw(event) {
    // if (!canAnswer) return;  <-- Can re-enable later
    isDrawing = true;
    currentStroke = [];
    strokes = [...strokes, currentStroke];
    currentStroke.push(getPos(event));
  }

  function draw(event) {
    // if (!canAnswer || !isDrawing) return;  <-- Can re-enable later
    if (!isDrawing) return;
    currentStroke.push(getPos(event));
    redraw();
  }

  function stopDraw() {
    // if (!canAnswer || !isDrawing) return;  <-- Can re-enable later
    if (!isDrawing) return;
    isDrawing = false;
    saveSignature();
  }

  function controlPoints(p0, p1, p2, p3) {
    const smoothing = 0.2;
    const cp1x = p1.x + (p2.x - p0.x) * smoothing;
    const cp1y = p1.y + (p2.y - p0.y) * smoothing;
    const cp2x = p2.x - (p3.x - p1.x) * smoothing;
    const cp2y = p2.y - (p3.y - p1.y) * smoothing;
    return [{ x: cp1x, y: cp1y }, { x: cp2x, y: cp2y }];
  }

  function redraw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#4f46e5';

    for (const stroke of strokes) {
      if (stroke.length < 2) continue;
      ctx.beginPath();
      for (let i = 0; i < stroke.length - 1; i++) {
        const p0 = stroke[i - 1] || stroke[i];
        const p1 = stroke[i];
        const p2 = stroke[i + 1];
        const p3 = stroke[i + 2] || p2;
        if (i === 0) ctx.moveTo(p1.x, p1.y);
        const [cp1, cp2] = controlPoints(p0, p1, p2, p3);
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p2.x, p2.y);
      }
      ctx.stroke();
    }
  }

  function clearCanvas() {
    strokes = [];
    currentStroke = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    value = '';
  }

  function undoStroke() {
    strokes = strokes.slice(0, -1);
    redraw();
    saveSignature();
  }

  function saveSignature() {
    if (!strokes.length) {
      value = '';
      return;
    }
    value = canvas.toDataURL('image/png');
  }

  onMount(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  });
</script>

<div class="relative">
  <canvas
    bind:this={canvas}
    class="w-full h-64 rounded-md border-2 border-dotted border-gray-400 bg-white"
    on:mousedown={startDraw}
    on:mousemove={draw}
    on:mouseup={stopDraw}
    on:mouseleave={stopDraw}
    on:touchstart|preventDefault={startDraw}
    on:touchmove|preventDefault={draw}
    on:touchend|preventDefault={stopDraw}
  ></canvas>

  <!-- Clear Button -->
  <button
    type="button"
    on:click={clearCanvas}
    class="absolute -bottom-10 left-0 flex items-center gap-1 text-sm px-2 py-1 text-indigo-600 hover:text-indigo-800 focus:outline-none"
  >
    <RefreshCw class="w-4 h-4" /> Clear
  </button>

  <!-- Undo Button -->
  {#if strokes.length}
    <button
      type="button"
      on:click={undoStroke}
      class="absolute top-2 right-2 flex items-center gap-1 text-sm px-2 py-1 text-indigo-600 hover:text-indigo-800 bg-white rounded shadow focus:outline-none"
    >
      <Undo2 class="w-4 h-4" /> Undo
    </button>
  {/if}
</div>
