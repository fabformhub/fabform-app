<script>
	let { block = $bindable() } = $props();
	
	import {
		Label, Input, TextArea, Checkbox, Dropdown
	} from "../ui";

	import {
		AlignmentControl,
		CoverImageUploader,
		ChoicesControl,
	} from ".";
</script>

<div class="overflow-y-auto max-h-[calc(100vh-100px)] pr-2 space-y-4">
	{#if block?.meta?.title !== undefined}
		<Label text="Title" />
		<Input bind:value={block.meta.title} />
	{/if}

	{#if block?.meta?.question !== undefined}
		<Label text="Question" />
		<Input bind:value={block.meta.question} />
	{/if}


	{#if block?.meta?.description !== undefined}
		<Label text="Description" />
		<TextArea bind:value={block.meta.description} />
	{/if}

	{#if block?.meta?.embed !== undefined}
		<Label text="Embed" />
		<Input bind:value={block.meta.embed} />
	{/if}

	{#if block?.meta?.props?.choices !== undefined}
		<Label text="Options" />
		<ChoicesControl bind:choices={block.meta.props.choices} />
	{/if}

	{#if block?.meta?.textAlign !== undefined}
		<Label text="Text Align" />
		<AlignmentControl bind:textAlign={block.meta.textAlign} />
	{/if}

	{#if block?.meta?.buttonText !== undefined}
		<Label text="Button Text" />
		<Input bind:value={block.meta.buttonText} />
	{/if}

	{#if block?.meta?.props?.placeholder !== undefined}
		<Label text="Placeholder" />
		<Input bind:value={block.meta.props.placeholder} />
	{/if}

	{#if block?.meta?.props?.size !== undefined}
		<Label text="Textbox Size" />
		<Dropdown
			choices={["Small", "Medium", "Large", "Extra Large"]}
			bind:value={block.meta.props.size}
		/>
	{/if}
<div class="flex gap-2">
	{#if block?.meta?.props?.start !== undefined}
		<Label text="Start" />
		<Dropdown
			choices={["0","1"]}
			bind:value={block.meta.props.start}
		/>
	{/if}
	
	{#if block?.meta?.props?.end !== undefined}
		<Label text="End" />
		<Dropdown
			choices={["3", "4", "5", "6","7","8","9","10"]}
			bind:value={block.meta.props.end}
		/>
	{/if}
	</div>
	{#if block?.meta?.props?.maxRating !== undefined}
		<Label text="Max Rating" />
		<Dropdown
			choices={["3", "4", "5", "6","7","8","9","10"]}
			bind:value={block.meta.props.maxRating}
		/>
	{/if}

	{#if block?.meta?.props?.maxCharacters !== undefined}
		<Label text="Max Characters" />
		<Input bind:value={block.meta.props.maxCharacters} />
	{/if}

	{#if block?.meta?.props?.leftLabel !== undefined}
		<Label text="Left Label" />
		<Input bind:value={block.meta.props.leftLabel} />
	{/if}

	{#if block?.meta?.props?.rightLabel !== undefined}
		<Label text="Right Label" />
		<Input bind:value={block.meta.props.rightLabel} />
	{/if}
	{#if block?.meta?.validation?.required != null}
		<Label text="Required Field" />
		<Checkbox bind:checked={block.meta.validation.required} />
		<Label
			small
			text="If checked, users will be required to complete this field."
		/>
	{/if}

	{#if block?.meta?.validation?.maxLength != null}
		<Label text="Max Characters" />
		<Input bind:value={block.meta.validation.maxLength} />
	{/if}

	{#if block?.meta?.coverImageProps?.coverImage !== undefined}
		<Label text="Cover Image URL" />
		<CoverImageUploader
			bind:coverImage={block.meta.coverImageProps.coverImage}
			blockId={block.id}
		/>
		{#if block.meta.coverImageProps.coverImage != null && block.meta.coverImageProps.coverImage !== ""}
			<Label text="Layout" />
			<Dropdown
				choices={["Wallpaper", "Stack", "Split-left", "Split-right"]}
				bind:value={block.meta.coverImageProps.layout}
			/>
		{/if}
	{/if}
</div>
