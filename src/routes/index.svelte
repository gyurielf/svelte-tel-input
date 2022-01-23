<script context="module" lang="ts">
    import TelCountrySelectExample from '$lib/components/examples/TelRegionSelect.test.svelte';
    import TelInputExample from '$lib/components/examples/TelInput.test.svelte';
    import TelTypeSelectExample from '$lib/components/examples/TelTypeSelect.test.svelte';
</script>

<svelte:head>
    <title>svelte-tel-input</title>
</svelte:head>

<div class="container mx-auto">
    <div class="text-gray-200">
        <div>
            <h1 class="text-2xl my-4">SVELTE-TEL-INPUT</h1>
            <div class="grid">
                <div>
                    <p>Country select:</p>
                    <TelCountrySelectExample />
                </div>
                <div>
                    <p>Type Select:</p>
                    <TelTypeSelectExample />
                </div>
                <div>
                    <p>Tel input:</p>
                    <TelInputExample />
                </div>
            </div>
        </div>
    </div>
</div>
