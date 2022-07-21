<script lang="ts">
	import { normalizedCountries } from '$lib/assets';
	import Select from '$lib/components/Select/Select.svelte';
	import Usage from '$lib/views/Usage.svelte';

	const jsonPrettyParser = (node: HTMLElement) => {
		node.innerHTML = `<code>${JSON.stringify(examplePayload, null, 2)}</code>`;
	};

	let examplePayload = {
		countryCode: 'HU',
		isValid: true,
		phoneNumber: '201231212',
		countryCallingCode: '36',
		formattedNumber: '+36201231212',
		nationalNumber: '201231212',
		formatInternational: '+36 20 123 1212',
		formatNational: '06 20 123 1212',
		uri: 'tel:+36201231212',
		e164: '+36201231212'
	};

	$: exampleEntries = Object.entries(examplePayload);
</script>

<svelte:head>
	<title>Svelte Tel Input</title>
</svelte:head>

<div class="container mx-auto text-gray-200">
	<div class="grid">
		<div class="grid grid-cols-2">
			<div class="grid gap-4">
				<h1 class="text-2xl my-2">SVELTE-TEL-INPUT</h1>
				<Usage />
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
						{#each exampleEntries as [key, _]}
							<div>{key}</div>
						{/each}
					</div>
					<div>
						<h3 class="text-lg font-semibold">Value</h3>
						{#each exampleEntries as [_, value]}
							<div>{value}</div>
						{/each}
					</div>
				</div>
				<div class="grid">
					<h3 class="text-lg font-semibold">Payload</h3>
					<pre lang="no-highlight" class="whitespace-pre-wrap " use:jsonPrettyParser />
				</div>
			</div>
		</div>
	</div>
</div>
