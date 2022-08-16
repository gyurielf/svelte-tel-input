<script lang="ts">
	import AdvancedPhoneInput from '$lib/components/examples/AdvancedPhoneInput.svelte';
	import PayloadBlock from '$lib/components/utils/PayloadBlock.svelte';
	import type { NormalizedPhoneNumber } from '$lib/types/interfaces/Phone.interface';

	let exampleData: NormalizedPhoneNumber | null;
</script>

<div class="my-10">
	<!-- Phone Input -->
	<AdvancedPhoneInput bind:parsedPhoneInput={exampleData} />

	<!-- Payload Block -->
	<PayloadBlock bind:exampleData />
</div>
