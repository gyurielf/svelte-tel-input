<script lang="ts">
	import { enteredTelInputStore } from '$lib/stores';
	import { PhoneInputParseError } from '$lib/types';
	import {
		parsePhoneNumberWithError,
		ParseError,
		type CountryCode,
		type PhoneNumber
	} from 'libphonenumber-js';

	export let defaultCountry: CountryCode | null = null;
	export let phoneInput: string | null = null;
	export let parsedPhoneInput: PhoneNumber | null = null;
	export let error: PhoneInputParseError | null = null;

	const handleInput = (event: Event) => {
		const inputVal = (event.target as HTMLInputElement).value;
		phoneInput = inputVal;
		$enteredTelInputStore = inputVal;

		try {
			parsedPhoneInput = parsePhoneNumberWithError(inputVal, defaultCountry || undefined);
			error = null;
		} catch (err) {
			if (err instanceof ParseError) {
				// Not a phone number, non-existent country, etc.
				parsedPhoneInput = null;
				console.log(err.message);
				error = PhoneInputParseError[err.message as keyof typeof PhoneInputParseError];
			} else {
				throw error;
			}
		}
	};
</script>

<input class={$$props.class} type="tel" on:input={handleInput} />
