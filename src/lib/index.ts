export { default } from './components/Input/TelInput.svelte';
export {
	getCurrentCountry,
	isSelected,
	inputParser,
	inspectAllowedChars,
	normalizeTelInput,
	getCountryForPartialE164Number
} from './utils/helpers';
export { parsePhoneNumberWithError } from 'libphonenumber-js/max';
export { clickOutsideAction } from './utils/directives/clickOutsideAction';
export { normalizedCountries } from './assets';
