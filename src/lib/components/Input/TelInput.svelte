<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import metadata from 'libphonenumber-js/metadata.min.json';
	import { parsePhoneNumberWithError, ParseError } from 'libphonenumber-js';
	import { telInputAction } from '$lib/utils/directives/telInputAction';
	import { normalizeTelInput, getCountryForPartialE164Number } from '$lib/utils/helpers';
	import { watcher } from '$lib/stores';
	import type {
		NormalizedTelNumber,
		CountryCode,
		E164Number,
		TelInputDispatchEvents
	} from '$lib/types';

	const dispatch = createEventDispatcher<TelInputDispatchEvents>();
	export let country: CountryCode | null;
	export let value: E164Number | null;
	export let parsedTelInput: Partial<NormalizedTelNumber> | null = null;
	export let valid = true;
	export let disabled = false;
	let inputValue = value;
	let prevCountry = country;

	const handleInputAction = (value: string) => {
		handleParsePhoneNumber(value, country);
	};

	const updateCountry = (countryCode: CountryCode) => {
		country = countryCode;
		prevCountry = countryCode;
		return country;
	};

	const handleParsePhoneNumber = (
		input: string | null,
		currCountry: CountryCode | null = null
	) => {
		if (input) {
			const numberHasCountry = getCountryForPartialE164Number(input, { metadata });

			if (numberHasCountry && numberHasCountry !== prevCountry) {
				updateCountry(numberHasCountry);
			}

			try {
				parsedTelInput = normalizeTelInput(
					parsePhoneNumberWithError(input, currCountry ?? numberHasCountry)
				);
			} catch (err) {
				if (err instanceof ParseError) {
					// Not a phone number, non-existent country, etc.
					parsedTelInput = {
						isValid: false,
						error: err.message
					};
					dispatch('parseError', err.message);
				} else {
					throw err;
				}
			}

			// It's keep the html input value on the first parsed format, or the user's format.
			if (parsedTelInput?.isValid && parsedTelInput?.formatOriginal) {
				// It's need for refreshing html input value, if it is the same as the previouly parsed.
				if (inputValue === parsedTelInput?.formatOriginal) {
					inputValue = null;
				}
				inputValue = parsedTelInput?.formatOriginal;
			}
			value = parsedTelInput?.e164 ?? null;
			valid = parsedTelInput?.isValid ?? false;

			dispatch('valid', valid);
			dispatch('parseInput', parsedTelInput);
		} else {
			if (currCountry !== prevCountry) {
				value = null;
				inputValue = '';
				valid = true;
			}
			prevCountry = currCountry;
		}
	};

	const initialize = () => {
		if (value && country) {
			handleParsePhoneNumber(value, country);
		} else if (value) {
			const numberHasCountry = getCountryForPartialE164Number(value, { metadata });
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
</script>

<input
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
	use:telInputAction={handleInputAction}
/>
