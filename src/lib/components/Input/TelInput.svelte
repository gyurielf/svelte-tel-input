<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { watcher } from '$lib/stores';
	import { normalizeTelInput } from '$lib/utils/helpers';
	import { parsePhoneNumberWithError, ParseError } from 'libphonenumber-js';
	import type { NormalizedTelNumber, CountryCode, E164Number, TelInputEvents } from '$lib/types';

	const dispatch = createEventDispatcher<TelInputEvents>();
	export let country: CountryCode | null;
	export let value: E164Number | null = null;
	export let parsedTelInput: Partial<NormalizedTelNumber> | null = null;
	export let valid = true;
	export let disabled = false;

	let inputValue = value;

	const handleInput = (event: Event) => {
		// const inputVal = (event.target as HTMLInputElement).value.replace(/[^\d\+]/g, '');
		const inputVal = (event.target as HTMLInputElement).value;
		handleParsePhoneNumber(inputVal, country);
	};

	const updateCountry = (countryCode: CountryCode) => {
		country = countryCode;
	};

	const handleParsePhoneNumber = (input: string, country: CountryCode | null = null) => {
		try {
			console.log('parse');
			parsedTelInput = normalizeTelInput(
				parsePhoneNumberWithError(input, country || undefined)
			);

			// Update country if the parsed number is contains a proper country iso2
			if (
				parsedTelInput?.countryCode &&
				parsedTelInput?.isValid &&
				parsedTelInput.countryCode !== country
			) {
				console.log(
					'Should update country from ' + country + ' to ' + parsedTelInput.countryCode
				);
				updateCountry(parsedTelInput.countryCode);
			}

			// It's need for refreshing html input value, if it is the same as the previouly parsed.
			if (inputValue === parsedTelInput?.formatOriginal) {
				inputValue = null;
			}

			inputValue = parsedTelInput?.formatOriginal ?? input;

			value = parsedTelInput?.e164 ?? null;
			valid = parsedTelInput.isValid ?? false;

			console.log(inputValue);
			dispatch('valid', valid);
			dispatch('parseInput', parsedTelInput);
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
	};

	// Temporary disabled
	const watchFunction = () => {
		if (value !== null) {
			console.log('WatchFN runz');
			handleParsePhoneNumber(value, country);
		}
	};
	const countryChangeWatch = watcher(null, watchFunction);

	$: $countryChangeWatch = country;

	onMount(() => {
		if (value && country) {
			console.log('Unparsed with country');
			handleParsePhoneNumber(value, country);
		} else if (value) {
			console.log('Unparsed');
			handleParsePhoneNumber(value);
		} else if (parsedTelInput) {
			handleParsePhoneNumber(parsedTelInput.phoneNumber as string, country);
			console.log('Fully Parsed');
		}
	});

	$: console.log('countryCheck inside telinput ' + country);
</script>

<input
	id="kaka"
	class={$$props.class}
	{disabled}
	type="tel"
	value={inputValue}
	{...$$restProps}
	on:blur
	on:change
	on:focus
	on:input={handleInput}
	on:input
	on:keydown
	on:keypress
	on:keyup
/>
