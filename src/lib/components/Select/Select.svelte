<script lang="ts">
	import type { TelSelectObject, Country, DispatchSelectEvents } from '$lib/types';
	import { clickOutsideAction } from '$lib/utils/directives/clickOutsideAction';
	import { isSelected } from '$lib/utils/helpers';
	import { createEventDispatcher } from 'svelte';

	type T = $$Generic<Country | TelSelectObject>; // extends country and telselectObj

	export let selectOptions = {
		searchInput: false,
		flags: false
	};
	export let disabled = false;
	export let items: T[];
	export let selected: T | null = null;
	export let clickOutside = true;

	let isOpen = false;
	let closeOnClick = true;

	export let searchText = '';

	$: filteredItems =
		searchText && searchText.length > 0
			? items
					.filter((el) => el.label.toLowerCase().indexOf(searchText.toLowerCase()) >= 0)
					.sort((a, b) => (a.label < b.label ? -1 : 1))
			: items;

	const toggleSelect = (e?: Event) => {
		e?.preventDefault();
		isOpen = !isOpen;
	};

	const closeSelect = (e?: Event) => {
		e?.preventDefault();
		isOpen = false;
		searchText = '';
	};

	const handleClickOutside = (e?: Event) => {
		e?.preventDefault();
		if (clickOutside) {
			closeSelect(e);
		}
	};

	const selectClick = () => {
		if (closeOnClick) closeSelect();
	};

	const handleSelect = (val: T) => {
		if (disabled) return;
		if (typeof selected === 'object' && typeof val === 'object' && selected?.id && val?.id) {
			if (typeof selected === 'object' && typeof val === 'object' && selected.id !== val.id) {
				selected = val;
				onChange(val);
				selectClick();
			} else {
				dispatch('same', { option: val });
				selectClick();
			}
		} else if (
			((selected === undefined || selected === null) && typeof val === 'object') ||
			(typeof selected === typeof val && selected !== val)
		) {
			selected = val;
			onChange(val);
			selectClick();
		} else {
			dispatch('same', { option: val });
			selectClick();
		}
	};

	const dispatch = createEventDispatcher<DispatchSelectEvents<T>>();
	const onChange = (selectedType: T) => {
		dispatch('change', { option: selectedType });
	};
</script>

<div class="select cursor-pointer" use:clickOutsideAction={handleClickOutside}>
	{#if selected && selected !== null}
		<div on:click={() => toggleSelect()}>{selected.label}</div>
	{:else}
		<div on:click={() => toggleSelect()}>CHOOSE</div>
	{/if}

	{#if isOpen}
		<ul class="border border-gray-900 max-h-40 w-fit overflow-y-scroll">
			{#if !selectOptions.searchInput}
				<input
					type="text"
					class="px-4 py-1 text-gray-900 focus:outline-none w-full"
					bind:value={searchText}
				/>
			{/if}
			{#each filteredItems as item (item.id)}
				<li
					class="p-2  {isSelected(item, selected)
						? 'bg-red-400'
						: 'bg-gray-600 hover:bg-opacity-30'}"
					on:click={() => {
						handleSelect(item);
					}}
				>
					<span class="mr-3">{item.label}</span>
				</li>
			{:else}
				<div>List of items is on the way..</div>
			{/each}
		</ul>
	{/if}
</div>
