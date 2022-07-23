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

	// let examplePayload = {
	// 	countryCode: 'HU',
	// 	isValid: true,
	// 	phoneNumber: '201231212',
	// 	countryCallingCode: '36',
	// 	formattedNumber: '+36201231212',
	// 	nationalNumber: '201231212',
	// 	formatInternational: '+36 20 123 1212',
	// 	formatNational: '06 20 123 1212',
	// 	uri: 'tel:+36201231212',
	// 	e164: '+36201231212'
	// };
	// $: exampleEntries = Object.entries(examplePayload);

	let exampleData: PhoneNumber;

	// const normalizeData = (data: PhoneNumber): Record<string, any> => {
	// 	if (data) {
	// 		return {
	// 			countryCode: data.country,
	// 			isValid: data.isValid(),
	// 			phoneNumber: data.number,
	// 			countryCallingCode: data.countryCallingCode,
	// 			formattedNumber: data.formatInternational(),
	// 			nationalNumber: data.nationalNumber,
	// 			formatInternational: data.formatInternational(),
	// 			formatNational: data.formatNational(),
	// 			uri: data.getURI(),
	// 			e164: data.number
	// 		};
	// 	} else {
	// 		throw new Error('No data provided');
	// 	}
	// };

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
