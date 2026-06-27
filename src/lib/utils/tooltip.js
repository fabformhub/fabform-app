// src/actions/tooltip.js

export function tooltip(node, { text = '', position = 'top' }) {
  const tooltip = document.createElement('div');
  tooltip.classList.add(
    'absolute',
    'invisible',
    'bg-gray-700',
    'text-white',
    'text-xs',
    'rounded',
    'py-1',
    'px-2',
    'opacity-0',
    'transition-opacity',
    'duration-300',
    'transform',
    'whitespace-nowrap',
    'z-50' // ensures tooltip stays on top
  );
  tooltip.innerText = text;
  document.body.appendChild(tooltip);

  let suppressHover = false;

  const showTooltip = () => {
    if (suppressHover) return;
    tooltip.style.visibility = 'visible';
    tooltip.style.opacity = '1';
    positionTooltip();
    tooltip.classList.add('animate-tada');
  };

  const hideTooltip = () => {
    tooltip.style.visibility = 'hidden';
    tooltip.style.opacity = '0';
    tooltip.classList.remove('animate-tada');
  };

  const clampToViewport = (value, min, max) => {
    return Math.max(min, Math.min(max, value));
  };

  const positionTooltip = () => {
    const { top, left, width, height } = node.getBoundingClientRect();
    const { offsetWidth: tooltipWidth, offsetHeight: tooltipHeight } = tooltip;

    let tooltipLeft;
    let tooltipTop;

    switch (position) {
      case 'top':
        tooltipLeft = left + width / 2 - tooltipWidth / 2;
        tooltipTop = top - tooltipHeight - 5;
        break;
      case 'bottom':
        tooltipLeft = left + width / 2 - tooltipWidth / 2;
        tooltipTop = top + height + 5;
        break;
      case 'left':
        tooltipLeft = left - tooltipWidth - 5;
        tooltipTop = top + height / 2 - tooltipHeight / 2;
        break;
      case 'right':
        tooltipLeft = left + width + 5;
        tooltipTop = top + height / 2 - tooltipHeight / 2;
        break;
    }

    // Clamp to keep tooltip inside the viewport
    const padding = 8;
    const maxLeft = window.innerWidth - tooltipWidth - padding;
    const maxTop = window.innerHeight - tooltipHeight - padding;

    tooltip.style.left = `${clampToViewport(tooltipLeft, padding, maxLeft)}px`;
    tooltip.style.top = `${clampToViewport(tooltipTop, padding, maxTop)}px`;
  };

  const handleClick = () => {
    hideTooltip();
    suppressHover = true;
  };

  const handleMouseLeave = () => {
    hideTooltip();
    suppressHover = false;
  };

  node.addEventListener('mouseenter', showTooltip);
  node.addEventListener('mouseleave', handleMouseLeave);
  node.addEventListener('click', handleClick);

  return {
    destroy() {
      node.removeEventListener('mouseenter', showTooltip);
      node.removeEventListener('mouseleave', handleMouseLeave);
      node.removeEventListener('click', handleClick);
      document.body.removeChild(tooltip);
    }
  };
}
