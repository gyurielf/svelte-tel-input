<script lang="ts">
    import { selectedCountryStore } from '$lib/stores';
    export let selectedCountry: string;
    const setSelectedCountry = (value: string) => {
        selectedCountry = value;
        $selectedCountryStore = value;
    };
</script>

<select
    name="country_select"
    class="some-class {$$props.class}"
    on:change={(e) => setSelectedCountry(e.currentTarget.value)}
>
    <slot name="options" />
</select>
