<script lang="ts">
	import { onMount } from 'svelte';
	import TelInput from '$lib/components/Input/TelInput.svelte';
	import { getCurrentCountry } from '$lib/utils/helpers';
	import type { NormalizedTelNumber, Country } from '$lib/types.d';
	import { normalizedCountries } from '$lib/assets';

	// Tel input
	let rawPhoneInput: string;

	// Countries
	let selectedCountry: Country | null = null;

	// Validity of inputs
	let dataIsValid = {
		enteredTelInput: true
	};

	let parsedPhoneInput: NormalizedTelNumber;

	onMount(async () => {
		// Get current country on initialization by GeoIp
		const currentCountry = await getCurrentCountry();
		if (currentCountry && currentCountry.length === 2)
			selectedCountry = normalizedCountries.find((el) => el.id === currentCountry) || null;
	});
</script>

<TelInput
	defaultCountry={selectedCountry?.iso2}
	bind:parsedPhoneInput
	bind:rawPhoneInput
	class="px-4 py-1 text-gray-900 focus:outline-none rounded-sm {dataIsValid.enteredTelInput
		? ' border-none border-0'
		: 'border-2 border-red-600'}"
/>
