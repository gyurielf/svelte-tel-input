<script lang="ts">
	import { createBubbler } from 'svelte/legacy';
	import { createEventDispatcher, onMount } from 'svelte';
	import { ParseError } from 'libphonenumber-js/max';
	import {
		getCountryForPartialE164Number,
		generatePlaceholder,
		telInputAction
	} from '$lib/utils/index.js';
	import type {
		DetailedValue,
		CountryCode,
		E164Number,
		TelInputOptions,
		Props
	} from '$lib/types';
	import { newNormalizer } from '$lib/utils/newHelpers';
	import { guessCountryByPartialNumber } from '$lib/utils/directives/countryHelpers';

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

	let {
		autocomplete = null,
		class: classes = '',
		disabled = false,
		id = 'phone-input-' +
			(crypto?.randomUUID() ||
				new Date().getTime().toString(36) + Math.random().toString(36).slice(2)),
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
	let prevCountry = $state(country);

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
			const { country: numberHasCountry } = guessCountryByPartialNumber({
				partialE164Number: input,
				currentCountryIso2: currCountry
			});

			if (numberHasCountry?.iso2 && numberHasCountry.iso2 !== prevCountry) {
				updateCountry(numberHasCountry.iso2);
			}

			try {
				detailedValue = newNormalizer(input, numberHasCountry);
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

			if (combinedOptions.spaces && detailedValue?.formattedNumber) {
				inputValue = detailedValue.formattedNumber || null;
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
	let isInitialCountryChange = true;
	const countryChangeWatchFunction = (current: CountryCode | null | undefined) => {
		if (!isInitialCountryChange) {
			handleParsePhoneNumber(null, current);
		}
		isInitialCountryChange = false;
	};

	// Watch for country changes
	$effect(() => {
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

	// Watch for value resets
	$effect(() => {
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
	onpaste={bubble('paste')}
	use:telInputAction={{
		handler: handleInputAction,
		spaces: combinedOptions.spaces,
		value,
		prevValue: inputValue
	}}
/>
