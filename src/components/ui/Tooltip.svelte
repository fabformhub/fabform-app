<script>
  export let text = '';
  export let position = 'top'; // 'top', 'bottom', 'left', 'right'
  let visible = false;

  function getTooltipPosition() {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-3';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-3';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-3';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-3';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-3';
    }
  }

  function getArrowStyle() {
    switch (position) {
      case 'top':
        return 'absolute left-1/2 top-full -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-8 border-l-transparent border-r-transparent border-t-gray-800';
      case 'bottom':
        return 'absolute left-1/2 bottom-full -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-b-8 border-l-transparent border-r-transparent border-b-gray-800';
      case 'left':
        return 'absolute top-1/2 left-full -translate-y-1/2 w-0 h-0 border-t-6 border-b-6 border-l-8 border-t-transparent border-b-transparent border-l-gray-800';
      case 'right':
        return 'absolute top-1/2 right-full -translate-y-1/2 w-0 h-0 border-t-6 border-b-6 border-r-8 border-t-transparent border-b-transparent border-r-gray-800';
      default:
        return '';
    }
  }
</script>

<div
  class="relative inline-block"
  on:mouseenter={() => (visible = true)}
  on:mouseleave={() => (visible = false)}
>
  <slot />

  {#if visible}
    <div class={`absolute z-50 ${getTooltipPosition()} bg-gray-800 text-white text-sm px-3 py-1 border border-gray-700 shadow-sm whitespace-nowrap`}>
      {text}
      <div class={getArrowStyle()}></div>
    </div>
  {/if}
</div>
