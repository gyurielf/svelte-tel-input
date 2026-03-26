<script lang="ts">
	import { clickOutsideAction } from '../../utils/directives/clickOutsideAction.js';
	import { isSelected } from '../../utils/helpers.js';
	import { TelInput, countries } from 'svelte-tel-input';

	import type {
		DetailedValue,
		CountryCode,
		TelInputOptions,
		Country,
		ValidationError
	} from 'svelte-tel-input/types';
	import 'svelte-tel-input/styles/flags.css';
	import LoadingSpinner from '../LoadingSpinner.svelte';

	interface Props {
		clickOutside?: boolean;
		closeOnClick?: boolean;
		defaultCountry?: CountryCode | null;
		disabled?: boolean;
		required?: boolean;
		detailedValue?: DetailedValue | null;
		value: string;
		searchPlaceholder?: string | null;
		selectedCountry: CountryCode | null;
		valid: boolean;
		validationError?: ValidationError;
		options: TelInputOptions;
		onCountryChange?: (country: CountryCode | null) => void;
		onError?: (error: string) => void;
		onSelectChange?: (details: CountryCode) => void;
		onSelectSame?: (details: CountryCode) => void;
		onValidityChange?: (isValid: boolean, error: ValidationError) => void;
		onValueChange?: (
			newValue: string,
			newDetails: Readonly<Partial<DetailedValue> | null>
		) => void;
		onLoad?: () => void;
	}

	let {
		clickOutside = true,
		closeOnClick = true,
		defaultCountry = null,
		disabled = false,
		required = true,
		detailedValue = $bindable(null),
		value = $bindable(''),
		searchPlaceholder = 'Search',
		selectedCountry = $bindable(),
		valid = $bindable(),
		validationError = $bindable<ValidationError>(null),
		options,
		onCountryChange,
		onError,
		onLoad,
		onSelectChange,
		onSelectSame,
		onValidityChange,
		onValueChange
	}: Props = $props();
	let searchText = $state('');
	let isOpen = $state(false);
	let initLoading = $state(true);
	let telInputRef: TelInput | undefined = $state();

	export const checkValidity = () => telInputRef?.api.checkValidity();
	export const reset = (options?: { country?: boolean }) => telInputRef?.api.reset(options);

	// const selectedCountryDialCode = $derived(
	// 	countries.find((el) => el.iso2 === selectedCountry)?.dialCode || null
	// );

	const toggleDropDown = (e?: Event) => {
		e?.preventDefault();
		if (disabled) return;
		isOpen = !isOpen;
	};

	const closeDropdown = (e?: Event) => {
		if (isOpen) {
			e?.preventDefault();
			isOpen = false;
			searchText = '';
		}
	};

	const selectClick = () => {
		if (closeOnClick) closeDropdown();
	};

	const closeOnClickOutside = () => {
		if (clickOutside) {
			closeDropdown();
		}
	};

	const sortCountries = (countries: Country[], text: string) => {
		const normalizedText = text.trim().toLowerCase();
		if (!normalizedText) {
			return countries.sort((a, b) => a.label.localeCompare(b.label));
		}
		return countries.sort((a, b) => {
			const aNameLower = a.name.toLowerCase();
			const bNameLower = b.name.toLowerCase();
			const aStartsWith = aNameLower.startsWith(normalizedText);
			const bStartsWith = bNameLower.startsWith(normalizedText);
			if (aStartsWith && !bStartsWith) return -1;
			if (!aStartsWith && bStartsWith) return 1;
			const aIndex = aNameLower.indexOf(normalizedText);
			const bIndex = bNameLower.indexOf(normalizedText);
			if (aIndex === -1 && bIndex === -1) return a.id.localeCompare(b.id);
			if (aIndex === -1) return 1;
			if (bIndex === -1) return -1;
			const aWeight = aIndex + (aStartsWith ? 0 : 1);
			const bWeight = bIndex + (bStartsWith ? 0 : 1);
			return aWeight - bWeight;
		});
	};

	const handleSelect = (val: CountryCode, e?: Event) => {
		if (disabled) return;
		e?.preventDefault();
		if (
			selectedCountry === undefined ||
			selectedCountry === null ||
			(typeof selectedCountry === typeof val && selectedCountry !== val)
		) {
			selectedCountry = val;
			onSelectChange?.(val);
			selectClick();
		} else {
			onSelectSame?.(val);
			selectClick();
		}
	};
</script>

<div
	class="flex relative rounded-lg {valid
		? ``
		: ` ring-pink-500 dark:ring-pink-500 ring-1 focus-within:ring-offset-1 focus-within:ring-offset-pink-500/50 focus-within:ring-1`}"
>
	<div class="flex" use:clickOutsideAction={closeOnClickOutside}>
		<button
			id="states-button"
			data-dropdown-toggle="dropdown-states"
			class="relative z-10 inline-flex shrink-0 items-center overflow-hidden whitespace-nowrap rounded-l-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-center text-sm font-medium text-gray-700 enabled:cursor-pointer enabled:hover:bg-gray-200 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white enabled:dark:hover:bg-gray-600"
			type="button"
			role="combobox"
			aria-controls="dropdown-countries"
			aria-expanded="false"
			aria-haspopup="false"
			onclick={toggleDropDown}
			disabled={initLoading || disabled}
		>
			{#if initLoading}
				<LoadingSpinner size={20}></LoadingSpinner>
			{:else}
				{#if selectedCountry && selectedCountry !== null}
					<div class="inline-flex items-center text-left">
						<span class="flag flag-{selectedCountry.toLowerCase()} shrink-0 mr-3"
						></span>
					</div>
				{:else}
					Please select
				{/if}
				<svg
					aria-hidden="true"
					class="ml-1 w-4 h-4 {isOpen ? 'rotate-180' : ''}"
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
			{/if}
		</button>
		{#if isOpen}
			<div
				id="dropdown-countries"
				class="absolute z-10 max-w-fit translate-y-11 overflow-hidden rounded border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-700"
				data-popper-reference-hidden=""
				data-popper-escaped=""
				data-popper-placement="bottom"
				aria-orientation="vertical"
				aria-labelledby="country-button"
				tabindex="-1"
			>
				<div
					class="max-h-48 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
					aria-labelledby="countries-button"
					role="listbox"
				>
					<input
						aria-autocomplete="list"
						type="text"
						class="sticky top-0 z-10 w-full border-b border-gray-200 bg-white px-4 py-2 text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
						bind:value={searchText}
						placeholder={searchPlaceholder}
					/>
					{#each sortCountries(countries, searchText) as country (country.id)}
						{@const isActive = isSelected(country.iso2, selectedCountry)}
						<div id="country-{country.iso2}" role="option" aria-selected={isActive}>
							<button
								value={country.iso2}
								type="button"
								class="inline-flex w-full cursor-pointer overflow-hidden px-4 py-2 text-sm {isActive
									? 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-white'
									: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:active:bg-gray-800'}"
								onclick={(e) => {
									handleSelect(country.iso2, e);
								}}
							>
								<div class="inline-flex items-center text-left">
									<span
										class="flag flag-{country.iso2.toLowerCase()} shrink-0 mr-3"
									></span>
									<span class="mr-2">{country.name}</span>
									<span class="text-gray-500 dark:text-gray-400"
										>+{country.dialCode}</span
									>
								</div>
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<TelInput
		bind:this={telInputRef}
		country={selectedCountry}
		{defaultCountry}
		bind:detailedValue
		bind:value
		bind:valid
		bind:validationError
		{options}
		{required}
		onLoad={() => {
			initLoading = false;
			onLoad?.();
		}}
		onCountryChange={(detail) => {
			selectedCountry = detail;
			onCountryChange?.(detail);
		}}
		{onValidityChange}
		{onValueChange}
		{onError}
		name="phone-input"
		class="text-sm rounded-r-lg block w-full px-1.25 h-10.25 leading-10.25 focus:outline-none border border-gray-300 border-l-gray-100 dark:border-l-gray-700 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 
        dark:placeholder-gray-400 dark:text-white text-gray-900 box-border"
	/>
</div>
