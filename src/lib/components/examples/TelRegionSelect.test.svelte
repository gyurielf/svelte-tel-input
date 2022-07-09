<script lang="ts">
	import TelRegionSelect from '../Select/TelRegionSelect/TelRegionSelect.svelte';
	import rawRegions from '$lib/assets/regions';
	import type { SelectObject } from '$lib/models/interfaces/Select.interface';

	let selectedTelRegion: SelectObject;
</script>

<!-- Whis way you can build your own country select component. You can both style and add your own logic. -->
<TelRegionSelect bind:selectedTelRegion class="text-gray-800">
	<svelte:fragment slot="options">
		<option value="" selected={true} hidden={true}>Choose here</option>
		{#each rawRegions as region (region)}
			<option class="text-red-500" value={region}>{region}</option>
		{/each}
	</svelte:fragment>
</TelRegionSelect>
