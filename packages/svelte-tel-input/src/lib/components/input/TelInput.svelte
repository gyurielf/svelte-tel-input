<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { parsePhoneNumberWithError, ParseError } from 'libphonenumber-js/max';
	import {
		normalizeTelInput,
		getCountryForPartialE164Number,
		generatePlaceholder,
		telInputAction
	} from '$lib/utils/index.js';
	import { watcher } from '$lib/stores/index.js';
	import type { DetailedValue, CountryCode, E164Number, TelInputOptions } from '$lib/types';

	const dispatch = createEventDispatcher<{
		updateCountry: CountryCode | null;
		parseError: string;
		updateDetailedValue: Partial<DetailedValue> | null;
		updateValid: boolean;
		updateValue: E164Number | null;
	}>();

	const defaultOptions = {
		autoPlaceholder: true,
		spaces: true,
		invalidateOnCountryChange: false,
		format: 'national'
	} as const satisfies TelInputOptions;

	/** It's accept any Country Code Alpha-2 (ISO 3166) */
	export let country: CountryCode | null;
	/** The core value of the input, this is the only one what you can store. It's an E164 phone number.*/
	export let value: E164Number | null;
	/** Detailed parse of the E164 phone number */
	export let detailedValue: Partial<DetailedValue> | null = null;
	export let valid = true;
	export let disabled = false;
	/** It will overwrite the autoPlaceholder ! */
	export let placeholder: string | null = null;
	/** You can turn on and off certain features by this object */
	export let options: TelInputOptions = defaultOptions;
	/** Set the required attribute on the input element */
	export let required: boolean | null = null;

	let inputValue = value;
	let prevCountry = country;

	/** Merge options into default opts, to be able to set just one config option. */
	const combinedOptions = {
		...defaultOptions,
		...options
	};

	const handleInputAction = (value: string) => {
		if (disabled) return;
		handleParsePhoneNumber(value, country);
	};

	// Update the country and dispatch event
	const updateCountry = (countryCode: CountryCode | null) => {
		if (countryCode !== country) {
			country = prevCountry = countryCode;
			dispatch('updateCountry', country);
		}
		return country;
	};

	const handleParsePhoneNumber = (
		input: string | null,
		currCountry: CountryCode | null = null
	) => {
		if (input !== null) {
			const numberHasCountry = getCountryForPartialE164Number(input);

			if (numberHasCountry && numberHasCountry !== prevCountry) {
				updateCountry(numberHasCountry);
			}

			try {
				detailedValue = normalizeTelInput(
					parsePhoneNumberWithError(input, numberHasCountry ?? currCountry ?? undefined)
				);
			} catch (err) {
				if (err instanceof ParseError) {
					detailedValue = {
						isValid: false,
						error: err.message
					};
					dispatch('parseError', err.message);
				} else {
					throw err;
				}
			}

			if (detailedValue?.isValid) {
				const formatOption =
					combinedOptions.format === 'national' ? 'nationalNumber' : 'e164';
				const formattedValue =
					combinedOptions.format === 'national'
						? 'formatOriginal'
						: 'formatInternational';

				if (combinedOptions.spaces && detailedValue?.[formattedValue]) {
					// It's needed to refresh the HTML input value if it is the same as the previously parsed.
					inputValue =
						inputValue === detailedValue[formattedValue]
							? null
							: detailedValue[formattedValue] ?? null;
				} else if (detailedValue?.[formatOption]) {
					inputValue =
						inputValue === detailedValue[formatOption]
							? null
							: detailedValue[formatOption] ?? null;
				}
			}

			// keep the input value as value
			value = detailedValue?.e164 ?? input ?? null;
			valid = detailedValue?.isValid ?? false;
			dispatch('updateValid', valid);
			dispatch('updateValue', value);
			dispatch('updateDetailedValue', detailedValue);
		} else if (input === null && currCountry !== null) {
			// If the user modifies the country, reset the input value and don't dispatch the country change event.
			if (currCountry !== prevCountry) {
				prevCountry = currCountry;
				valid = !options.invalidateOnCountryChange;
				value = null;
				inputValue = null;
				detailedValue = null;
				dispatch('updateValid', valid);
				dispatch('updateValue', value);
				dispatch('updateDetailedValue', detailedValue);
			}
		} else {
			// Otherwise, reset all values
			valid = true;
			value = null;
			detailedValue = null;
			prevCountry = currCountry;
			dispatch('updateValid', valid);
			dispatch('updateDetailedValue', detailedValue);
			inputValue = null;
		}
	};

	// Watch user's country change.
	let countryWatchInitRun = true;
	const countryChangeWatchFunction = () => {
		if (!countryWatchInitRun) {
			handleParsePhoneNumber(null, country);
		}
		countryWatchInitRun = false;
	};
	const countryChangeWatch = watcher(null, countryChangeWatchFunction);
	$: $countryChangeWatch = country;

	// Generate placeholder based on the autoPlaceholder option
	$: getPlaceholder = combinedOptions.autoPlaceholder
		? country
			? generatePlaceholder(country, {
					format: combinedOptions.format,
					spaces: combinedOptions.spaces
			  })
			: null
		: placeholder;

	// Handle reset value only
	$: if (value === null && inputValue !== null && detailedValue !== null) {
		inputValue = null;
		detailedValue = null;
		dispatch('updateDetailedValue', detailedValue);
	}

	const initialize = () => {
		if (value) {
			handleParsePhoneNumber(value, getCountryForPartialE164Number(value) || country);
		}
	};

	onMount(() => {
		initialize();
	});
</script>

<input
	type="tel"
	placeholder={getPlaceholder}
	{required}
	{disabled}
	{...$$restProps}
	value={inputValue}
	class={$$props.class}
	on:beforeinput
	on:blur
	on:change
	on:focus
	on:input
	on:keydown
	on:keypress
	on:keyup
	on:paste
	on:click
	use:telInputAction={{
		handler: handleInputAction,
		spaces: combinedOptions.spaces,
		value
	}}
/>