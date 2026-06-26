<script>
	let {
		choices = [],
		choiceSelected,
		value = $bindable(),
		canAnswer = true,
		props
	} = $props();

	let selectedValue = $state(value ?? '');

	$effect(() => {
		selectedValue = value ?? '';
	});

	function handleChange() {
		value = selectedValue;
		choiceSelected?.(selectedValue);
	}
</script>

<div class="relative w-full">
	<select
		bind:value={selectedValue}
		onchange={handleChange}
		disabled={!canAnswer}
		class={`appearance-none block w-full bg-background border-0 border-b-2 border-solid text-xl py-2 pr-10 pl-0 outline-none transition-colors duration-200
			${
				canAnswer
					? 'border-gray-400 text-foreground focus:border-indigo-500 cursor-pointer'
					: 'border-gray-200 text-muted-foreground cursor-not-allowed'
			}`}
	>
		{#if props?.placeholder}
			<option value="" disabled hidden>
				{props.placeholder}
			</option>
		{/if}

		{#each choices as choice}
			<option value={choice}>{choice}</option>
		{/each}
	</select>

	<!-- Custom dropdown arrow -->
	<div class="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 pr-2 text-gray-500">
		<svg
			class="h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
			/>
		</svg>
	</div>
</div>
