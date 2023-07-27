import {
	AsYouType,
	Metadata,
	getCountryCallingCode,
	getExampleNumber
} from 'libphonenumber-js/max';
import examples from 'libphonenumber-js/mobile/examples';
import type {
	PhoneNumber,
	MetadataJson,
	Countries,
	E164Number,
	CountryCode
} from '$lib/types/index.js';

export const capitalize = (str: string) => {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Use carefully, it can be rate limited.
export const getCurrentCountry = async () => {
	try {
		const response = await (await fetch('https://ip2c.org/s')).text();
		const result = (response || '').toString();

		if (!result || result[0] !== '1') {
			console.warn('Unable to fetch the country');
			return;
		}

		return result.substring(2, 4);
	} catch (error) {
		console.warn('Unable to fetch the country');
		return;
	}
};

export const isNumber = (value: number) => {
	return typeof value === 'number' && isFinite(value);
};

export const normalizeTelInput = (input?: PhoneNumber) => {
	const filteredResult = Object.fromEntries(
		Object.entries({
			countryCode: input ? input.country : null,
			isValid: input ? input.isValid() : false,
			isPossible: input ? input.isPossible() : false,
			phoneNumber: input ? input.number : null,
			countryCallingCode: input ? input.countryCallingCode : null,
			formattedNumber: input ? input.formatInternational() : null,
			nationalNumber: input ? input.nationalNumber : null,
			formatInternational: input ? input.formatInternational() : null,
			formatOriginal: input
				? input
						.formatInternational()
						.slice(input.countryCallingCode.length + 1)
						.trim()
				: null,
			formatNational: input ? input.formatNational() : null,
			uri: input ? input.getURI() : null,
			e164: input ? input.number : null
		}).filter(([, value]) => value !== null)
	);
	return filteredResult;
};

export const generatePlaceholder = (
	country: CountryCode,
	{ format, spaces }: { format: 'international' | 'national'; spaces: boolean } = {
		format: 'national',
		spaces: true
	}
) => {
	const examplePhoneNumber = getExampleNumber(country, examples);
	console.log(examplePhoneNumber?.nationalNumber);
	console.log(spaces);
	if (examplePhoneNumber) {
		switch (format) {
			case 'international':
				return spaces
					? examplePhoneNumber.formatInternational()
					: examplePhoneNumber.number;
			default:
				return spaces
					? examplePhoneNumber
							.formatInternational()
							.slice(examplePhoneNumber.countryCallingCode.length + 1)
							.trim()
					: examplePhoneNumber.nationalNumber;
		}
	} else {
		throw new Error(`No country found with this country code: ${country}`);
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

export const getInternationalPhoneNumberPrefix = (country: CountryCode) => {
	const ONLY_DIGITS_REGEXP = /^\d+$/;
	// Standard international phone number prefix: "+" and "country calling code".
	let prefix = '+' + getCountryCallingCode(country);
	// Get "leading digits" for a phone number of the country.
	// If there're "leading digits" then they can be part of the prefix too.
	const newMetadata = new Metadata();
	const leadingDigits = newMetadata.numberingPlan?.leadingDigits();
	if (leadingDigits && ONLY_DIGITS_REGEXP.test(leadingDigits)) {
		prefix += leadingDigits;
	}
	return prefix;
};

/**
 * Trims phone number digits if they exceed the maximum possible length
 * for a national (significant) number for the country.
 * @param  {string} number - A possibly incomplete phone number digits string. Can be a possibly incomplete E.164 phone number.
 * @param  {string} country
 * @return {string} Can be empty.
 */
export const trimNumber = (number: E164Number, country: CountryCode) => {
	const nationalSignificantNumberPart = getNationalSignificantNumberDigits(number, country);
	if (nationalSignificantNumberPart) {
		const overflowDigitsCount =
			nationalSignificantNumberPart.length - getMaxNumberLength(country);
		if (overflowDigitsCount > 0) {
			return number.slice(0, number.length - overflowDigitsCount);
		}
	}
	return number;
};

export const getMaxNumberLength = (country: CountryCode) => {
	// Get "possible lengths" for a phone number of the country.
	const newMetadata = new Metadata();
	newMetadata.selectNumberingPlan(country);
	// Return the last "possible length".

	if (newMetadata.numberingPlan) {
		return newMetadata.numberingPlan.possibleLengths()[
			newMetadata.numberingPlan.possibleLengths().length - 1
		];
	} else {
		throw new Error('There is no metadata object.');
	}
};

/**
 * If the phone number being input is an international one
 * then tries to derive the country from the phone number.
 * (regardless of whether there's any country currently selected)
 * @param {string} partialE164Number - A possibly incomplete E.164 phone number.
 * @param {string?} country - Currently selected country.
 * @param {string[]?} countries - A list of available countries. If not passed then "all countries" are assumed.
 * @return {string?}
 */
export const getCountryForPartialE164Number = (
	partialE164Number: E164Number,
	{
		country,
		countries,
		required
	}: {
		country?: CountryCode;
		countries?: Countries[];
		required?: boolean;
	} = {}
) => {
	if (partialE164Number === '+') {
		// Don't change the currently selected country yet.
		return country;
	}

	const derived_country =
		getCountryFromPossiblyIncompleteInternationalPhoneNumber(partialE164Number);

	// If a phone number is being input in international form
	// and the country can already be derived from it,
	// then select that country.
	if (derived_country && (!countries || countries.indexOf(derived_country as Countries) >= 0)) {
		return derived_country;
	}
	// If "International" country option has not been disabled
	// and the international phone number entered doesn't correspond
	// to the currently selected country then reset the currently selected country.
	else if (country && !required && !couldNumberBelongToCountry(partialE164Number, country)) {
		return undefined;
	}

	// Don't change the currently selected country.
	return country;
};

/**
 * Determines the country for a given (possibly incomplete) E.164 phone number.
 * @param  {string} number - A possibly incomplete E.164 phone number.
 * @return {string?}
 */
export const getCountryFromPossiblyIncompleteInternationalPhoneNumber = (number: E164Number) => {
	const formatter = new AsYouType();
	formatter.input(number);
	// // `001` is a special "non-geograpical entity" code
	// // in Google's `libphonenumber` library.
	// if (formatter.getCountry() === '001') {
	// 	return
	// }
	return formatter.getCountry();
};

/**
 * Parses a partially entered national phone number digits
 * (or a partially entered E.164 international phone number)
 * and returns the national significant number part.
 * National significant number returned doesn't come with a national prefix.
 * @param {string} number - National number digits. Or possibly incomplete E.164 phone number.
 * @param {string?} country
 * @return {string} [result]
 */
export const getNationalSignificantNumberDigits = (number: E164Number, country: CountryCode) => {
	// Create "as you type" formatter.
	const formatter = new AsYouType(country);
	// Input partial national phone number.
	formatter.input(number);
	// Return the parsed partial national phone number.
	const phoneNumber = formatter.getNumber();
	return phoneNumber && phoneNumber.nationalNumber;
};

/**
 * Checks if a partially entered E.164 phone number could belong to a country.
 * @param  {string} number
 * @param  {CountryCode} country
 * @return {boolean}
 */
export const couldNumberBelongToCountry = (number: E164Number, country: CountryCode) => {
	const intlPhoneNumberPrefix = getInternationalPhoneNumberPrefix(country);
	let i = 0;
	while (i < number.length && i < intlPhoneNumberPrefix.length) {
		if (number[i] !== intlPhoneNumberPrefix[i]) {
			return false;
		}
		i++;
	}
	return true;
};

export const isSupportedCountry = (country: CountryCode, metadata: MetadataJson) => {
	return metadata.countries[country] !== undefined;
};

/**
 * These mappings map a character (key) to a specific digit that should
 * replace it for normalization purposes.
 * @param {string} character
 * @returns {string}
 */
export const allowedCharacters = (
	character: string,
	{ spaces }: { spaces?: boolean } = {
		spaces: true
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

	// Allow spaces
	if (spaces) {
		const regex = new RegExp(
			'[\\t\\n\\v\\f\\r \\u00a0\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u200b\\u2028\\u2029\\u3000]',
			'g'
		);
		if (regex.test(character)) {
			return character;
		}
	}

	// Allow digits
	return DIGITS[character as keyof typeof DIGITS];
};

export const inputParser = (
	text: string,
	{
		allowSpaces,
		parseCharacter
	}: {
		allowSpaces: boolean;
		parseCharacter: (char: string, val: string, allowSpaces?: boolean) => string | undefined;
	}
) => {
	let value = '';

	for (let index = 0; index < text.length; index++) {
		const character = parseCharacter(text[index], value, allowSpaces);
		if (character !== undefined) {
			value += character;
		}
	}

	return value;
};

export const inspectAllowedChars = (character: string, value: string, allowSpaces?: boolean) => {
	// Leading plus is allowed
	if (character === '+') {
		if (!value) {
			return character;
		}
	}
	// Allowed characters
	return allowedCharacters(character, { spaces: allowSpaces });
};
