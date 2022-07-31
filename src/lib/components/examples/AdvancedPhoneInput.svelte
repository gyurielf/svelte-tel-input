<script lang="ts">
	import type { Country, DispatchSelectEvents } from '$lib/types';
	import { createEventDispatcher } from 'svelte';
	import { normalizedCountries } from '$lib/assets';
	import { clickOutsideAction } from '$lib/utils/directives/clickOutsideAction';
	import TelInput from '$lib/components/Input/TelInput.svelte';
	import { isSelected } from '$lib/utils/helpers';
	import ExamplePayload from '../utils/ExamplePayload.svelte';
	import type { NormalizedPhoneNumber } from '$lib/types/interfaces/Phone.interface';

	export let searchText = '';
	export let selected: Country | null = null;
	export let clickOutside = true;
	export let closeOnClick = true;
	export let disabled = false;
	let isOpen = false;

	let parsedPhoneInput: NormalizedPhoneNumber;

	const toggleDropDown = (e: Event) => {
		e.preventDefault();
		isOpen = !isOpen;
	};

	const closeDropdown = (e?: Event) => {
		e?.preventDefault();
		isOpen = false;
		searchText = '';
	};

	const selectClick = () => {
		if (closeOnClick) closeDropdown();
	};

	const closeOnClickOutside = () => {
		if (clickOutside) {
			closeDropdown();
		}
	};

	$: filteredItems =
		searchText && searchText.length > 0
			? normalizedCountries
					.filter((el) => el.label.toLowerCase().indexOf(searchText.toLowerCase()) >= 0)
					.sort((a, b) => (a.label < b.label ? -1 : 1))
			: normalizedCountries;

	const handleSelect = (val: Country, e?: Event) => {
		if (disabled) return;
		e?.preventDefault();
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

	const dispatch = createEventDispatcher<DispatchSelectEvents<Country>>();

	const onChange = (selectedCountry: Country) => {
		dispatch('change', { option: selectedCountry });
	};
</script>

<div class="flex" use:clickOutsideAction={closeOnClickOutside}>
	<button
		id="states-button"
		data-dropdown-toggle="dropdown-states"
		class="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
		type="button"
		on:click={toggleDropDown}
	>
		{#if selected && selected !== null}
			<div class="inline-flex items-center text-left">
				<span class="flag flag-{selected.iso2.toLowerCase()} flex-shrink-0 mr-3" />
				<span class=" text-gray-500">+{selected.dialCode}</span>
			</div>
		{:else}
			Please select
		{/if}
		<svg
			aria-hidden="true"
			class="ml-1 w-4 h-4"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>
	{#if isOpen}
		<div
			id="dropdown-countries"
			class="z-10 max-w-fit bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 absolute translate-y-11 overflow-hidden"
			data-popper-reference-hidden=""
			data-popper-escaped=""
			data-popper-placement="bottom"
			aria-orientation="vertical"
			aria-labelledby="country-button"
			tabindex="-1"
		>
			<ul
				class="text-sm text-gray-700 dark:text-gray-200 max-h-48 overflow-y-auto"
				aria-labelledby="countries-button"
			>
				{#if true}
					<input
						type="text"
						class="px-4 py-2 text-gray-900 focus:outline-none w-full sticky top-0"
						bind:value={searchText}
					/>
				{/if}
				{#each filteredItems as country (country.id)}
					<li>
						<button
							type="button"
							class="inline-flex py-2 px-4 w-full text-sm hover:bg-gray-100 dark:hover:bg-gray-600 
                             active:bg-gray-800 dark:active:bg-gray-800 overflow-hidden
                            {isSelected(country, selected)
								? 'bg-gray-600 dark:text-white'
								: 'dark:hover:text-white dark:text-gray-400'}"
							on:click={(e) => {
								handleSelect(country, e);
							}}
						>
							<div class="inline-flex items-center text-left">
								<span
									class="flag flag-{country.iso2.toLowerCase()} flex-shrink-0 mr-3"
								/>
								<span class="mr-2">{country.name}</span>
								<span class=" text-gray-500">+{country.dialCode}</span>
							</div>
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<TelInput
		defaultCountry={selected?.iso2}
		bind:parsedPhoneInput
		class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-r-lg border-l-gray-100 dark:border-l-gray-700 border-l-2 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
	/>
</div>

<ExamplePayload bind:exampleData={parsedPhoneInput} />
