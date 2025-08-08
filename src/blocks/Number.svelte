<script>
  let { value = $bindable(), formMode = false, props } = $props();
  let number = $state(value ?? '');

  function handleInput(e) {
    const digitsOnly = e.target.value.replace(/\D/g, '');
    number = digitsOnly;
    value = digitsOnly;
  }

  function handleBeforeInput(e) {
    if (!formMode) {
      e.preventDefault();
      return;
    }

    if (e.data && /\D/.test(e.data)) {
      e.preventDefault();
    }
  }
</script>

<style>
  input.disabled {
    cursor: not-allowed;
  }
  .wrapper.disabled-cursor {
    cursor: pointer;
  }
</style>

<div class={`flex flex-col space-y-2 w-full max-w-xs wrapper ${!formMode ? 'disabled-cursor' : ''}`}>
  <label class="text-gray-700 text-base font-medium">
    {props?.label ?? ''}
  </label>

  <input
    type="text"
    bind:value={number}
    placeholder={props.placeholder}
    oninput={handleInput}
    onbeforeinput={handleBeforeInput}
    tabindex={formMode ? 0 : -1}
    inputmode="numeric"
    pattern="\d*"
    readonly={!formMode}
    class={`w-full bg-transparent text-lg text-center border-b-2 focus:outline-none
      ${formMode
        ? 'text-gray-800 border-gray-300 focus:border-indigo-500 cursor-text'
        : 'text-gray-400 border-gray-200 disabled'}
    `}
  />
</div>
