<script lang="ts">
	import { onMount } from 'svelte';
	import { ParseError } from 'libphonenumber-js/max';
	import { generatePlaceholder, telInputAction } from '$lib/utils/index.js';
	import type { CountryCode, TelInputOptions, Props } from '$lib/types';
	import { newNormalizer } from '$lib/utils/newHelpers';
	import { getCountry, guessCountryByPartialNumber } from '$lib/utils/directives/countryHelpers';

	const defaultOptions = {
		autoPlaceholder: true,
		spaces: true,
		validateOn: 'always'
	} satisfies TelInputOptions;

	let {
		autocomplete = null,
		class: classes = '',
		disabled = false,
		id: idProp = '',
		name = null,
		placeholder = null,
		readonly = null,
		required = null,
		size = null,
		onLoad,
		onCountryChange,
		onValidityChange,
		onValueChange,
		onError,
		value = $bindable(null),
		country,
		detailedValue = $bindable(null),
		valid = $bindable(true),
		options = defaultOptions,
		el = $bindable(undefined),
		...rest
	}: Props = $props();

	// Avoid SSR/client hydration mismatches: only generate a random id after mount.
	// Treat empty/whitespace id as "not provided".
	let generatedId = $state<string | null>(
		'phone-input-' +
			(crypto?.randomUUID?.() ||
				new Date().getTime().toString(36) + Math.random().toString(36).slice(2))
	);
	const id = $derived.by(() => (idProp && idProp.trim() ? idProp : generatedId));

	// Initialize country immediately if value exists
	const initialCountry = $derived.by(() => {
		if (country !== undefined) return country;
		if (value) {
			const { country: detectedCountry, fullDialCodeMatch } = guessCountryByPartialNumber({
				partialE164Number: value,
				currentCountryIso2: null
			});
			return fullDialCodeMatch ? detectedCountry?.iso2 || null : null;
		}
		return null;
	});

	// Use the derived initial country
	$effect(() => {
		if (country === undefined && initialCountry !== null) {
			country = initialCountry;
		}
	});

	let inputValue = $state(value);
	let prevCountry = $state<CountryCode | null | undefined>(undefined);
	$effect(() => {
		// Initialize once (we don't want to mirror country forever; we want "previous")
		if (prevCountry === undefined) prevCountry = country;
	});
	// let isInitialized = $state(false);

	/** Merge options into default opts, to be able to set just one config option. */
	const combinedOptions = $derived({
		...defaultOptions,
		...options
	});

	const handleInputAction = (value: string) => {
		if (disabled || readonly) return;
		handleParsePhoneNumber(value, country, combinedOptions.validateOn !== 'blur');
	};

	const getEmptyValidity = () => !required;

	const handleBlur = (
		e: FocusEvent & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		if (!disabled && !readonly && combinedOptions.validateOn !== 'input') {
			if (inputValue === null || inputValue === '') {
				valid = getEmptyValidity();
				onValidityChange?.(valid);
			} else {
				valid = detailedValue?.isValid ?? false;
				onValidityChange?.(valid);
			}
		}
		const { onblur } = rest;
		onblur?.(e);
	};

	// Update the country and dispatch event
	const countryUpdater = (countryCode: CountryCode | null) => {
		if (countryCode !== country) {
			country = countryCode;
			onCountryChange?.(country);
		}
		return country;
	};

	const getCountryObj = (iso2: CountryCode | null | undefined) =>
		iso2 ? getCountry({ field: 'iso2', value: iso2 }) : undefined;

	const handleParsePhoneNumber = (
		rawInput: string | null,
		currCountry: CountryCode | null = null,
		shouldValidate = true
	) => {
		// Country-only change: reset state unless option says to keep valid.
		if (rawInput === null && currCountry !== null) {
			if (currCountry !== prevCountry) {
				prevCountry = currCountry;
				valid = getEmptyValidity();
				value = null;
				inputValue = null;
				detailedValue = null;
				onValidityChange?.(valid);
				onValueChange?.(value, detailedValue);
			}
			return;
		}

		// Full reset.
		if (rawInput === null) {
			if (shouldValidate) {
				valid = getEmptyValidity();
				onValidityChange?.(valid);
			}
			value = null;
			detailedValue = null;
			prevCountry = currCountry;
			inputValue = null;
			return;
		}

		// Treat input with no digits and no '+' as empty (e.g. "", whitespace-only, letters-only)
		const isEffectivelyEmpty = !/[0-9+]/.test(rawInput);
		if (isEffectivelyEmpty) {
			if (shouldValidate) {
				valid = getEmptyValidity();
				onValidityChange?.(valid);
			}
			value = null;
			detailedValue = null;
			inputValue = '';
			onValueChange?.(value, detailedValue);
			return;
		}

		const startsWithPlus = rawInput.trimStart().startsWith('+');
		const selectedCountry = getCountryObj(currCountry) ?? getCountryObj(country);

		// If a country is selected, only infer+switch country from the number when user types an E.164 number (leading '+').
		const { country: numberHasCountry, fullDialCodeMatch } = startsWithPlus
			? guessCountryByPartialNumber({
					partialE164Number: rawInput,
					currentCountryIso2: currCountry
				})
			: { country: undefined, fullDialCodeMatch: false };

		// Only switch country when we have a FULL dial-code match.
		// This prevents switching on partial prefixes like "+3" while backspacing.
		if (
			startsWithPlus &&
			fullDialCodeMatch &&
			numberHasCountry?.iso2 &&
			numberHasCountry.iso2 !== prevCountry
		) {
			countryUpdater(numberHasCountry.iso2);
		}

		// If dial code is incomplete (e.g. "+3"), keep using the currently selected country
		// so we don't bounce countries during deletions.
		const normalizerCountry =
			startsWithPlus && fullDialCodeMatch ? numberHasCountry : selectedCountry;

		try {
			detailedValue = newNormalizer(rawInput, normalizerCountry);
		} catch (err) {
			if (err instanceof ParseError) {
				detailedValue = { isValid: false, error: err.message };
				onError?.(err.message);
			} else {
				throw err;
			}
		}

		// `inputValue` is the displayed value (must stay in sync with the directive's formatting).
		inputValue = combinedOptions.spaces
			? (detailedValue?.formattedNumber ?? rawInput)
			: rawInput;

		// `value` is the stored value (E.164 when possible).
		value = detailedValue?.e164 ?? rawInput;
		onValueChange?.(value, detailedValue);

		if (shouldValidate) {
			valid = detailedValue?.isValid ?? false;
			onValidityChange?.(valid);
		}
	};

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
		}
	});

	onMount(() => {
		if (!idProp?.trim() && generatedId === null) {
			generatedId =
				'phone-input-' +
				(crypto?.randomUUID?.() ||
					new Date().getTime().toString(36) + Math.random().toString(36).slice(2));
		}
		if (value) {
			// If country is specified, use it; otherwise, use the initial country (which is figured out from value)
			const currentCountry = country || initialCountry;
			handleParsePhoneNumber(value, currentCountry);
		}
		// isInitialized = true;
		onLoad?.();
	});

	const setValue = (newValue: string | null, newCountry?: CountryCode | null) => {
		const castedValue = newValue;
		if (castedValue) {
			const { country: numberHasCountry, fullDialCodeMatch } = guessCountryByPartialNumber({
				partialE164Number: castedValue,
				currentCountryIso2: newCountry
			});

			handleParsePhoneNumber(
				castedValue,
				(fullDialCodeMatch ? numberHasCountry?.iso2 : null) || newCountry
			);
		}
	};

	const setCountry = (newCountry: CountryCode | null) => {
		countryUpdater(newCountry);
		handleParsePhoneNumber(null, newCountry);
		el?.focus();
	};

	const checkValidity = () => {
		if (inputValue === null || inputValue === '') {
			valid = getEmptyValidity();
			onValidityChange?.(valid);
			return valid;
		}

		handleParsePhoneNumber(inputValue, country, true);
		return valid;
	};

	export const api = {
		setValue,
		setCountry,
		checkValidity
	};
</script>

<input
	data-testid="tel-input"
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
	onblur={handleBlur}
	use:telInputAction={{
		handler: handleInputAction,
		spaces: combinedOptions.spaces,
		country,
		value
	}}
/>
