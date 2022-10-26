<script lang="ts">
	import { onMount } from 'svelte';
	import { watcher } from '$lib/stores';
	import { normalizeTelInput } from '$lib/utils/helpers';
	import { parsePhoneNumberWithError, ParseError, AsYouType } from 'libphonenumber-js';
	import type { NormalizedTelNumber, CountryCode, E164Number } from '$lib/types';

	export let country: CountryCode | null = null;
	export let initialValue: E164Number | null = null;
	export let parsedTelInput: Partial<NormalizedTelNumber> | null = null;
	export let disabled = false;

	let inputValue = initialValue || null;

	onMount(() => {
		if (initialValue && country) {
			console.log('Unparsed with country');
			handleParsePhoneNumber(initialValue, country);
		} else if (initialValue) {
			console.log('Unparsed');
			handleParsePhoneNumber(initialValue);
		} else if (parsedTelInput) {
			handleParsePhoneNumber(parsedTelInput.phoneNumber as string, country);
			console.log('Fully Parsed');
		}
	});

	const handleInput = (event: Event) => {
		// const inputVal = (event.target as HTMLInputElement).value.replace(/[^\d\+]/g, '');
		const inputVal = (event.target as HTMLInputElement).value;
		handleParsePhoneNumber(inputVal, country);
	};

	const handleParsePhoneNumber = (input: string, country: CountryCode | null = null) => {
		try {
			parsedTelInput = normalizeTelInput(
				parsePhoneNumberWithError(input, country || undefined)
			);
			// inputValue = parsedTelInput?.formatInternational ?? input;
			inputValue = parsedTelInput?.formatInternational ?? input;
		} catch (err) {
			if (err instanceof ParseError) {
				// Not a phone number, non-existent country, etc.
				parsedTelInput = {
					isValid: false,
					error: err.message
				};
			} else {
				throw err;
			}
		}
	};

	const watchFunction = () => {
		if (initialValue !== null) {
			console.log('WatchFN runz');
			handleParsePhoneNumber(initialValue, country);
		}
	};
	const countryChangeWatch = watcher(null, watchFunction);

	$: $countryChangeWatch = country;

	const setInputValue = (
		country: CountryCode | null,
		parsedTelInput: Partial<NormalizedTelNumber> | null
	) => {
		if (country) {
			return parsedTelInput?.formatOriginal ?? initialValue ?? '';
		} else {
			return parsedTelInput?.formatInternational ?? initialValue ?? '';
		}
	};

	// $: inputValue = setInputValue(country, parsedTelInput);
	$: console.log(inputValue);
</script>

<input
	{disabled}
	value={inputValue}
	type="tel"
	class={$$props.class}
	{...$$restProps}
	on:input={handleInput}
	on:blur
	on:focus
	on:keyup
	on:keydown
/>
