<script lang="ts">
	import AdvancedTelInput from '$lib/components/Input/AdvancedTelInput.svelte';
	import PayloadBlock from '$lib/components/utils/PayloadBlock.svelte';
	import type { NormalizedTelNumber } from '$lib/types';

	let exampleData: NormalizedTelNumber | null;
</script>

<div class="my-10">
	<!-- Phone Input -->
	<AdvancedTelInput bind:parsedTelInput={exampleData} />

	<!-- Payload Block -->
	<PayloadBlock bind:exampleData />
</div>
