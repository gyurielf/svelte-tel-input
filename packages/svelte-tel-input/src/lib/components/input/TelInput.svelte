<script lang="ts">
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import { parsePhoneNumberWithError, ParseError } from 'libphonenumber-js/max';
	import {
		normalizeTelInput,
		getCountryForPartialE164Number,
		generatePlaceholder,
		telInputAction,
		allowedCharacters
	} from '$lib/utils/index.js';
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
	} satisfies TelInputOptions;

	export let autocomplete: string | null = null;
	let classes = '';
	/** You can set the classes of the input field*/
	export { classes as class };
	/** You can disable the component and set the disabled attribute of the input field */
	export let disabled = false;
	/** You can set the id attribute of the input field */
	export let id =
		'phone-input-' + new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
	/** You can set the name attribute of the input field */
	export let name: string | null = null;
	/** It will overwrite the autoPlaceholder ! */
	export let placeholder: string | null = null;
	/** You can set the readonly attribute of the input field */
	export let readonly: boolean | null = null;
	/** Set the required attribute on the input element */
	export let required: boolean | null = null;
	/** You can set the size attribute of the input field */
	export let size: number | null = null;
	/** The core value of the input, this is the only one what you can store. It's an E164 phone number.*/
	export let value: E164Number | null;
	/** It's accept any Country Code Alpha-2 (ISO 3166) */
	export let country: CountryCode | null | undefined = undefined;
	/** Detailed parse of the E164 phone number */
	export let detailedValue: Partial<DetailedValue> | null = null;
	/** Validity of the input based on the config settings.*/
	export let valid = true;
	/** You can turn on and off certain features by this object */
	export let options: TelInputOptions = defaultOptions;
	/** Binding to the underlying `<input>` element */
	export let el: HTMLInputElement | undefined = undefined;

	let inputValue = value;
	let prevCountry = country;

	/** Merge options into default opts, to be able to set just one config option. */
	const combinedOptions = {
		...defaultOptions,
		...options
	};

	const handleInputAction = (value: string) => {
		if (disabled || readonly) return;
		handleParsePhoneNumber(value, country);
	};

	// Update the country and dispatch event
	const updateCountry = (countryCode: CountryCode | null) => {
		if (countryCode !== country) {
			country = countryCode;
			prevCountry = country;
			dispatch('updateCountry', country);
			dispatch('updateDetailedValue', detailedValue);
		}
		return country;
	};

	const findNewCursorPosition = (
		newValue: string,
		formattedValue: string,
		initialCursorPosition: number
	) => {
		let fvIndex = 0;
		for (let nvIndex = 0; nvIndex < initialCursorPosition; nvIndex++) {
			// Since newValue has not been normalized yet, we need to map any non standard digits.
			const nvChar = allowedCharacters(newValue[nvIndex], { spaces: false });

			// For each non-formatting character encountered in the value entered by the user,
			// find the corresponding digit in the formatted value.
			if (nvChar >= '0' && nvChar <= '9') {
				while (
					!(formattedValue[fvIndex] >= '0' && formattedValue[fvIndex] <= '9') &&
					fvIndex < formattedValue.length
				) {
					fvIndex++;
				}
				fvIndex++;
			}
		}

		return fvIndex;
	};

	const handleParsePhoneNumber = async (
		rawInput: string | null,
		currCountry: CountryCode | null = null
	) => {
		const input = rawInput as E164Number;
		if (input !== null) {
			const detectedCountry = getCountryForPartialE164Number(input);
			const useCountry = options?.strictCountry
				? currCountry
				: detectedCountry ?? currCountry;

			if (!options?.strictCountry && detectedCountry && detectedCountry !== prevCountry) {
				updateCountry(detectedCountry);
			}

			try {
				detailedValue = normalizeTelInput(
					parsePhoneNumberWithError(input, useCountry ?? undefined)
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

			const formatOption = combinedOptions.format === 'national' ? 'nationalNumber' : 'e164';
			const formattedValue =
				combinedOptions.format === 'national' ? 'formatOriginal' : 'formatInternational';
			const initialCursorPosition = el?.selectionStart || 0;
			if (combinedOptions.spaces && detailedValue?.[formattedValue]) {
				inputValue = detailedValue[formattedValue] ?? null;

				// Need to wait for input element to update before cursor position can be restored
				await tick();
				if (el) {
					const newCursorPosition = findNewCursorPosition(
						input,
						inputValue,
						initialCursorPosition
					);
					el.selectionStart = newCursorPosition;
					el.selectionEnd = newCursorPosition;
				}
			} else if (detailedValue?.[formatOption]) {
				inputValue = detailedValue[formatOption] ?? null;

				// Need to wait for input element to update before cursor position can be restored
				await tick();
				if (el) {
					const newCursorPosition = findNewCursorPosition(
						input,
						inputValue,
						initialCursorPosition
					);
					el.selectionStart = newCursorPosition;
					el.selectionEnd = newCursorPosition;
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
	const countryChangeWatchFunction = (current: CountryCode | null | undefined) => {
		if (!countryWatchInitRun) {
			handleParsePhoneNumber(null, current);
		}
		countryWatchInitRun = false;
	};

	$: countryChangeWatchFunction(country);

	// Generate placeholder based on the autoPlaceholder option
	$: getPlaceholder =
		combinedOptions.autoPlaceholder && country
			? generatePlaceholder(country, {
					format: combinedOptions.format,
					spaces: combinedOptions.spaces
				})
			: placeholder;

	// Handle reset value only
	$: if (value === null && inputValue !== null && detailedValue !== null) {
		inputValue = null;
		detailedValue = null;
		dispatch('updateDetailedValue', detailedValue);
	}

	export const updateValue = (
		newValue: string | E164Number | null,
		newCountry?: CountryCode | null
	) => {
		const castedValue = newValue as E164Number;
		if (castedValue) {
			handleParsePhoneNumber(
				castedValue,
				options?.strictCountry
					? country
					: getCountryForPartialE164Number(castedValue) || newCountry
			);
		}
	};

	onMount(() => {
		if (value) {
			handleParsePhoneNumber(
				value,
				options?.strictCountry ? country : getCountryForPartialE164Number(value) || country
			);
		}
	});
</script>

<input
	{...$$restProps}
	bind:this={el}
	{autocomplete}
	class={classes}
	{disabled}
	{id}
	{name}
	{readonly}
	{required}
	{size}
	placeholder={getPlaceholder}
	type="tel"
	value={inputValue}
	on:beforeinput
	on:blur
	on:change
	on:click
	on:focus
	on:input
	on:keydown
	on:keypress
	on:keyup
	on:paste
	use:telInputAction={{
		handler: handleInputAction,
		spaces: combinedOptions.spaces,
		value
	}}
/>
