<script lang="ts">
	import type { Country } from '$lib/models/interfaces/Country.interface';
	import { clickOutsideAction } from '$lib/utils/directives/clickOutsideAction';

	export let selectOptions = {
		searchInput: false,
		flags: true
	};
	export let items: Country[];
	export let clickOutside = true;

	let isOpen = false;
	let enteredSearch: string;

	const toggleSelect = (e?: Event) => {
		e?.preventDefault();
		isOpen = !isOpen;
	};

	const closeSelect = (e?: Event) => {
		e?.preventDefault();
		isOpen = false;
	};
	const handleClickOutside = (e?: Event) => {
		e?.preventDefault();
		if (clickOutside) {
			closeSelect(e);
		}
	};
</script>

<div class="select cursor-pointer" use:clickOutsideAction={handleClickOutside}>
	<div on:click={() => toggleSelect()}>CHOOSE</div>
	{#if isOpen}
		<ul class="border border-gray-900 max-h-40 w-fit overflow-y-scroll">
			{#if !selectOptions.searchInput}
				<input
					type="text"
					class="px-4 py-1 text-gray-900 focus:outline-none w-full"
					bind:value={enteredSearch}
				/>
			{/if}
			{#each items as item}
				<li class="p-2 bg-gray-600 hover:bg-opacity-30">
					<span class="mr-3">{item.name}</span> +{item.dialCode}
				</li>
			{:else}
				<div>List is on the way..</div>
			{/each}
		</ul>
	{/if}
</div>

<style lang="postcss">
</style>
