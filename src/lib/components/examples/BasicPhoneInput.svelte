<script lang="ts">
	import { onMount } from 'svelte';
	import TelInput from '$lib/components/Input/TelInput.svelte';
	import { getCurrentCountry } from '$lib/utils/helpers';
	// Assets
	import type { NormalizedPhoneNumber } from '$lib/types/interfaces/Phone.interface';
	import type { Country } from '$lib/types';
	import { normalizedCountries } from '$lib/assets';
	import ExamplePayload from '$lib/components/utils/ExamplePayload.svelte';
	import Select from '$lib/components/Select/Select.svelte';

	// Tel input
	let rawPhoneInput: string;

	// Countries
	let selectedCountry: Country | null = null;

	// Validity of inputs
	let dataIsValid = {
		enteredTelInput: true
	};

	let parsedPhoneInput: NormalizedPhoneNumber;

	onMount(async () => {
		// Get current country on initialization by GeoIp
		const currentCountry = await getCurrentCountry();
		if (currentCountry.length === 2)
			selectedCountry = normalizedCountries.find((el) => el.id === currentCountry) || null;
	});
</script>

<Select items={normalizedCountries} bind:selected={selectedCountry} />

<TelInput
	defaultCountry={selectedCountry?.iso2}
	bind:parsedPhoneInput
	bind:rawPhoneInput
	class="px-4 py-1 text-gray-900 focus:outline-none rounded-sm {dataIsValid.enteredTelInput
		? ' border-none border-0'
		: 'border-2 border-red-600'}"
/>
<ExamplePayload bind:exampleData={parsedPhoneInput} />
