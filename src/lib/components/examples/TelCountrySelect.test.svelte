<script lang="ts">
	import CountrySelect from '$lib/components/Select/TelCountrySelect/TelCountrySelect.svelte';
	import { getCountries } from 'libphonenumber-js';
	import { getCurrentCountry } from '$lib/utils/helpers';
	import { onMount } from 'svelte';

	const countries = getCountries();
	let selectedCountry: string;

	onMount(async () => {
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
