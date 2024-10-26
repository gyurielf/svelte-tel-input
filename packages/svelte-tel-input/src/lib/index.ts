export { default as TelInput } from './components/input/TelInput.svelte';
export {
	getCurrentCountry,
	inputParser,
	inspectAllowedChars,
	normalizeTelInput,
	getCountryForPartialE164Number,
	clickOutsideAction,
	isSelected
} from '$lib/utils/index.js';
export { parsePhoneNumberWithError, ParseError } from 'libphonenumber-js/max';
export { countries } from '$lib/assets/index.js';
