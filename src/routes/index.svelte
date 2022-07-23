<script lang="ts">
	import { normalizedCountries } from '$lib/assets';
	import Select from '$lib/components/Select/Select.svelte';
	import { normalizePhoneInput } from '$lib/utils/helpers';
	import Usage from '$lib/views/Usage.svelte';
	import type { PhoneNumber } from 'libphonenumber-js';

	const jsonPrettyParser = (node: HTMLElement, normalizer: Record<string, any>) => {
		return {
			update() {
				node.innerHTML = `<code>${JSON.stringify(
					normalizePhoneInput(exampleData),
					null,
					2
				)}</code>`;
			},
			destroy() {
				node.innerHTML = '';
			}
		};
	};

	let exampleData: PhoneNumber;

	$: myData = exampleData ? normalizePhoneInput(exampleData) : {};
	$: exampleDataEntries = (exampleData && Object.entries(normalizePhoneInput(exampleData))) || [];
</script>

<svelte:head>
	<title>Svelte Tel Input</title>
</svelte:head>

<div class="container mx-auto text-gray-200">
	<div class="grid">
		<div class="grid grid-cols-2">
			<div class="grid gap-4">
				<h1 class="text-2xl my-2">SVELTE-TEL-INPUT</h1>
				<Usage bind:data={exampleData} />
			</div>
			<Select items={normalizedCountries} />
		</div>
		<div class="grid grid-cols-2">
			<div
				class="validation-table grid grid-cols-2 mt-5 border rounded-sm border-gray-100 p-3 font-mono"
			>
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
					<pre
						lang="no-highlight"
						class="whitespace-pre-wrap "
						use:jsonPrettyParser={myData}
					/>
				</div>
			</div>
		</div>
	</div>
</div>
