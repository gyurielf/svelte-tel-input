<script lang="ts">
	import BasicPhoneInput from '$lib/components/examples/BasicPhoneInput.svelte';
	import AdvancedTelInput from '$lib/components/examples/AdvancedPhoneInput.svelte';
	import PayloadBlock from '$lib/components/utils/PayloadBlock.svelte';
	import type { NormalizedTelNumber, E164Number } from '$lib/types';

	// Example payload
	let advancedExampleData: NormalizedTelNumber | null;
	let basicExampleDataWithE164: NormalizedTelNumber | null;
	let basicExampleDataWithNull: NormalizedTelNumber | null;

	let advancedExampleValue: E164Number | null = '+36201234567';
	let basicExampleValueWithE164: E164Number | null = '+14842918723';
	let basicExampleValueWithNull: E164Number | null = null;
</script>

<div class="grid gap-y-10">
	<div>
		<h2 class="text-2xl mb-3">Advanced Example</h2>
		<AdvancedTelInput
			bind:value={advancedExampleValue}
			bind:parsedTelInput={advancedExampleData}
		/>
		<PayloadBlock bind:value={advancedExampleValue} bind:exampleData={advancedExampleData} />
	</div>
	<div>
		<h2 class="text-2xl mb-3">Basic Example with init value</h2>
		<BasicPhoneInput
			bind:value={basicExampleValueWithE164}
			bind:parsedTelInput={basicExampleDataWithE164}
		/>
		<PayloadBlock
			bind:value={basicExampleValueWithE164}
			bind:exampleData={basicExampleDataWithE164}
		/>
	</div>
	<div>
		<h2 class="text-2xl mb-3">Basic Example without init value</h2>
		<BasicPhoneInput
			bind:value={basicExampleValueWithNull}
			bind:parsedTelInput={basicExampleDataWithNull}
		/>
		<PayloadBlock
			bind:value={basicExampleValueWithNull}
			bind:exampleData={basicExampleDataWithNull}
		/>
	</div>
</div>
