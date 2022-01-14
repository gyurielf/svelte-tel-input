<script lang="ts">
    import rawRegions from '$lib/assets/regions';
    let selectedRegion: string;
</script>

<select
    name="countrySelect"
    class="text-gray-700"
    bind:value={selectedRegion}
    on:change={() => console.log(selectedRegion)}
>
    {#each rawRegions as region}
        <option value={region[2]}>{region[0]}</option>
    {/each}
</select>
