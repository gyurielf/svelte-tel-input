import {
	AsYouType,
	getExampleNumber,
	formatIncompletePhoneNumber,
	validatePhoneNumberLength
} from 'libphonenumber-js/max';
import type { Country, DetailedValue, ValidationError } from '$lib/types/index.js';
import type { CountryCode } from 'libphonenumber-js';
import { examplePhoneNumbers, countries } from '$lib/assets/index.js';
import { getCountry } from './countryHelpers.js';

const whiteSpaceRegex = new RegExp(
	'[\\t\\n\\v\\f\\r \\u00a0\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u200b\\u2028\\u2029\\u3000]',
	'g'
);
const plusSignRegex = new RegExp('\\+', 'g');

export const generatePlaceholder = (
	country: CountryCode,
	{ spaces }: { spaces: boolean } = {
		spaces: true
	}
) => {
	const examplePhoneNumber = getExampleNumber(country, examplePhoneNumbers);
	if (examplePhoneNumber) {
		return spaces ? examplePhoneNumber.formatInternational().trim() : examplePhoneNumber.number;
	} else {
		console.error(`No country found with this country code: ${country}`);
		return '';
	}
};

export const isSelected = <
	T extends {
		id: string;
	}
>(
	itemToSelect: T | string,
	selectedItem: (T | undefined | null) | string
) => {
	if (!selectedItem) {
		return false;
	}

	if (typeof selectedItem === 'object' && typeof itemToSelect === 'object') {
		return selectedItem.id === itemToSelect.id;
	}

	return itemToSelect === selectedItem;
};
/**
 * These mappings map a character (key) to a specific digit that should
 * replace it for normalization purposes.
 * @param {string} character
 * @returns {string}
 */
export const allowedCharacters = (
	character: string,
	{ spaces, plusSign }: { spaces?: boolean; plusSign?: boolean } = {
		spaces: true,
		plusSign: true
	}
) => {
	const DIGITS = {
		'0': '0',
		'1': '1',
		'2': '2',
		'3': '3',
		'4': '4',
		'5': '5',
		'6': '6',
		'7': '7',
		'8': '8',
		'9': '9',
		'\uFF10': '0', // Fullwidth digit 0
		'\uFF11': '1', // Fullwidth digit 1
		'\uFF12': '2', // Fullwidth digit 2
		'\uFF13': '3', // Fullwidth digit 3
		'\uFF14': '4', // Fullwidth digit 4
		'\uFF15': '5', // Fullwidth digit 5
		'\uFF16': '6', // Fullwidth digit 6
		'\uFF17': '7', // Fullwidth digit 7
		'\uFF18': '8', // Fullwidth digit 8
		'\uFF19': '9', // Fullwidth digit 9
		'\u0660': '0', // Arabic-indic digit 0
		'\u0661': '1', // Arabic-indic digit 1
		'\u0662': '2', // Arabic-indic digit 2
		'\u0663': '3', // Arabic-indic digit 3
		'\u0664': '4', // Arabic-indic digit 4
		'\u0665': '5', // Arabic-indic digit 5
		'\u0666': '6', // Arabic-indic digit 6
		'\u0667': '7', // Arabic-indic digit 7
		'\u0668': '8', // Arabic-indic digit 8
		'\u0669': '9', // Arabic-indic digit 9
		'\u06F0': '0', // Eastern-Arabic digit 0
		'\u06F1': '1', // Eastern-Arabic digit 1
		'\u06F2': '2', // Eastern-Arabic digit 2
		'\u06F3': '3', // Eastern-Arabic digit 3
		'\u06F4': '4', // Eastern-Arabic digit 4
		'\u06F5': '5', // Eastern-Arabic digit 5
		'\u06F6': '6', // Eastern-Arabic digit 6
		'\u06F7': '7', // Eastern-Arabic digit 7
		'\u06F8': '8', // Eastern-Arabic digit 8
		'\u06F9': '9' // Eastern-Arabic digit 9,
	};
	// Type Guard for index signature.
	const isValidKey = (key: string): key is keyof typeof DIGITS => {
		return key in DIGITS;
	};

	// Allow spaces && plus sign character
	if (
		(spaces && whiteSpaceRegex.test(character)) ||
		(plusSign && plusSignRegex.test(character))
	) {
		return character;
	}
	if (isValidKey(character)) return DIGITS[character];
};

export const inputParser = (
	input: string,
	{
		allowSpaces
	}: {
		allowSpaces: boolean;
	}
) => {
	let value = '';
	for (let index = 0; index < input.length; index++) {
		if (input[index] === '+' && !value) {
			value += input[index];
		} else {
			const character = allowedCharacters(input[index], { spaces: allowSpaces });
			if (character !== undefined) {
				value += character;
			}
		}
	}

	// We force the + sign as a prefix for the number.
	if (value.length > 0 && !value.startsWith('+')) {
		value = '+' + value;
	}
	return value;
};

// ---------------------------------------------------------------------------
// Phone-number normalizer (merged from newHelpers.ts)
// ---------------------------------------------------------------------------

const normalizeForLibphonenumber = (input: string): string => {
	let value = '';
	for (let i = 0; i < input.length; i++) {
		const ch = input[i];
		if (ch >= '0' && ch <= '9') {
			value += ch;
			continue;
		}
		if (ch === '+' && value.length === 0) {
			value += ch;
		}
	}
	return value;
};

const capToMaxValidLength = (input: string, defaultCountryIso2?: string): string => {
	let capped = input;

	const hasPlus = capped.startsWith('+');
	const digitsOnly = capped.replace(/[^0-9]/g, '');
	if (digitsOnly.length > 15) {
		const first15 = digitsOnly.slice(0, 15);
		capped = hasPlus ? `+${first15}` : first15;
	}

	for (let i = 0; i < capped.length; i++) {
		const res = defaultCountryIso2
			? validatePhoneNumberLength(capped, defaultCountryIso2 as CountryCode)
			: validatePhoneNumberLength(capped);
		if (res !== 'TOO_LONG') return capped;
		if (capped.length <= 1) return capped;
		capped = capped.slice(0, -1);
		if (capped === '+') return capped;
	}
	return capped;
};

const formatNanp = (e164ish: string): string => {
	if (!e164ish.startsWith('+1')) return e164ish;
	const digits = e164ish.replace(/[^0-9]/g, '');
	const national = digits.slice(1);
	const a = national.slice(0, 3);
	const b = national.slice(3, 6);
	const c = national.slice(6, 10);
	let rest = '';
	if (national.length <= 3) rest = a;
	else if (national.length <= 6) rest = `${a} ${b}`;
	else rest = `${a} ${b} ${c}`;
	return `+1 ${rest}`.trimEnd();
};

const stripSpecialChars = (s: string): string =>
	s
		.replace(/[()-]/g, ' ')
		.replace(/\s{2,}/g, ' ')
		.trim();

export const parsePhoneInput = (input: string, country: Country | undefined): DetailedValue => {
	const normalized = normalizeForLibphonenumber(input);
	const defaultCountryIso2 = country?.iso2;
	const capped = capToMaxValidLength(
		normalized,
		normalized.startsWith('+') ? undefined : defaultCountryIso2
	);

	const asYouType = new AsYouType({
		defaultCountry: country?.iso2,
		defaultCallingCode: country?.dialCode
	});
	asYouType.input(capped);
	const phone = asYouType.getNumber();
	const countryCallingCode = asYouType.getCallingCode() || phone?.countryCallingCode || null;
	const countryCode = asYouType.getCountry() || country?.iso2 || null;
	const formatInternational = phone?.formatInternational() || null;
	const formatNational = phone?.formatNational() || null;
	const nationalNumber = phone?.nationalNumber || null;

	let formattedNumber: string | null = null;
	if (capped) {
		if (capped.startsWith('+')) {
			let raw = formatIncompletePhoneNumber(capped) || capped;
			if (countryCallingCode === '1' && (countryCode === 'US' || countryCode === 'CA')) {
				raw = formatNanp(capped);
			}
			formattedNumber = stripSpecialChars(raw);
		} else if (defaultCountryIso2) {
			const formatted = formatIncompletePhoneNumber(
				capped,
				defaultCountryIso2 as CountryCode
			);
			if (formatted === capped && formatInternational && countryCallingCode) {
				formattedNumber = formatInternational.slice(countryCallingCode.length + 1).trim();
			} else {
				formattedNumber = stripSpecialChars(formatted || capped);
			}
		} else {
			formattedNumber = capped;
		}
	}
	const phoneNumber = phone?.number || null;
	const uri = phone?.getURI() || null;

	const isValid = asYouType.isValid();

	let phoneValidationError: ValidationError = null;
	if (!isValid && capped) {
		const lengthResult = defaultCountryIso2
			? validatePhoneNumberLength(capped, defaultCountryIso2 as CountryCode)
			: validatePhoneNumberLength(capped);
		phoneValidationError = lengthResult ?? 'INVALID';
	}

	return {
		countryCallingCode,
		countryCode,
		e164: phoneNumber,
		formatInternational,
		formatNational,
		formatOriginal:
			formatInternational && countryCallingCode
				? formatInternational.slice(countryCallingCode.length + 1).trim()
				: null,
		formattedNumber,
		isPossible: asYouType.isPossible(),
		isPhoneValid: isValid,
		isValid,
		nationalNumber,
		phoneNumber,
		uri,
		validationError: phoneValidationError
	};
};

/**
 * Parse a raw phone number string into a `DetailedValue`.
 *
 * @param raw     - The raw input (E.164, national, or incomplete).
 * @param country - Optional ISO 3166-1 alpha-2 country code used as the
 *                  default country when the number has no leading `+`.
 */
export const parse = (raw: string, country?: CountryCode | null): DetailedValue => {
	const countryObj = country ? getCountry({ field: 'iso2', value: country }) : undefined;
	return parsePhoneInput(raw, countryObj);
};

/**
 * Normalize a raw phone number string to E.164 format.
 * Returns `null` when the number cannot be parsed or is not valid.
 *
 * @param raw     - The raw input (E.164, national, or incomplete).
 * @param country - Optional ISO 3166-1 alpha-2 country code used as the
 *                  default country when the number has no leading `+`.
 */
export const normalizeToE164 = (raw: string, country?: CountryCode | null): string | null => {
	const result = parse(raw, country);
	return result.isValid ? (result.e164 ?? null) : null;
};

/**
 * Return a subset of the full `countries` list filtered to the given codes,
 * preserving the order of `codes`.
 *
 * Useful for building country-picker dropdowns that only show relevant countries
 * and for pairing with the `allowedCountries` option.
 *
 * @param codes - ISO 3166-1 alpha-2 country codes to include (e.g. `['US', 'HU', 'GB']`).
 */
export const pickCountries = (codes: CountryCode[]): Country[] => {
	const set = new Set(codes);
	const map = new Map<CountryCode, Country>();
	for (const c of countries) {
		if (set.has(c.iso2)) map.set(c.iso2, c);
	}
	return codes.filter((code) => map.has(code)).map((code) => map.get(code)!);
};
