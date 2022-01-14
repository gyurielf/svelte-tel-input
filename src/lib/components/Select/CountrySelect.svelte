<script lang="ts">
    import rawCountries from '$lib/assets/countries';
    let selectedCountry: string;
</script>

<select
    name="countrySelect"
    class="text-gray-700"
    bind:value={selectedCountry}
    on:change={() => console.log(selectedCountry)}
>
    {#each rawCountries as country}
        <option value={country[2]}>{country[0]}</option>
    {/each}
</select>
