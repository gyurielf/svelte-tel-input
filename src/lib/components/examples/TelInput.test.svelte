<script lang="ts">
    import TelInput from '$lib/components/Input/TelInput.svelte';

    let phoneNumber: string;
    let isVlaid = true;
</script>

<TelInput
    bind:enteredTelInput={phoneNumber}
    class="px-4 py-1 text-gray-900 focus:outline-none rounded-sm {isVlaid
        ? 'border-2 border-red-600'
        : 'border-none'}"
/>
