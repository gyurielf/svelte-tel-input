<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { parsePhoneNumberWithError, ParseError } from 'libphonenumber-js/max';
	import { telInputAction } from '$lib/utils/directives/telInputAction';
	import {
		normalizeTelInput,
		getCountryForPartialE164Number,
		generatePlaceholder
	} from '$lib/utils/helpers';
	import { watcher } from '$lib/stores';
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
		invalidateOnCountryChange: false
	};

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

	// export let invalidateOnCountryChange = false;

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

	const updateCountry = (countryCode: CountryCode | null) => {
		country = countryCode;
		prevCountry = countryCode;
		dispatch('updateCountry', country);
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
					// Not a phone number, non-existent country, etc.
					detailedValue = {
						isValid: false,
						error: err.message
					};
					dispatch('parseError', err.message);
				} else {
					throw err;
				}
			}

			// It's keep the html input value on the first parsed format, or the user's format.
			if (detailedValue?.isValid && combinedOptions.spaces && detailedValue?.formatOriginal) {
				// It's need for refreshing html input value, if it is the same as the previouly parsed.
				if (inputValue === detailedValue?.formatOriginal) {
					inputValue = null;
					inputValue = '';
				}
				inputValue = detailedValue?.formatOriginal;
			} else if (detailedValue?.isValid && detailedValue?.nationalNumber) {
				if (inputValue === detailedValue?.nationalNumber) {
					inputValue = null;
					inputValue = '';
				}
				inputValue = detailedValue?.nationalNumber;
			}

			// keep the input value as value
			value = detailedValue?.e164 ?? input ?? null;
			valid = detailedValue?.isValid ?? false;
			dispatch('updateValid', valid);
			dispatch('updateValue', value);
			dispatch('updateDetailedValue', detailedValue);
		} else if (input === null && currCountry !== null) {
			/** If the user modify the country, it's reset the input value, and we don't dispatch country change event,
			 * since the user himself initiated it.
			 * */
			if (currCountry !== prevCountry) {
				prevCountry = currCountry;
				valid = !options.invalidateOnCountryChange;
				value = null;
				if (inputValue !== null || inputValue !== '') {
					inputValue = null;
					inputValue = '';
				}
				detailedValue = null;
				dispatch('updateValid', valid);
				dispatch('updateValue', value);
				dispatch('updateDetailedValue', detailedValue);
			}
		} else {
			valid = true;
			value = null;
			detailedValue = null;
			prevCountry = currCountry;
			dispatch('updateValid', valid);
			dispatch('updateDetailedValue', detailedValue);
			inputValue = null;
			inputValue = '';
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

	$: getPlaceholder = combinedOptions.autoPlaceholder
		? country
			? generatePlaceholder(country)
			: null
		: placeholder;

	const initialize = () => {
		if (value && country) {
			handleParsePhoneNumber(value, country);
		} else if (value) {
			const numberHasCountry = getCountryForPartialE164Number(value);
			if (numberHasCountry) {
				// updateCountry(numberHasCountry);
				handleParsePhoneNumber(value, numberHasCountry);
			} else {
				handleParsePhoneNumber(value, null);
			}
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
	use:telInputAction={{ handler: handleInputAction, spaces: combinedOptions.spaces }}
/>
