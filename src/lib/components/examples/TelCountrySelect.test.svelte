<script lang="ts">
    import CountrySelect from '$lib/components/Select/TelCountrySelect/TelCountrySelect.svelte';
    import { getCountries } from 'libphonenumber-js';
    const countries = getCountries();
    let selectedCountry: string;
</script>

<!-- Whis way you can build your own country select component. You can both style and add your own logic. -->
<CountrySelect bind:selectedCountry class="text-gray-800">
    <svelte:fragment slot="options">
        <option value="" selected={true} hidden={true}>Choose here</option>
        {#each countries as country (country)}
            <option class="text-red-500" value={country}>{country}</option>
        {/each}
    </svelte:fragment>
</CountrySelect>
