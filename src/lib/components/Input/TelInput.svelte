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
	import type { NormalizedTelNumber, CountryCode, E164Number, TelInputOptions } from '$lib/types';
	const defaultOptions = {
		autoPlaceholder: true,
		spaces: true
	};

	const dispatch = createEventDispatcher<{
		changeCountry: CountryCode | null;
		parseError: string;
		changeDetailedValue: Partial<NormalizedTelNumber> | null;
		validation: boolean;
		changeValue: E164Number | null;
	}>();

	/** It's accept any Country Code Alpha-2 (ISO 3166) */
	export let country: CountryCode | null;
	/** The core value of the input, this is the only one what you can store. It's an E164 phone number.*/
	export let value: E164Number | null;
	/** Detailed parse of the E164 phone number */
	export let detailedValue: Partial<NormalizedTelNumber> | null = null;
	export let valid = true;
	export let disabled = false;
	/** It will overwrite the autoPlaceholder ! */
	export let placeholder: string | null = null;
	/** You can turn on and off certain features by this object */
	export let options: TelInputOptions = defaultOptions;
	/** If true it's run extra validation if the field is empty */
	export let required: boolean | null = null;

	let inputValue = value;
	let prevCountry = country;

	/** Merge options into default opts, to be able to set just one config option. */
	$: combinedOptions = {
		...defaultOptions,
		...options
	};

	const handleInputAction = (value: string) => {
		if (disabled) return;
		handleParsePhoneNumber(value, country);
	};

	const updateCountry = (countryCode: CountryCode) => {
		country = countryCode;
		prevCountry = countryCode;
		dispatch('changeCountry', country);
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
					parsePhoneNumberWithError(input, currCountry ?? numberHasCountry)
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
				}
				inputValue = detailedValue?.formatOriginal;
			} else if (detailedValue?.isValid && detailedValue?.nationalNumber) {
				if (inputValue === detailedValue?.nationalNumber) {
					inputValue = null;
				}
				inputValue = detailedValue?.nationalNumber;
			}

			value = detailedValue?.e164 ?? null;
			valid = detailedValue?.isValid ?? false;
			dispatch('validation', valid);
			dispatch('changeValue', value);
			dispatch('changeDetailedValue', detailedValue);
		} else {
			if (currCountry !== prevCountry) {
				value = null;
				inputValue = '';
				valid = false;
				detailedValue = null;
			}
			prevCountry = currCountry;
			dispatch('validation', valid);
			dispatch('changeValue', value);
			dispatch('changeDetailedValue', detailedValue);
		}
	};

	const initialize = () => {
		if (value && country) {
			handleParsePhoneNumber(value, country);
		} else if (value) {
			const numberHasCountry = getCountryForPartialE164Number(value);
			if (numberHasCountry) {
				updateCountry(numberHasCountry);
				handleParsePhoneNumber(value, country);
			} else {
				handleParsePhoneNumber(value);
			}
		}
	};

	onMount(() => {
		initialize();
	});

	let initRun = true;
	const watchFunction = () => {
		if (!initRun) {
			handleParsePhoneNumber(null, country);
		}
		initRun = false;
	};

	const countryChangeWatch = watcher(null, watchFunction);
	$: $countryChangeWatch = country;

	$: getPlaceholder = combinedOptions.autoPlaceholder
		? country
			? generatePlaceholder(country)
			: null
		: placeholder;
</script>

<input
	{required}
	placeholder={getPlaceholder}
	{disabled}
	type="tel"
	value={inputValue}
	{...$$restProps}
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
	use:telInputAction={{ handler: handleInputAction, spaces: combinedOptions.spaces }}
/>
