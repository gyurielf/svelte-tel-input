<script lang="ts">
	import { watcher } from '$lib/stores';
	import { PhoneNumberParseError } from '$lib/types';
	import type { NormalizedPhoneNumber } from '$lib/types/interfaces/Phone.interface';
	import { normalizePhoneInput } from '$lib/utils/helpers';
	import { parsePhoneNumberWithError, ParseError, type CountryCode } from 'libphonenumber-js';

	import { onMount } from 'svelte';

	export let defaultCountry: CountryCode | null = null;
	export let rawPhoneInput: string | null = null;
	export let parsedPhoneInput: Partial<NormalizedPhoneNumber> | null = null;
	export let disabled = false;
	export let id: string | null = null;
	export let name: string | null = null;

	onMount(() => {
		if (parsedPhoneInput !== null) {
			rawPhoneInput = parsedPhoneInput.nationalNumber as string;
			handleParsePhoneNumber(defaultCountry, parsedPhoneInput.phoneNumber as string);
		}
	});

	const handleInput = (event: Event) => {
		const inputVal = (event.target as HTMLInputElement).value.trim();
		rawPhoneInput = inputVal;
		handleParsePhoneNumber(defaultCountry, inputVal);
	};

	const handleParsePhoneNumber = (country: CountryCode | null, input: string) => {
		try {
			parsedPhoneInput = normalizePhoneInput(
				parsePhoneNumberWithError(input, country || undefined)
			);
		} catch (err) {
			if (err instanceof ParseError) {
				// Not a phone number, non-existent country, etc.
				parsedPhoneInput = {
					isValid: false,
					error: PhoneNumberParseError[err.message as keyof typeof PhoneNumberParseError]
				};
			} else {
				throw err;
			}
		}
	};

	const watchFunction = () => {
		if (rawPhoneInput !== null) handleParsePhoneNumber(defaultCountry, rawPhoneInput);
	};
	const countryChangeWatch = watcher(null, watchFunction);
	$: $countryChangeWatch = defaultCountry;
</script>

<input
	{id}
	{name}
	class={$$props.class}
	{disabled}
	value={parsedPhoneInput?.formatOriginal ?? rawPhoneInput ?? ''}
	type="tel"
	on:input={handleInput}
/>
