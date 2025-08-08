// src/lib/utils/clickOutside.js
export function clickOutside(node, callbackFn) {
  const handleClick = (event) => {
    if (!node.contains(event.target)) {
      callbackFn?.(); // optional chaining in case it's undefined
    }
  };

  document.addEventListener('mousedown', handleClick, true);

  return {
    update(newCallback) {
      callbackFn = newCallback;
    },
    destroy() {
      document.removeEventListener('mousedown', handleClick, true);
    }
  };
}
