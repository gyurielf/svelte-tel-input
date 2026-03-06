import type { Country, DetailedValue } from '$lib/types';
import type { CountryCode } from 'libphonenumber-js';
import {
	AsYouType,
	formatIncompletePhoneNumber,
	validatePhoneNumberLength
} from 'libphonenumber-js/max';

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
	// `validatePhoneNumberLength` returns 'TOO_LONG'|'TOO_SHORT'|'INVALID_COUNTRY'|undefined
	// We only cap by trimming digits when it becomes TOO_LONG.
	let capped = input;

	// If the user types/pastes an extremely long number, trimming 1 digit at a time can become
	// expensive and (with a small iteration cap) can lead to unstable behavior.
	// Cap to the E.164 maximum (15 digits, excluding '+') first, then do fine-grained trimming.
	const hasPlus = capped.startsWith('+');
	const digitsOnly = capped.replace(/[^0-9]/g, '');
	if (digitsOnly.length > 15) {
		const first15 = digitsOnly.slice(0, 15);
		capped = hasPlus ? `+${first15}` : first15;
	}

	// Now do a small, bounded loop to trim down to a non-TOO_LONG length.
	for (let i = 0; i < capped.length; i++) {
		const res = defaultCountryIso2
			? validatePhoneNumberLength(capped, defaultCountryIso2 as CountryCode)
			: validatePhoneNumberLength(capped);
		if (res !== 'TOO_LONG') return capped;
		// Trim last digit (preserving leading '+').
		if (capped.length <= 1) return capped;
		capped = capped.slice(0, -1);
		if (capped === '+') return capped;
	}
	return capped;
};

const formatNanp = (e164ish: string): string => {
	// Input like +1XXXXXXXXXX (possibly incomplete). Output like +1 AAA-BBB-CCCC
	if (!e164ish.startsWith('+1')) return e164ish;
	const digits = e164ish.replace(/[^0-9]/g, '');
	// digits starts with 1
	const national = digits.slice(1);
	const a = national.slice(0, 3);
	const b = national.slice(3, 6);
	const c = national.slice(6, 10);
	let rest = '';
	if (national.length <= 3) rest = a;
	else if (national.length <= 6) rest = `${a}-${b}`;
	else rest = `${a}-${b}-${c}`;
	return `+1 ${rest}`.trimEnd();
};

export const newNormalizer = (input: string, country: Country | undefined): DetailedValue => {
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
	let formattedNumber: string | null = null;
	if (capped) {
		if (capped.startsWith('+')) {
			formattedNumber = formatIncompletePhoneNumber(capped) || capped;
			// NANP-ish formatting for +1...
			if (countryCallingCode === '1' && (countryCode === 'US' || countryCode === 'CA')) {
				formattedNumber = formatNanp(capped);
			}
		} else if (defaultCountryIso2) {
			const formatted = formatIncompletePhoneNumber(
				capped,
				defaultCountryIso2 as CountryCode
			);
			// If libphonenumber couldn't apply any formatting (e.g. national number without trunk
			// prefix like "13171377" for HU which expects "06..."), fall back to the national part
			// of the international format when the number is fully valid.
			if (formatted === capped && formatInternational && countryCallingCode) {
				formattedNumber = formatInternational.slice(countryCallingCode.length + 1).trim();
			} else {
				formattedNumber = formatted || capped;
			}
		} else {
			formattedNumber = capped;
		}
	}
	const phoneNumber = phone?.number || null;
	const nationalNumber = phone?.nationalNumber || null;
	const uri = phone?.getURI() || null;

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
		isValid: asYouType.isValid(),
		nationalNumber,
		phoneNumber,
		uri
	};
};
