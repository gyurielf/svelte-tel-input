<script lang="ts">
	import type { NormalizedTelNumber } from '$lib/types';
	import { jsonPrettyParser } from '$lib/utils/examples/exampleHelpers';

	export let exampleData: NormalizedTelNumber | null;

	$: exampleDataEntries = (exampleData && Object.entries(exampleData)) || [];
</script>

<div
	class="validation-table grid md:grid-cols-2 gap-y-6 md:gap-y-0 mt-5 border rounded-md border-gray-400 dark:border-gray-400 p-3 font-mono"
>
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
