// portal.js
export function portal(node, target = 'body') {
  const targetEl = document.querySelector(target);
  if (targetEl) targetEl.appendChild(node);

  return {
    destroy() {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }
  };
}
