<script lang="ts">
	import { onMount } from 'svelte';
	import TelInput from '$lib/components/Input/TelInput.svelte';
	import { normalizedCountries } from '$lib/assets';
	import type { NormalizedTelNumber, E164Number, CountryCode } from '$lib/types';

	// E164 formatted value, usually you should store and use this.
	let value: E164Number | null = '+14842918723';
	// Countries
	let selectedCountry: CountryCode | null = null;
	export let parsedTelInput: NormalizedTelNumber | null = null;
	// let parsedTelInput: NormalizedTelNumber | null = {
	// 	countryCode: 'HU',
	// 	isValid: true,
	// 	phoneNumber: '+36301234567',
	// 	countryCallingCode: '36',
	// 	formattedNumber: '+36 30 123 4567',
	// 	nationalNumber: '301234567',
	// 	formatInternational: '+36 30 123 4567',
	// 	formatOriginal: '30 123 4567',
	// 	formatNational: '06 30 123 4567',
	// 	uri: 'tel:+36301234567',
	// 	e164: '+36301234567'
	// };

	let isValid: boolean;
	let dataIsValid = {
		enteredTelInput: true
	};

	onMount(async () => {
		// Get current country on initialization by GeoIp
		// const currentCountry = await getCurrentCountry();
		// if (currentCountry && currentCountry.length === 2)
		// 	selectedCountry = normalizedCountries.find((el) => el.id === currentCountry) || null;
	});

	$: dataIsValid.enteredTelInput = isValid;

	// const setSelectedCountry = (countryCode: string) => {
	// 	if (countryCode === 'null') {
	// 		selectedCountry = null;
	// 		return;
	// 	}
	// 	selectedCountry = countryCode as CountryCode;
	// };
</script>

<div class="flex">
	<select
		class="form-select appearance-none
    block   
    px-3
    py-1.5
    text-base
    font-normal
    bg-clip-padding bg-no-repeat cursor-pointer
    text-gray-500 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600
    m-0
    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
		aria-label="Default select example"
		name="Country"
		bind:value={selectedCountry}
	>
		<option value={null} hidden={selectedCountry !== null}>Please select</option>
		{#each normalizedCountries as country}
			<option
				value={country.iso2}
				selected={country.iso2 === selectedCountry}
				aria-selected={country.iso2 === selectedCountry}
			>
				{country.iso2} (+{country.dialCode})
			</option>
		{/each}
	</select>

	<TelInput
		bind:country={selectedCountry}
		bind:valid={isValid}
		bind:value
		bind:parsedTelInput
		class="px-4 py-1 w-full bg-gray-50 dark:bg-gray-700 
        dark:placeholder-gray-400 dark:text-white text-gray-900 focus:outline-none rounded-r-lg {dataIsValid.enteredTelInput
			? 'border border-gray-300 border-l-gray-100 dark:border-l-gray-700 dark:border-gray-600'
			: 'border-2 border-red-600'}"
	/>
</div>
