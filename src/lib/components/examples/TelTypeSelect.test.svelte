<script lang="ts">
	import TelTypeSelect from '$lib/components/Select/TelTypeSelect/TelTypeSelect.svelte';
	import TelTypeSelectOption from '../Select/TelTypeSelect/TelTypeSelectOption.svelte';
	import type { SelectType } from '$lib/models/types/Select.type';
	import { telTypes } from '$lib/assets';

	// TODO >> sort and order option for telTypes.

	export let selectedTelType: SelectType | null = null;
</script>

<!-- Whis way you can build your own country select component. You can both style and add your own logic. -->
<TelTypeSelect bind:selectedTelType class="text-gray-800 rounded-sm">
	<svelte:fragment slot="options">
		<option value="" selected={true} hidden={true}>Choose here</option>
		{#each telTypes as telType (telType.id)}
			<TelTypeSelectOption class="text-red-500" typeOption={telType} />
		{/each}
	</svelte:fragment>
</TelTypeSelect>
