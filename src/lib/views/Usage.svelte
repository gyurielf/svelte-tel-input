<script lang="ts">
	import AdvancedTelInput from '$lib/components/Input/AdvancedTelInput.svelte';
	import PayloadBlock from '$lib/components/utils/PayloadBlock.svelte';
	import type { NormalizedPhoneNumber } from '$lib/types/interfaces/Phone.interface';

	let exampleData: NormalizedPhoneNumber | null;
</script>

<div class="my-10">
	<!-- Phone Input -->
	<AdvancedTelInput bind:parsedPhoneInput={exampleData} />

	<!-- Payload Block -->
	<PayloadBlock bind:exampleData />
</div>
