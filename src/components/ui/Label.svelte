<script>
  const { size = 'Medium', forId = '', color = '#000000', children } = $props();

  const sizeValues = {
    Small: '1.25rem',       // ~20px
    Medium: '1.5rem',       // ~24px
    Large: '2rem',          // ~32px
    'Extra Large': '2.5rem' // ~40px
  };

  const styleString = $derived(() =>
    `color: ${color}; font-size: ${sizeValues[size] ?? sizeValues['Medium']}; font-weight: 600;`
  );
</script>

<label for={forId} style={styleString()}>
  {@render children?.()}
</label>
