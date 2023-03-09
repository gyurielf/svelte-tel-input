<script lang="ts">
	import type { E164Number, NormalizedTelNumber } from '$lib/types';
	import { jsonPrettyParser } from '$lib/utils/examples/exampleHelpers';

	export let exampleData: NormalizedTelNumber | null;
	export let value: E164Number | null;

	$: exampleDataEntries = (exampleData && Object.entries(exampleData)) || [];
</script>

<div
	class="validation-table grid md:grid-cols-2 gap-y-6 md:gap-y-0 mt-5 border rounded-md border-gray-400 dark:border-gray-400 p-3 font-mono"
>
	<div class="grid col-span-full">
		<div class="mb-2">
			<span
				class="bg-gray-100 text-xl text-gray-800 font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
				>value</span
			>
		</div>
	</div>
	<div class="grid grid-cols-2 break-words gap-x-2 md:gap-x-0">
		<div>
			<h3 class="text-lg font-bold">Key</h3>
			<div>value</div>
		</div>
		<div>
			<h3 class="text-lg font-bold">Value</h3>
			<div>{value}</div>
		</div>
	</div>
	<div class="grid">
		<h3 class="text-lg font-bold">Payload</h3>
		{#key value}
			<pre lang="no-highlight" class="whitespace-pre-wrap">"{value}"</pre>
		{/key}
	</div>
	<hr class="col-span-full my-6 divider" />
	<div class="grid col-span-full">
		<div class="mb-2">
			<span
				class="bg-gray-100 text-xl text-gray-800 font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
				>parsedTelInput</span
			>
		</div>
	</div>
	<div class="grid grid-cols-2 break-words gap-x-2 md:gap-x-0">
		<div>
			<h3 class="text-lg font-bold">Key</h3>
			{#each exampleDataEntries as [key, _]}
				<div>{key}</div>
			{/each}
		</div>
		<div>
			<h3 class="text-lg font-bold">Value</h3>
			{#each exampleDataEntries as [_, value]}
				<div>{value}</div>
			{/each}
		</div>
	</div>
	<div class="grid">
		<h3 class="text-lg font-bold">Payload</h3>
		{#key exampleData}
			<pre
				lang="no-highlight"
				class="whitespace-pre-wrap"
				use:jsonPrettyParser={exampleData}
			/>
		{/key}
	</div>
</div>
