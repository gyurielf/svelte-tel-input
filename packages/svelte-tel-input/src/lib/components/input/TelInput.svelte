<script lang="ts">
	import { run, createBubbler } from 'svelte/legacy';
	import { createEventDispatcher, onMount } from 'svelte';
	import { parsePhoneNumberWithError, ParseError } from 'libphonenumber-js/max';
	import {
		normalizeTelInput,
		getCountryForPartialE164Number,
		generatePlaceholder,
		telInputAction
	} from '$lib/utils/index.js';
	import type { DetailedValue, CountryCode, E164Number, TelInputOptions } from '$lib/types';
	const bubble = createBubbler();
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
	} satisfies TelInputOptions;

	/** You can set the classes of the input field*/
	interface Props {
		// eslint-disable-next-line no-undef
		autocomplete?: AutoFill | null;
		class?: string;
		/** You can disable the component and set the disabled attribute of the input field */
		disabled?: boolean;
		/** You can set the id attribute of the input field */
		id?: string;
		/** You can set the name attribute of the input field */
		name?: string | null;
		/** It will overwrite the autoPlaceholder ! */
		placeholder?: string | null;
		/** You can set the readonly attribute of the input field */
		readonly?: boolean | null;
		/** Set the required attribute on the input element */
		required?: boolean | null;
		/** You can set the size attribute of the input field */
		size?: number | null;
		/** The core value of the input, this is the only one what you can store. It's an E164 phone number.*/
		value: E164Number | null;
		/** It's accept any Country Code Alpha-2 (ISO 3166) */
		country?: CountryCode | null | undefined;
		/** Detailed parse of the E164 phone number */
		detailedValue?: Partial<DetailedValue> | null;
		/** Validity of the input based on the config settings. */
		valid?: boolean;
		/** You can turn on and off certain features by this object */
		options?: TelInputOptions;
		/** Binding to the underlying `<input>` element */
		el?: HTMLInputElement | undefined;
	}

	let {
		autocomplete = null,
		class: classes = '',
		disabled = false,
		id = 'phone-input-' +
			new Date().getTime().toString(36) +
			Math.random().toString(36).slice(2),
		name = null,
		placeholder = null,
		readonly = null,
		required = null,
		size = null,
		value = $bindable(),
		country = $bindable(undefined),
		detailedValue = $bindable(null),
		valid = $bindable(true),
		options = defaultOptions,
		el = $bindable(undefined),
		...rest
	}: Props = $props();

	let inputValue = $state(value);
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
		}
		return country;
	};

	const handleParsePhoneNumber = (
		rawInput: string | null,
		currCountry: CountryCode | null = null
	) => {
		const input = rawInput as E164Number;
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

			if (combinedOptions.spaces && detailedValue?.formatInternational) {
				inputValue = detailedValue.formatInternational ?? null;
			} else if (detailedValue?.e164) {
				inputValue = detailedValue.e164 ?? null;
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

	run(() => {
		countryChangeWatchFunction(country);
	});

	// Generate placeholder based on the autoPlaceholder option
	const getPlaceholder = $derived(
		combinedOptions.autoPlaceholder && country
			? generatePlaceholder(country, {
					spaces: combinedOptions.spaces
				})
			: placeholder
	);

	// Handle reset value only
	run(() => {
		if (value === null && inputValue !== null && detailedValue !== null) {
			inputValue = null;
			detailedValue = null;
			dispatch('updateDetailedValue', detailedValue);
		}
	});

	export const updateValue = (
		newValue: string | E164Number | null,
		newCountry?: CountryCode | null
	) => {
		const castedValue = newValue as E164Number;
		if (castedValue) {
			handleParsePhoneNumber(
				castedValue,
				getCountryForPartialE164Number(castedValue) || newCountry
			);
		}
	};

	onMount(() => {
		if (value) {
			handleParsePhoneNumber(value, getCountryForPartialE164Number(value) || country);
		}
	});
</script>

<input
	{...rest}
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
	onbeforeinput={bubble('beforeinput')}
	onblur={bubble('blur')}
	onchange={bubble('change')}
	onclick={bubble('click')}
	onfocus={bubble('focus')}
	oninput={bubble('input')}
	onkeydown={bubble('keydown')}
	onkeypress={bubble('keypress')}
	onkeyup={bubble('keyup')}
	onpaste={bubble('paste')}
	use:telInputAction={{
		handler: handleInputAction,
		spaces: combinedOptions.spaces,
		value
	}}
/>
