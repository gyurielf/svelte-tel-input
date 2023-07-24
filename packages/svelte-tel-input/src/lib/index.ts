export { default as TelInput } from './components/input/TelInput.svelte';
export {
	inputParser,
	inspectAllowedChars,
	normalizeTelInput,
	getCountryForPartialE164Number,
	clickOutsideAction,
	isSelected
} from '$lib/utils/index.js';
export { parsePhoneNumberWithError, ParseError } from 'libphonenumber-js/max';
export { normalizedCountries } from '$lib/assets/index.js';
