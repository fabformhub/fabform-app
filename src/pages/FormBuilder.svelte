<script>
	import { onMount, setContext } from "svelte";

	import { BlockLayout, BlockPicker } from "../components/form-builder";
	import { AddBlockButton } from "../components/ui";
	import { DefaultLayout, Sidebar } from "../components/layouts";
	import { Dialog } from "../components/dialogs";
	import { DesignEditor } from "../components/design-editor";
	import { PropertyEditor } from "../components/property-editor";
	import { debounce } from "../utils/debounce.js";

	import {
		createBlock,
		getBlocksByFormId,
		updateBlock,
		deleteBlockById,
		getForm,
		updateForm
	} from "$lib/services/formService.js";

	let { route } = $props();

	// STATE
	let showBlockPicker = $state(false);
	let blocks = $state([]);
	let blockNo = $state(0);
	let formId = $state(route?.result?.path?.params?.id);
	let form = $state({});
	let isLoaded = $state(false);

	// -----------------------------
	// AUTOSAVE
	// -----------------------------

	const autoSaveForm = debounce(() => {
		updateForm(form);
	}, 3000);

	const autoSaveBlock = debounce(() => {
		if (blocks[blockNo]) {
			updateBlock(blocks[blockNo]);
		}
	}, 3000);

	$effect(() => {
		if (form) autoSaveForm();
	});

	$effect(() => {
		if (blocks[blockNo]) autoSaveBlock();
	});

	// -----------------------------
	// FETCH DATA
	// -----------------------------

	async function fetchData() {
		try {
			const formRes = await getForm(formId);
			form = formRes?.data?.form;

			const blocksRes = await getBlocksByFormId(formId);

			blocks =
				blocksRes?.data?.blocks
					?.slice()
					?.sort((a, b) => a.meta.blockTypeId - b.meta.blockTypeId) ?? [];

			blockNo = Math.max(0, blocks.length - 2);
			isLoaded = true;
		} catch (err) {
			console.error("FETCH ERROR:", err);
			form = null;
		}
	}

	onMount(fetchData);

	// -----------------------------
	// BLOCK ACTIONS
	// -----------------------------

	async function createBlockPick(block) {
		await createBlock(formId, block);
		await fetchData();
	}

	async function deleteBlock(blockId) {
		const confirmed = await openDialog(
			"Delete Confirmation",
			"Are you sure you want to delete this block?",
			"Cancel",
			"Yes! Delete it"
		);

		if (confirmed) {
			await deleteBlockById(blockId);
			await fetchData();
		}
	}

	const changeBlock = (i) => {
		blockNo = i;
	};

	const handleBlockUpdate = (e) => {
		blocks = blocks.map((b, i) =>
			i === blockNo ? { ...b, ...e.detail } : b
		);
	};

	setContext("blockPickerClick", createBlockPick);
</script>

{#if form}
	<DefaultLayout {form}>

		<!-- ROOT LAYOUT (FIXED) -->
		<main class="flex flex-col h-[100dvh]">

			<!-- top toolbar -->
			<div class="flex justify-center py-2">
				<AddBlockButton largeIcon clickHandler={() => (showBlockPicker = true)} />
			</div>

			<DesignEditor bind:form />

			<BlockPicker
				show={showBlockPicker}
				close={() => (showBlockPicker = false)}
			/>

			<Dialog />

			<!-- MAIN 3-COLUMN LAYOUT -->
			<div class="flex flex-1 min-h-0">

				<!-- LEFT SIDEBAR -->
				<div class="w-1/4 p-2 border-r border-gray-200 overflow-y-auto min-h-0">

					<div class="flex justify-end mb-2">
						<AddBlockButton clickHandler={() => (showBlockPicker = true)} />
					</div>

					<Sidebar
						bind:blockNo={blockNo}
						bind:blocks={blocks}
						{changeBlock}
						{deleteBlock}
					/>
				</div>

				<!-- CENTER PREVIEW -->
				<div class="w-1/2 m-1 border border-dotted border-gray-400 rounded-xl shadow-sm bg-white overflow-y-auto min-h-0 flex items-center justify-center">

					{#if blocks[blockNo]}
						<BlockLayout
							form={form}
							canAnswer={false}
							bind:block={blocks[blockNo]}
							on:updateBlock={handleBlockUpdate}
						/>
					{:else}
						<p class="text-gray-400">No blocks to display</p>
					{/if}

				</div>

				<!-- RIGHT PROPERTY EDITOR -->
				<div class="w-1/4 p-2 border-l border-gray-200 flex flex-col min-h-0">

					{#if blocks[blockNo]}
						<div class="flex-1 min-h-0 overflow-y-auto">
							<PropertyEditor bind:block={blocks[blockNo]} />
						</div>
					{/if}

				</div>

			</div>
		</main>

	</DefaultLayout>
{/if}
