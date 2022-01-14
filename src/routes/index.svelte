<script context="module" lang="ts">
    import SvelteTelInput from '$lib/components/Input/SvelteTelInput.svelte';
    import CountrySelect from '$lib/components/Select/CountrySelect.svelte';

    export const prerender = true;
</script>

<svelte:head>
    <title>svelte-tel-input</title>
</svelte:head>

<div class="container mx-auto">
    <div class="text-gray-200">
        <div>
            <h1 class="text-2xl my-4">SVELTE-TEL-INPUT</h1>
            <CountrySelect />
            <div>
                <SvelteTelInput />
            </div>
        </div>
    </div>
</div>
