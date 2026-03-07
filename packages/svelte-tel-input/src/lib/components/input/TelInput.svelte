<script lang="ts">
	import { onMount, untrack } from 'svelte';
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

	// Fix: initialize to null so server and client start with an identical render.
	// The ID is generated only in onMount (client-only), avoiding UUID hydration mismatches.
	let generatedId = $state<string | null>(null);
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

	// Apply the detected country to the mutable prop (client-only, via $effect).
	$effect(() => {
		if (country === undefined && initialCountry !== null) {
			country = initialCountry;
		}
	});

	/**
	 * Compute the initial formatted display value synchronously.
	 * Runs on both server and client at initialization time, so SSR renders the
	 * formatted number and the client's first render matches — no hydration mismatch.
	 */
	const computeInitialDisplayValue = (): string | null => {
		if (!value) return value;
		let effectiveCountryIso2: CountryCode | null = null;
		if (country !== undefined && country !== null) {
			effectiveCountryIso2 = country;
		} else if (country === undefined) {
			const { country: detected, fullDialCodeMatch } = guessCountryByPartialNumber({
				partialE164Number: value,
				currentCountryIso2: null
			});
			if (fullDialCodeMatch) effectiveCountryIso2 = detected?.iso2 ?? null;
		}
		const countryObj = effectiveCountryIso2
			? getCountry({ field: 'iso2', value: effectiveCountryIso2 })
			: undefined;
		try {
			const details = newNormalizer(value, countryObj);
			const spaces = options?.spaces ?? defaultOptions.spaces;
			return spaces ? (details.formattedNumber ?? value) : value;
		} catch {
			return value;
		}
	};

	let inputValue = $state(computeInitialDisplayValue());
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

	// Generate placeholder based on the autoPlaceholder option.
	// Uses initialCountry (a $derived) so SSR renders the correct placeholder even
	// when country is auto-detected from the value prop rather than explicitly provided.
	const getPlaceholder = $derived(
		combinedOptions.autoPlaceholder && initialCountry
			? generatePlaceholder(initialCountry, {
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

	// Re-format displayed value when spaces option changes
	$effect(() => {
		const spaces = combinedOptions.spaces;
		untrack(() => {
			if (inputValue !== null && detailedValue) {
				inputValue = spaces
					? (detailedValue.formattedNumber ?? inputValue)
					: (detailedValue.e164 ?? inputValue);
			}
		});
	});

	onMount(() => {
		// generatedId is null on the server; assign here so both server and client
		// agree on the initial render (null → no id attr), then the DOM gets the id after mount.
		if (!idProp?.trim()) {
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
