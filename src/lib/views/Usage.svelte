<script lang="ts">
	import type { SelectType } from '$lib/types/Select.type';
	import { onMount } from 'svelte';
	import CountrySelect from '$lib/components/Select/TelCountrySelect/TelCountrySelect.svelte';
	import TelTypeSelect from '$lib/components/Select/TelTypeSelect/TelTypeSelect.svelte';
	import TelTypeSelectOption from '$lib/components/Select/TelTypeSelect/TelTypeSelectOption.svelte';
	import TelInput from '$lib/components/Input/TelInput.svelte';
	import { getCountries, type PhoneNumber } from 'libphonenumber-js';
	import { getCurrentCountry } from '$lib/utils/helpers';
	// Assets
	import { telTypes } from '$lib/assets/telTypes';

	// Tel input
	let phoneInput: string;
	// Countries
	const countries = getCountries();
	let selectedCountry: string | null = null;

	// Validity of inputs
	let dataIsValid = {
		enteredTelInput: true
	};

	// TODO >> sort and order option for telTypes.
	let selectedTelType: SelectType | null = null;

	export let data: PhoneNumber;

	onMount(async () => {
		// Get current country on initialization
		const currentCountry = await getCurrentCountry();
		if (currentCountry.length === 2) selectedCountry = currentCountry;
	});
</script>

<!-- Whis way you can build your own country select component. You can both style and add your own logic. -->
<CountrySelect bind:selectedCountry class="text-gray-800 rounded-sm py-2">
	<svelte:fragment slot="options">
		<option value="" class="my-2" selected={true} hidden={true}>Choose here</option>
		{#each countries as country (country)}
			<option class="text-red-500" value={country}>{country}</option>
		{/each}
	</svelte:fragment>
</CountrySelect>

<TelTypeSelect bind:selectedTelType class="text-gray-800 rounded-sm">
	<svelte:fragment slot="options">
		<option value="" selected={true} hidden={true}>Choose here</option>
		{#each telTypes as telType (telType.id)}
			<TelTypeSelectOption class="text-red-500" typeOption={telType} />
		{/each}
	</svelte:fragment>
</TelTypeSelect>

<TelInput
	bind:parsedPhoneInput={data}
	bind:phoneInput
	class="px-4 py-1 text-gray-900 focus:outline-none rounded-sm {dataIsValid.enteredTelInput
		? ' border-none border-0'
		: 'border-2 border-red-600'}"
/>
