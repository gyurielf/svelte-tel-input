export { default as TelInput } from './components/input/TelInput.svelte';
export {
	inputParser,
	clickOutsideAction,
	isSelected,
	parsePhoneInput,
	parse,
	normalizeToE164
} from '$lib/utils/index.js';
export { parsePhoneNumberWithError, ParseError } from 'libphonenumber-js/max';
export { countries } from '$lib/assets/index.js';
