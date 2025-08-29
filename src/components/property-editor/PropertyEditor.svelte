<script>
	let { block = $bindable() } = $props();
	
	import {
		Input, TextArea, Checkbox, Dropdown
	} from "../ui";

	import {
		AlignmentControl,
		CoverImageUploader,
		ChoicesControl,
	} from ".";
</script>

<div class="overflow-y-auto max-h-[calc(100vh-100px)] pr-2 space-y-4">
	{#if block?.meta?.title !== undefined}
		<label class="block text-gray-700 font-medium">Title</label>
		<Input bind:value={block.meta.title} />
	{/if}

	{#if block?.meta?.question !== undefined}
		<label class="block text-gray-700 font-medium">Question</label>
		<Input bind:value={block.meta.question} />
	{/if}

	{#if block?.meta?.description !== undefined}
		<label class="block text-gray-700 font-medium">Description</label>
		<TextArea bind:value={block.meta.description} />
	{/if}

	{#if block?.meta?.embed !== undefined}
		<label class="block text-gray-700 font-medium">Embed</label>
		<Input bind:value={block.meta.embed} />
	{/if}

	{#if block?.meta?.props?.choices !== undefined}
		<label class="block text-gray-700 font-medium">Options</label>
		<ChoicesControl bind:choices={block.meta.props.choices} />
	{/if}

	{#if block?.meta?.textAlign !== undefined}
		<label class="block text-gray-700 font-medium">Text Align</label>
		<AlignmentControl bind:textAlign={block.meta.textAlign} />
	{/if}

	{#if block?.meta?.buttonText !== undefined}
		<label class="block text-gray-700 font-medium">Button Text</label>
		<Input bind:value={block.meta.buttonText} />
	{/if}

	{#if block?.meta?.props?.placeholder !== undefined}
		<label class="block text-gray-700 font-medium">Placeholder</label>
		<Input bind:value={block.meta.props.placeholder} />
	{/if}

	{#if block?.meta?.props?.size !== undefined}
		<label class="block text-gray-700 font-medium">Textbox Size</label>
		<Dropdown
			choices={["Small", "Medium", "Large", "Extra Large"]}
			bind:value={block.meta.props.size}
		/>
	{/if}

	<div class="flex gap-2">
		{#if block?.meta?.props?.start !== undefined}
			<label class="block text-gray-700 font-medium">Start</label>
			<Dropdown
				choices={["0","1"]}
				bind:value={block.meta.props.start}
			/>
		{/if}
		
		{#if block?.meta?.props?.end !== undefined}
			<label class="block text-gray-700 font-medium">End</label>
			<Dropdown
				choices={["3", "4", "5", "6","7","8","9","10"]}
				bind:value={block.meta.props.end}
			/>
		{/if}
	</div>

	{#if block?.meta?.props?.maxRating !== undefined}
		<label class="block text-gray-700 font-medium">Max Rating</label>
		<Dropdown
			choices={["3", "4", "5", "6","7","8","9","10"]}
			bind:value={block.meta.props.maxRating}
		/>
	{/if}

	{#if block?.meta?.props?.maxCharacters !== undefined}
		<label class="block text-gray-700 font-medium">Max Characters</label>
		<Input bind:value={block.meta.props.maxCharacters} />
	{/if}

	{#if block?.meta?.props?.leftLabel !== undefined}
		<label class="block text-gray-700 font-medium">Left Label</label>
		<Input bind:value={block.meta.props.leftLabel} />
	{/if}

	{#if block?.meta?.props?.rightLabel !== undefined}
		<label class="block text-gray-700 font-medium">Right Label</label>
		<Input bind:value={block.meta.props.rightLabel} />
	{/if}

	{#if block?.meta?.validation?.required != null}
		<label class="block text-gray-700 font-medium">Required field</label>
		<Checkbox bind:checked={block.meta.validation.required} />
		<label class="block text-gray-500 text-sm mt-1">
			If checked, users will be required to complete this field.
		</label>
	{/if}

	{#if block?.meta?.validation?.maxLength != null}
		<label class="block text-gray-700 font-medium">Max Characters</label>
		<Input bind:value={block.meta.validation.maxLength} />
	{/if}

	{#if block?.meta?.coverImageProps?.coverImage !== undefined}
		<label class="block text-gray-700 font-medium">Cover Image URL</label>
		<CoverImageUploader
			bind:coverImage={block.meta.coverImageProps.coverImage}
			blockId={block.id}
		/>
		{#if block.meta.coverImageProps.coverImage != null && block.meta.coverImageProps.coverImage !== ""}
			<label class="block text-gray-700 font-medium">Layout</label>
			<Dropdown
				choices={["Wallpaper", "Stack", "Split-left", "Split-right"]}
				bind:value={block.meta.coverImageProps.layout}
			/>
		{/if}
	{/if}
</div>
