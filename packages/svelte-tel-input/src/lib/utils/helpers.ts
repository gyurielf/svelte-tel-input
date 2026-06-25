import {
	AsYouType,
	getExampleNumber,
	formatIncompletePhoneNumber,
	validatePhoneNumberLength
} from 'libphonenumber-js/max/es6';
import type { Country, DetailedValue, ValidationError } from '$lib/types/index.js';
import type { CountryCode } from 'libphonenumber-js';
import { examplePhoneNumbers, countries } from '$lib/assets/index.js';
import { getCountryByIso2 } from './countryHelpers.js';

export const generatePlaceholder = (
	country: CountryCode,
	{ spaces, format }: { spaces: boolean; format?: 'international' | 'national' } = {
		spaces: true,
		format: 'international'
	}
) => {
	const examplePhoneNumber = getExampleNumber(country, examplePhoneNumbers);
	if (examplePhoneNumber) {
		if (format === 'national') {
			return toNationalFormat(
				examplePhoneNumber.formatInternational().trim(),
				examplePhoneNumber.countryCallingCode,
				spaces
			);
		}
		return spaces ? examplePhoneNumber.formatInternational().trim() : examplePhoneNumber.number;
	} else {
		console.error(`No country found with this country code: ${country}`);
		return '';
	}
};

// ---------------------------------------------------------------------------
// Phone-number normalizer
// ---------------------------------------------------------------------------

export const normalizeForLibphonenumber = (input: string): string => {
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

const stripCallingCode = (internationalFormat: string, countryCallingCode: string): string =>
	internationalFormat.slice(countryCallingCode.length + 1).trim();

export const toNationalFormat = (
	internationalFormat: string,
	countryCallingCode: string,
	spaces: boolean
): string => {
	const prefix = `+${countryCallingCode} `;
	const national = internationalFormat.startsWith(prefix)
		? internationalFormat.slice(prefix.length)
		: internationalFormat;
	return spaces ? national : national.replace(/\s/g, '');
};

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
			if (formatted === capped && country?.dialCode) {
				// Calling-code leak: libphonenumber consumed a leading digit that
				// equals the country calling code as the code itself, so
				// nationalNumber is shorter than what the user typed (e.g. US "11"
				// → nationalNumber "1"). Those digits are national input, not a
				// trunk prefix — fall through to the synthesis branch below so the
				// typed digit is preserved instead of being sliced off.
				const isCallingCodeLeak =
					!!countryCallingCode &&
					capped.startsWith(countryCallingCode) &&
					phone?.nationalNumber === capped.slice(countryCallingCode.length);
				if (phone && phone.nationalNumber !== capped && !isCallingCodeLeak) {
					// Trunk-prefixed complete number (e.g. GB "07947…" → nationalNumber
					// "7947…"). Synthesis would be invalid; use the actual international
					// format which correctly omits the trunk prefix.
					formattedNumber =
						formatInternational && countryCallingCode
							? stripCallingCode(formatInternational, countryCallingCode)
							: stripSpecialChars(capped);
				} else {
					// National significant digits (partial or complete, no trunk prefix).
					// Synthesize an international string to get consistent spacing from
					// the first digit, then strip "+{dialCode} ".
					const intl = formatIncompletePhoneNumber(`+${country.dialCode}${capped}`);
					formattedNumber = stripSpecialChars(stripCallingCode(intl, country.dialCode));
				}
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
				? stripCallingCode(formatInternational, countryCallingCode)
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
	const countryObj = country ? getCountryByIso2(country) : undefined;
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
