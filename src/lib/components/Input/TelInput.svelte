<script lang="ts">
	import { watcher } from '$lib/stores';
	import { PhoneNumberParseError } from '$lib/types';
	import type { NormalizedTelNumber } from '$lib/types/interfaces/Phone.interface';
	import { normalizeTelInput } from '$lib/utils/helpers';
	import { parsePhoneNumberWithError, ParseError, type CountryCode } from 'libphonenumber-js';

	import { onMount } from 'svelte';

	export let country: CountryCode | null = null;
	export let rawTelInput: string | null = null;
	export let parsedTelInput: Partial<NormalizedTelNumber> | null = null;
	export let disabled = false;
	export let id: string | null = null;
	export let name: string | null = null;

	onMount(() => {
		if (parsedTelInput !== null) {
			rawTelInput = parsedTelInput.nationalNumber as string;
			handleParsePhoneNumber(country, parsedTelInput.phoneNumber as string);
		}
	});

	const handleInput = (event: Event) => {
		const inputVal = (event.target as HTMLInputElement).value.replace(/\s/g, '');
		rawTelInput = inputVal;
		handleParsePhoneNumber(country, inputVal);
	};

	const handleParsePhoneNumber = (country: CountryCode | null, input: string) => {
		try {
			parsedTelInput = normalizeTelInput(
				parsePhoneNumberWithError(input, country || undefined)
			);
		} catch (err) {
			if (err instanceof ParseError) {
				// Not a phone number, non-existent country, etc.
				parsedTelInput = {
					isValid: false,
					error: PhoneNumberParseError[err.message as keyof typeof PhoneNumberParseError]
				};
			} else {
				throw err;
			}
		}
	};

	const watchFunction = () => {
		if (rawTelInput !== null) handleParsePhoneNumber(country, rawTelInput);
	};
	const countryChangeWatch = watcher(null, watchFunction);
	$: $countryChangeWatch = country;
</script>

<input
	{id}
	{name}
	{disabled}
	value={parsedTelInput?.formatOriginal ?? rawTelInput ?? ''}
	type="tel"
	class={$$props.class}
	{...$$restProps}
	on:input={handleInput}
/>
