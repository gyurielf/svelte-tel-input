<script lang="ts">
	import { enteredTelInputStore } from '$lib/stores';
	import { parsePhoneNumberWithError, ParseError } from 'libphonenumber-js';

	export let enteredTelInput: string;

	const handleInput = (event: Event) => {
		const inputVal = (event.target as HTMLInputElement).value;
		enteredTelInput = inputVal;
		$enteredTelInputStore = inputVal;

		try {
			const phoneNumber = parsePhoneNumberWithError(inputVal);
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
