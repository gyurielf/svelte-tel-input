<script lang="ts">
	import type { NormalizedPhoneNumber } from '$lib/types/interfaces/Phone.interface';
	import { jsonPrettyParser } from '$lib/utils/helpers';

	export let exampleData: NormalizedPhoneNumber;
	$: exampleDataEntries =
		(exampleData && exampleData !== null && Object.entries(exampleData)) || [];
</script>

<div class="validation-table grid grid-cols-2 mt-5 border rounded-sm border-gray-100 p-3 font-mono">
	<div class="grid grid-cols-2">
		<div>
			<h3 class="text-lg font-semibold">Key</h3>
			{#each exampleDataEntries as [key, _]}
				<div>{key}</div>
			{/each}
		</div>
		<div>
			<h3 class="text-lg font-semibold">Value</h3>
			{#each exampleDataEntries as [_, value]}
				<div>{value}</div>
			{/each}
		</div>
	</div>
	<div class="grid">
		<h3 class="text-lg font-semibold">Payload</h3>
		<pre lang="no-highlight" class="whitespace-pre-wrap " use:jsonPrettyParser={exampleData} />
	</div>
</div>
