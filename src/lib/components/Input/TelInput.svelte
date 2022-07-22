<script lang="ts">
	import { enteredTelInputStore } from '$lib/stores';
	import {
		parsePhoneNumberWithError,
		ParseError,
		type CountryCode,
		type PhoneNumber
	} from 'libphonenumber-js';

	export let defaultCountry: CountryCode | null = null;
	export let phoneInput: string | null = null;
	export let parsedPhoneInput: PhoneNumber | null = null;

	const handleInput = (event: Event) => {
		const inputVal = (event.target as HTMLInputElement).value;
		phoneInput = inputVal;
		$enteredTelInputStore = inputVal;

		try {
			parsedPhoneInput = parsePhoneNumberWithError(inputVal, defaultCountry || undefined);
		} catch (error) {
			if (error instanceof ParseError) {
				// Not a phone number, non-existent country, etc.
				console.log(error.message);
			} else {
				throw error;
			}
		}
	};
</script>

<input class={$$props.class} type="tel" on:input={handleInput} />
