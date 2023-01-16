<script lang="ts">
	import BasicPhoneInput from '$lib/components/examples/BasicPhoneInput.svelte';
	import AdvancedTelInput from '$lib/components/examples/AdvancedPhoneInput.svelte';
	import PayloadBlock from '$lib/components/utils/PayloadBlock.svelte';
	import type { NormalizedTelNumber, E164Number } from '$lib/types';

	// Example payload
	let advancedExampleData: NormalizedTelNumber | null;
	let basicExampleData: NormalizedTelNumber | null;

	let value: E164Number | null = '+36201234567';
</script>

<div class="grid gap-y-10">
	<div>
		<h2 class="text-2xl mb-3">Advanced Example</h2>
		<AdvancedTelInput bind:value bind:parsedTelInput={advancedExampleData} />
		<PayloadBlock bind:exampleData={advancedExampleData} />
	</div>
	<div>
		<h2 class="text-2xl mb-3">Basic Example</h2>
		<BasicPhoneInput bind:parsedTelInput={basicExampleData} />
		<PayloadBlock bind:exampleData={basicExampleData} />
	</div>
</div>
