<script>
  export let content; // a function returning markup (like a snippet)
  export let parent = document.body;

  let portalNode;

  // Portal action: append node to parent and clean up automatically
  function portalAction(node) {
    portalNode = node;
    parent.appendChild(node);

    return {
      destroy() {
        if (portalNode?.parentNode) {
          portalNode.parentNode.removeChild(portalNode);
        }
      }
    };
  }
</script>

<div use:portalAction>
  {@render content()} <!-- render the passed function/snippet -->
</div>
