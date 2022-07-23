<script lang="ts">
	import { enteredTelInputStore } from '$lib/stores';
	import { PhoneNumberParseError } from '$lib/types';
	import {
		parsePhoneNumberWithError,
		ParseError,
		type CountryCode,
		type PhoneNumber
	} from 'libphonenumber-js';

	export let defaultCountry: CountryCode | null = null;
	export let phoneInput: string | null = null;
	export let parsedPhoneInput: PhoneNumber | null = null;
	export let error: PhoneNumberParseError | null = null;
	export let disabled = false;
	export let id: string | null = null;
	export let name: string | null = null;

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
				error = PhoneNumberParseError[err.message as keyof typeof PhoneNumberParseError];
			} else {
				throw err;
			}
		}
	};
</script>

<input {id} {name} class={$$props.class} {disabled} type="tel" on:input={handleInput} />
