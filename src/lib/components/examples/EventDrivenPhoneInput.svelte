<script lang="ts">
	import TelInput from '$lib/components/Input/TelInput.svelte';
	import { normalizedCountries } from '$lib/assets';
	import type { NormalizedTelNumber, E164Number, CountryCode } from '$lib/types';

	// E164 formatted value, usually you should store and use this.
	export let value: E164Number | null;

	// Selected country
	export let country: CountryCode | null = null;

	// Validity
	export let valid: boolean;

	// Phone number details
	export let parsedTelInput: (NormalizedTelNumber | Partial<NormalizedTelNumber>) | null = null;

	const handleParsedTelInput = (e: CustomEvent<Partial<NormalizedTelNumber | null>>) => {
		parsedTelInput = e.detail;
	};

	const handleTelInput = (e: CustomEvent<Partial<NormalizedTelNumber | null>>) => {
		value = e.detail?.e164 ?? null;
	};
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
		bind:value={country}
	>
		<option value={null} hidden={country !== null}>Please select</option>
		{#each normalizedCountries as currentCountry (currentCountry.id)}
			<option
				value={currentCountry.iso2}
				selected={currentCountry.iso2 === country}
				aria-selected={currentCountry.iso2 === country}
			>
				{currentCountry.iso2} (+{currentCountry.dialCode})
			</option>
		{/each}
	</select>

	<TelInput
		bind:country
		bind:valid
		{value}
		on:parseInput={(e) => {
			handleParsedTelInput(e);
			handleTelInput(e);
		}}
		class="px-4 py-1 w-full bg-gray-50 dark:bg-gray-700 
        dark:placeholder-gray-400 dark:text-white text-gray-900 focus:outline-none rounded-r-lg {valid
			? 'border border-gray-300 border-l-gray-100 dark:border-l-gray-700 dark:border-gray-600'
			: 'border-2 border-red-600'}"
	/>
	<button class="ml-4 px-4 py-2 rounded bg-blue-500 text-white" on:click={() => (value = null)}
		>Reset</button
	>
</div>
