<script lang="ts">
	import type { TelSelectObject } from '$lib/models/interfaces/Select.interface';
	import { onMount } from 'svelte';
	import TelRegionSelect from '$lib/components/Select/TelRegionSelect/TelRegionSelect.svelte';
	import CountrySelect from '$lib/components/Select/TelCountrySelect/TelCountrySelect.svelte';
	import TelInput from '$lib/components/Input/TelInput.svelte';
	import { getCountries } from 'libphonenumber-js';
	import { getCurrentCountry } from '$lib/utils/helpers';
	// Assets
	import { rawRegions } from '$lib/assets/regions';

	// Tel input
	let enteredTelInput: string;
	// Countries
	const countries = getCountries();
	let selectedCountry: string;
	// Region
	let selectedTelRegion: TelSelectObject;

	// Validity of inputs
	let dataIsValid = {
		enteredTelInput: true
	};

	onMount(async () => {
		// Get current country on initialization
		const currentCountry = await getCurrentCountry();
		if (currentCountry.length === 2) selectedCountry = currentCountry;
	});
</script>

<!-- Whis way you can build your own country select component. You can both style and add your own logic. -->
<CountrySelect bind:selectedCountry class="text-gray-800 rounded-sm">
	<svelte:fragment slot="options">
		<option value="" selected={true} hidden={true}>Choose here</option>
		{#each countries as country (country)}
			<option class="text-red-500" value={country}>{country}</option>
		{/each}
	</svelte:fragment>
</CountrySelect>

<TelRegionSelect bind:selectedTelRegion class="text-gray-800">
	<svelte:fragment slot="options">
		<option value="" selected={true} hidden={true}>Choose here</option>
		{#each rawRegions as region (region)}
			<option class="text-red-500" value={region}>{region}</option>
		{/each}
	</svelte:fragment>
</TelRegionSelect>

<TelInput
	bind:enteredTelInput
	class="px-4 py-1 text-gray-900 focus:outline-none rounded-sm {dataIsValid.enteredTelInput
		? ' border-none border-0'
		: 'border-2 border-red-600'}"
/>
