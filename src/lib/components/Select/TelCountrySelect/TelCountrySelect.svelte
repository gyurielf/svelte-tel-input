<script lang="ts">
	import { selectedCountryStore } from '$lib/stores';

	export let selectedCountry: string;

	const setSelectedCountry = (value: string) => {
		selectedCountry = value;
		$selectedCountryStore = value;
	};

	// const getCountries = (list = []) => {
	//     return list.map((countryCode) => findCountry(countryCode)).filter(Boolean);
	// };

	// const findCountry = (iso: string) => {
	//     return filteredCountries.find((country) => country.iso2 === iso.toUpperCase());
	// };
	// const findCountryByDialCode = (dialCode: any) => {
	//     return filteredCountries.find((country) => Number(country.dialCode) === dialCode);
	// };

	// $: filteredCountries = () => {
	//     // List countries after filtered
	//     if (onlyCountries.length) {
	//         return allCountries.filter(({ iso2 }) =>
	//             onlyCountries.some((c) => c.toUpperCase() === iso2)
	//         );
	//     }
	//     if (ignoredCountries.length) {
	//         return allCountries.filter(
	//             ({ iso2 }) =>
	//                 !ignoredCountries.includes(iso2.toUpperCase()) &&
	//                 !ignoredCountries.includes(iso2.toLowerCase())
	//         );
	//     }
	//     return allCountries;
	// };

	// $: sortedCountries = () => {
	//     // Sort the list countries: from preferred countries to all countries
	//     const preferredCountries = getCountries(preferredCountries).map((country) => ({
	//         ...country,
	//         preferred: true
	//     }));
	//     return [...preferredCountries, ...filteredCountries];
	// };

	// const getDefault(key: string) => {
	//     const value = utils.options[key];
	//     if (typeof value === 'undefined') {
	//         return utils.options[key];
	//     }
	//     return value;
	// }
</script>

<select
	name="country_select"
	class="some-class {$$props.class}"
	on:change={(e) => setSelectedCountry(e.currentTarget.value)}
	bind:value={selectedCountry}
>
	<slot name="options" />
</select>
