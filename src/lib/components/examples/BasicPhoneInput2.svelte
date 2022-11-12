<script lang="ts">
	import { onMount } from 'svelte';
	import TelInput from '$lib/components/Input/TelInput.svelte';
	import { getCurrentCountry } from '$lib/utils/helpers';
	import type {
		NormalizedTelNumber,
		Country,
		E164Number,
		TelInputValidity,
		CountryCode
	} from '$lib/types';
	import { normalizedCountries } from '$lib/assets';

	// Tel input
	let value: E164Number | null = '+14842918723';
	// let value: E164Number | null = null;

	// Countries
	let selectedCountry: CountryCode | null = null;

	// let selectedCountry: Country | null = {
	// 	id: 'HU',
	// 	label: 'Hungary (Magyarország) +36',
	// 	name: 'Hungary (Magyarország)',
	// 	iso2: 'HU',
	// 	dialCode: '36',
	// 	priority: 0,
	// 	areaCodes: null
	// };

	let isValid: boolean;
	// Validity of inputs
	let dataIsValid = {
		enteredTelInput: true
	};

	let parsedTelInput: NormalizedTelNumber | null = null;
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
	// US +14842918723
	onMount(async () => {
		// Get current country on initialization by GeoIp
		// const currentCountry = await getCurrentCountry();
		// if (currentCountry && currentCountry.length === 2)
		// 	selectedCountry = normalizedCountries.find((el) => el.id === currentCountry) || null;
	});

	$: dataIsValid.enteredTelInput = isValid;

	// $: {
	// 	console.log('===============');
	// 	console.log('VAL');
	// 	console.log(value);
	// }
	// $: {
	// 	console.log('===============');
	// 	console.log('ParsedTelInput');
	// 	console.log(parsedTelInput);
	// }
	// $: {
	// 	console.log('===============');
	// 	console.log('SelectedCountry');
	// 	console.log(selectedCountry);
	// }

	const setSelectedCountry = (countryCode: string) => {
		if (countryCode === 'null') {
			selectedCountry = null;
			return;
		}
		selectedCountry = countryCode as CountryCode;
	};
	$: console.log(value);
</script>

<select
	class="form-select appearance-none
    block   
    px-3
    py-1.5
    text-base
    font-normal
    text-gray-700
    bg-white bg-clip-padding bg-no-repeat
    border border-solid border-gray-300
    rounded
    transition
    ease-in-out
    m-0
    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
	aria-label="Default select example"
	name="Country"
	bind:value={selectedCountry}
	on:change={(e) => {
		setSelectedCountry(e.currentTarget.value);
	}}
>
	<!-- <option value="" selected disabled hidden>Please select</option> -->
	<option value={null} hidden={selectedCountry !== null}>Please select</option>
	<!-- <option value="HU">HU (+36)</option>
	<option value="ES">ES (+??)</option>
	<option value="US">US (+1)</option> -->
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

<!-- <TelInput
	bind:country={selectedCountry}
	bind:valid={isValid}
	bind:value
	bind:parsedTelInput
	class="px-4 py-1 text-gray-900 focus:outline-none rounded-sm {dataIsValid.enteredTelInput
		? ' border-none border-0'
		: 'border-2 border-red-600'}"
/> -->

<TelInput
	bind:country={selectedCountry}
	bind:valid={isValid}
	bind:value
	bind:parsedTelInput
	class="px-4 py-1 text-gray-900 focus:outline-none rounded-sm {dataIsValid.enteredTelInput
		? 'border-none border-0'
		: 'border-2 border-red-600'}"
/>
