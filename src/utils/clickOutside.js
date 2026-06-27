// src/lib/utils/clickOutside.js
export function clickOutside(node, callbackFn) {
  const handlePointerDown = (event) => {
    const path = event.composedPath?.() || [];

    // works correctly with portals
    if (!path.includes(node)) {
      callbackFn?.();
    }
  };

  document.addEventListener('pointerdown', handlePointerDown, true);

  return {
    update(newCallback) {
      callbackFn = newCallback;
    },
    destroy() {
      document.removeEventListener('pointerdown', handlePointerDown, true);
    }
  };
}
