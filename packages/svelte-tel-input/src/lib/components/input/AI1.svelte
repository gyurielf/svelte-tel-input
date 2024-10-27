<!-- <script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { parsePhoneNumberWithError, ParseError } from 'libphonenumber-js/max';
	import {
		normalizeTelInput,
		getCountryForPartialE164Number,
		generatePlaceholder,
		telInputAction
	} from '$lib/utils/index.js';
	import type { DetailedValue, CountryCode, E164Number, Props } from '$lib/types';

	// Props with defaults
	let {
		autocomplete = null,
		class: classes = '',
		disabled = false,
		id = crypto.randomUUID(),
		name = null,
		placeholder = null,
		readonly = null,
		required = null,
		size = null,
		value = $bindable(),
		country = $bindable(undefined),
		detailedValue = $bindable(null),
		valid = $bindable(true),
		options = {
			autoPlaceholder: true,
			spaces: true,
			invalidateOnCountryChange: false
		},
		el = $bindable(undefined),
		...rest
	}: Props = $props();

	const dispatch = createEventDispatcher<{
		updateCountry: CountryCode | null;
		parseError: string;
		updateDetailedValue: Partial<DetailedValue> | null;
		updateValid: boolean;
		updateValue: E164Number | null;
	}>();

	// State
	let inputValue = $state(value);
	let prevCountry = $state(country);

	// Derived values
	const generatedPlaceholder = $derived(
		options.autoPlaceholder && country
			? generatePlaceholder(country, { spaces: options.spaces })
			: placeholder
	);

	// Handlers
	function updateState(updates: {
		value?: E164Number | null;
		detailedValue?: Partial<DetailedValue> | null;
		valid?: boolean;
		country?: CountryCode | null;
		inputValue?: string | null;
	}) {
		if ('value' in updates) value = updates.value ?? null;
		if ('detailedValue' in updates) detailedValue = updates.detailedValue ?? null;
		if ('valid' in updates) valid = updates.valid ?? true;
		if ('country' in updates) {
			const newCountry = updates.country ?? null;
			if (newCountry !== country) {
				country = newCountry;
				prevCountry = newCountry;
				dispatch('updateCountry', newCountry);
			}
		}
		if ('inputValue' in updates) inputValue = updates.inputValue ?? null;

		// Dispatch events
		dispatch('updateValid', valid);
		dispatch('updateValue', value);
		dispatch('updateDetailedValue', detailedValue);
	}

	function parsePhoneNumber(input: string | null, currentCountry: CountryCode | null = null) {
		if (!input) {
			if (currentCountry !== null && currentCountry !== prevCountry) {
				// Country change reset
				updateState({
					valid: !options.invalidateOnCountryChange,
					value: null,
					inputValue: null,
					detailedValue: null,
					country: currentCountry
				});
			} else {
				// Full reset
				updateState({
					valid: true,
					value: null,
					detailedValue: null,
					inputValue: null,
					country: currentCountry
				});
			}
			return;
		}

		const numberCountry = getCountryForPartialE164Number(input as E164Number);
		const targetCountry = numberCountry ?? currentCountry;

		try {
			const parsedNumber = parsePhoneNumberWithError(input, targetCountry ?? undefined);
			const normalizedValue = normalizeTelInput(parsedNumber);

			const formattedInput =
				options.spaces && normalizedValue?.formatInternational
					? normalizedValue.formatInternational
					: (normalizedValue?.e164 ?? null);

			updateState({
				value: normalizedValue?.e164 ?? (input as E164Number),
				detailedValue: normalizedValue,
				valid: normalizedValue?.isValid ?? false,
				country: numberCountry,
				inputValue: formattedInput
			});
		} catch (err) {
			if (err instanceof ParseError) {
				updateState({
					detailedValue: { isValid: false, error: err.message },
					valid: false
				});
				dispatch('parseError', err.message);
			} else {
				throw err;
			}
		}
	}

	// Watch for country changes
	let isInitialCountryChange = true;
	$effect(() => {
		if (!isInitialCountryChange) {
			parsePhoneNumber(null, country);
		}
		isInitialCountryChange = false;
	});

	// Watch for value resets
	$effect(() => {
		if (value === null && inputValue !== null && detailedValue !== null) {
			updateState({
				inputValue: null,
				detailedValue: null
			});
		}
	});

	// Public method
	export function updateValue(
		newValue: string | E164Number | null,
		newCountry?: CountryCode | null
	) {
		if (newValue) {
			parsePhoneNumber(
				newValue as string,
				getCountryForPartialE164Number(newValue as E164Number) || newCountry
			);
		}
	}

	// Initialize on mount
	onMount(() => {
		if (value) {
			parsePhoneNumber(value, getCountryForPartialE164Number(value) || country);
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
	placeholder={generatedPlaceholder}
	type="tel"
	{value}
	use:telInputAction={{
		handler: (value) => !disabled && !readonly && parsePhoneNumber(value, country),
		spaces: options.spaces,
		value
	}}
/> -->
