<script lang="ts">
	import NewBasicPhoneInput from '$lib/components/examples/NewBasicPhoneInput.svelte';
	import AdvancedTelInput from '$lib/components/Input/AdvancedTelInput.svelte';
	import PayloadBlock from '$lib/components/utils/PayloadBlock.svelte';
	import type { NormalizedTelNumber } from '$lib/types';

	let advancedExampleData: NormalizedTelNumber | null;
	let basicExampleData: NormalizedTelNumber | null;
</script>

<div class="grid gap-y-10">
	<div>
		<h2 class="text-2xl mb-3">Advanced Example</h2>
		<AdvancedTelInput bind:parsedTelInput={advancedExampleData} />
		<PayloadBlock bind:exampleData={advancedExampleData} />
	</div>
	<div>
		<h2 class="text-2xl mb-3">Basic Example</h2>
		<NewBasicPhoneInput bind:parsedTelInput={basicExampleData} />
		<PayloadBlock bind:exampleData={basicExampleData} />
	</div>
</div>
