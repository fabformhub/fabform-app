<script>
let { block = $bindable() } = $props();
import { Input, TextArea, Checkbox, Dropdown } from "$lib/fabform/ui";
import { AlignmentControl } from ".";
import { ImageUploader } from "$lib/fabform/ui";
import ChoicesControl from "./ChoicesControl.svelte";

  const layoutOptions = [
    { label: "Wallpaper", value: "wallpaper" },
    { label: "Stack", value: "stack" },
    { label: "Split Left", value: "split-left" },
    { label: "Split Right", value: "split-right" }
  ];

</script>

<!-- OUTER LAYOUT: ensures proper flex + height handling -->
<div class="flex flex-col h-full pr-2">
	
	<!-- SCROLL CONTAINER -->
	<div class="flex-1 overflow-y-auto space-y-4 pb-6">

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
				<div class="flex-1">
					<label class="block text-gray-700 font-medium">Start</label>
					<Dropdown choices={["0", "1"]} bind:value={block.meta.props.start} />
				</div>
			{/if}

			{#if block?.meta?.props?.end !== undefined}
				<div class="flex-1">
					<label class="block text-gray-700 font-medium">End</label>
					<Dropdown
						choices={["3", "4", "5", "6", "7", "8", "9", "10"]}
						bind:value={block.meta.props.end}
					/>
				</div>
			{/if}
		</div>

		{#if block?.meta?.props?.maxRating !== undefined}
			<label class="block text-gray-700 font-medium">Max Rating</label>
			<Dropdown
				choices={["3", "4", "5", "6", "7", "8", "9", "10"]}
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
			<div>
				<label class="block text-gray-700 font-medium">Required field</label>
				<Checkbox bind:checked={block.meta.validation.required} />
				<p class="text-gray-500 text-sm mt-1">
					If checked, users will be required to complete this field.
				</p>
			</div>
		{/if}

		{#if block?.meta?.validation?.maxLength != null}
			<label class="block text-gray-700 font-medium">Max Characters</label>
			<Input bind:value={block.meta.validation.maxLength} />
		{/if}

			<label class="block text-gray-700 font-medium">Cover Image</label>

			<ImageUploader
				id={block.id}
				imageType="block"
				bind:image={block.meta.coverImageProps.coverImage}
			/>

<ChoicesControl
  bind:value={block.meta.coverImageProps.layout}
  options={layoutOptions}
/>
		{#if block?.meta?.coverImageProps?.coverImage}
			<label class="block text-gray-700 font-medium mt-2">Layout</label>

{/if}
</div>
</div>
