<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { ParseError } from 'libphonenumber-js/max';
	import { generatePlaceholder, newNormalizer, telInputAction } from '$lib/utils/index.js';
	import type { CountryCode, TelInputOptions, Props, ValidationError } from '$lib/types';
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
		value = $bindable(''),
		country = $bindable(null),
		detailedValue = $bindable(null),
		valid = $bindable(true),
		validationError = $bindable<ValidationError>(null),
		options = defaultOptions,
		el = $bindable(undefined),
		...rest
	}: Props = $props();

	untrack(() => {
		const badProp = (prop: string, expected: string, got: unknown): never => {
			const gotDesc =
				got !== null && typeof got === 'object'
					? Array.isArray(got)
						? 'array'
						: `object { ${Object.keys(got as object)
								.slice(0, 4)
								.join(', ')}${Object.keys(got as object).length > 4 ? ', …' : ''} }`
					: typeof got;
			throw new TypeError(
				`<TelInput> invalid prop "${prop}": expected ${expected}, but received ${gotDesc}.`
			);
		};

		if (typeof value !== 'string') badProp('value', 'string', value);
		if (country !== null && country !== undefined && typeof country !== 'string')
			badProp('country', 'CountryCode | null | undefined', country);
		if (name !== null && name !== undefined && typeof name !== 'string')
			badProp('name', 'string | null', name);
		if (placeholder !== null && placeholder !== undefined && typeof placeholder !== 'string')
			badProp('placeholder', 'string | null', placeholder);
		if (disabled !== undefined && disabled !== null && typeof disabled !== 'boolean')
			badProp('disabled', 'boolean', disabled);
		if (readonly !== null && readonly !== undefined && typeof readonly !== 'boolean')
			badProp('readonly', 'boolean | null', readonly);
		if (required !== null && required !== undefined && typeof required !== 'boolean')
			badProp('required', 'boolean | null', required);
		if (size !== null && size !== undefined && typeof size !== 'number')
			badProp('size', 'number | null', size);
		if (
			options !== undefined &&
			(typeof options !== 'object' || options === null || Array.isArray(options))
		)
			badProp('options', 'TelInputOptions object', options);
	});

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
			// Stamp the shadow so the external country watcher doesn't treat this
			// auto-detection as an incoming change from the parent.
			_lastWrittenCountry = initialCountry;
		}
	});

	/**
	 * Compute the initial formatted display value synchronously.
	 * Runs on both server and client at initialization time, so SSR renders the
	 * formatted number and the client's first render matches — no hydration mismatch.
	 */
	const computeInitialDisplayValue = (): string => {
		if (!value) return '';
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

	/**
	 * Shadow trackers — record every value this component writes internally so the
	 * external-change watchers below can distinguish "we set it" vs "parent set it".
	 * Plain let (not $state) because they are only ever read inside untrack(), never
	 * as reactive dependencies.
	 * Initialized to the incoming prop values so the first render never false-fires.
	 */
	let _lastWrittenValue: string = value;
	let _lastWrittenCountry: CountryCode | null | undefined = untrack(() => country);
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

	const getValidationError = (
		isEmpty: boolean,
		parseValid: boolean,
		resolvedCountry: CountryCode | null | undefined
	): ValidationError => {
		const allowed = combinedOptions.allowedCountries;
		if (allowed?.length && resolvedCountry != null && !allowed.includes(resolvedCountry)) {
			return 'country_not_allowed';
		}
		if (isEmpty) return required ? 'required' : null;
		return parseValid ? null : 'invalid';
	};

	const applyValidity = (
		isEmpty: boolean,
		parseValid: boolean,
		resolvedCountry?: CountryCode | null
	) => {
		const error = getValidationError(isEmpty, parseValid, resolvedCountry);
		valid = error === null;
		validationError = error;
		onValidityChange?.(valid, error);
	};

	const handleBlur = (
		e: FocusEvent & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		if (!disabled && !readonly && combinedOptions.validateOn !== 'input') {
			if (inputValue === '') {
				applyValidity(true, false, country);
			} else {
				applyValidity(false, detailedValue?.isValid ?? false, country);
			}
		}
		const { onblur } = rest;
		onblur?.(e);
	};

	// Update the internal country state and stamp the shadow tracker.
	// onCountryChange is intentionally NOT called here; it is fired explicitly
	// only when the country is auto-detected from dial-code parsing.
	const countryUpdater = (countryCode: CountryCode | null) => {
		if (countryCode !== country) {
			country = countryCode;
			_lastWrittenCountry = countryCode; // stamp — internal write
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
				applyValidity(true, false, currCountry);
				value = '';
				_lastWrittenValue = ''; // stamp
				inputValue = '';
				detailedValue = null;
				onValueChange?.(value, detailedValue);
			}
			return;
		}

		// Full reset.
		if (rawInput === null) {
			if (shouldValidate) {
				applyValidity(true, false, null);
			}
			value = '';
			_lastWrittenValue = ''; // stamp
			detailedValue = null;
			prevCountry = currCountry;
			inputValue = '';
			countryUpdater(null);
			onCountryChange?.(null);
			onValueChange?.('', null);
			return;
		}

		// Treat input with no digits and no '+' as empty (e.g. "", whitespace-only, letters-only)
		const isEffectivelyEmpty = !/[0-9+]/.test(rawInput);
		if (isEffectivelyEmpty) {
			if (shouldValidate) {
				applyValidity(true, false, country);
			}
			value = '';
			_lastWrittenValue = ''; // stamp
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
			// Fire the callback only here — when the country is inferred from the
			// user's input (dial-code parsing). reset() and external prop changes
			// do NOT fire onCountryChange.
			onCountryChange?.(numberHasCountry.iso2);
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
		_lastWrittenValue = value; // stamp
		onValueChange?.(value, detailedValue);

		if (shouldValidate) {
			applyValidity(false, detailedValue?.isValid ?? false, country);
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

	// Re-format displayed value when spaces option changes
	$effect(() => {
		const spaces = combinedOptions.spaces;
		untrack(() => {
			if (inputValue !== '' && detailedValue) {
				inputValue = spaces
					? (detailedValue.formattedNumber ?? inputValue)
					: (detailedValue.e164 ?? inputValue);
			}
		});
	});

	/**
	 * Detect externally driven value changes (e.g. parent sets bind:value, or resets to null).
	 * The shadow `_lastWrittenValue` is stamped on every internal write inside
	 * handleParsePhoneNumber, so any difference here means the parent changed it.
	 */
	$effect(() => {
		const currentValue = value;
		untrack(() => {
			if (currentValue !== _lastWrittenValue) {
				handleParsePhoneNumber(currentValue, country ?? null);
			}
		});
	});

	/**
	 * Detect externally driven country changes (e.g. parent's <select bind:value={country}>).
	 * Stamps `_lastWrittenCountry` eagerly so the watcher doesn't re-fire when
	 * handleParsePhoneNumber later writes country through countryUpdater.
	 */
	$effect(() => {
		const currentCountry = country;
		untrack(() => {
			if (currentCountry !== _lastWrittenCountry) {
				_lastWrittenCountry = currentCountry;
				handleParsePhoneNumber(null, currentCountry ?? null);
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

	const reset = () => {
		handleParsePhoneNumber(null, null);
	};

	const checkValidity = (): { valid: boolean; error: ValidationError } => {
		if (inputValue === '') {
			applyValidity(true, false, country);
		} else {
			handleParsePhoneNumber(inputValue, country, true);
		}
		return { valid, error: validationError };
	};

	export const api = {
		checkValidity,
		reset
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
