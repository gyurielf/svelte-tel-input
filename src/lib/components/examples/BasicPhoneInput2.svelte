<script lang="ts">
	import { onMount } from 'svelte';
	import TelInput from '$lib/components/Input/TelInput.svelte';
	import { getCurrentCountry } from '$lib/utils/helpers';
	import type { NormalizedTelNumber, Country, E164Number } from '$lib/types';
	import { normalizedCountries } from '$lib/assets';

	// Tel input
	let initialValue = '+36207654321';
	// let initialValue: E164Number | null = null;

	// Countries
	let selectedCountry: Country | null = null;

	// let selectedCountry: Country | null = {
	// 	id: 'HU',
	// 	label: 'Hungary (Magyarország) +36',
	// 	name: 'Hungary (Magyarország)',
	// 	iso2: 'HU',
	// 	dialCode: '36',
	// 	priority: 0,
	// 	areaCodes: null
	// };

	// Validity of inputs
	let dataIsValid = {
		enteredTelInput: true
	};

	// let parsedTelInput: NormalizedTelNumber | null = null;
	let parsedTelInput: NormalizedTelNumber | null = {
		countryCode: 'HU',
		isValid: true,
		phoneNumber: '+36301234567',
		countryCallingCode: '36',
		formattedNumber: '+36 30 123 4567',
		nationalNumber: '301234567',
		formatInternational: '+36 30 123 4567',
		formatOriginal: '30 123 4567',
		formatNational: '06 30 123 4567',
		uri: 'tel:+36301234567',
		e164: '+36301234567'
	};

	onMount(async () => {
		// Get current country on initialization by GeoIp
		// const currentCountry = await getCurrentCountry();
		// if (currentCountry && currentCountry.length === 2)
		// 	selectedCountry = normalizedCountries.find((el) => el.id === currentCountry) || null;
	});

	$: console.log(parsedTelInput);
</script>

<TelInput
	country={selectedCountry?.iso2}
	bind:parsedTelInput
	{initialValue}
	class="px-4 py-1 text-gray-900 focus:outline-none rounded-sm {dataIsValid.enteredTelInput
		? ' border-none border-0'
		: 'border-2 border-red-600'}"
/>
