// import {
// 	AsYouType,
// 	Metadata,
// 	getCountryCallingCode,
// 	getExampleNumber
// } from 'libphonenumber-js/max';
// import type { PhoneNumber, Countries, E164Number, CountryCode, Country } from '$lib/types/index.js';
// import { examplePhoneNumbers, countries as normalizedCountries } from '$lib/assets/index.js';

// const whiteSpaceRegex = new RegExp(
// 	'[\\t\\n\\v\\f\\r \\u00a0\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u200b\\u2028\\u2029\\u3000]',
// 	'g'
// );

// export const getCountry = ({
// 	field,
// 	value,
// 	countries = normalizedCountries
// }: {
// 	/**
// 	 * Field to search by
// 	 */
// 	field: keyof Country;
// 	/**
// 	 * Value to search for
// 	 */
// 	value: Country[keyof Country];
// 	countries?: Country[];
// }) => {
// 	if (['priority'].includes(field)) {
// 		throw new Error(`Field "${field}" is not supported`);
// 	}
// 	return countries.find((currentCountry) => {
// 		return value === currentCountry[field];
// 	});
// };

// type CountryByPartialNumber = {
// 	country: Country | undefined;
// 	fullDialCodeMatch: boolean;
// };
// export const guessCountryByPartialNumber = ({
// 	partialE164Number: partialPhone,
// 	countries = normalizedCountries,
// 	currentCountryIso2
// }: {
// 	partialE164Number: E164Number;
// 	countries?: Countries[];
// 	currentCountryIso2?: CountryCode | null;
// }): CountryByPartialNumber => {
// 	const defaultResult: CountryByPartialNumber = {
// 		country: undefined,
// 		fullDialCodeMatch: false
// 	};
// 	if (!partialPhone) {
// 		return defaultResult;
// 	}
// 	// remove spaces and leading `+` sign
// 	const phone = partialPhone.replace('+', '').replaceAll(whiteSpaceRegex, '');

// 	if (!phone) {
// 		return defaultResult;
// 	}

// 	let result = defaultResult;

// 	const updateResult = ({
// 		country,
// 		fullDialCodeMatch
// 	}: {
// 		country: Country;
// 		fullDialCodeMatch: boolean;
// 	}) => {
// 		const sameDialCode = country.dialCode === result.country?.dialCode;
// 		const newPriorityValueLower = (country.priority ?? 0) < (result.country?.priority ?? 0);

// 		if (!sameDialCode || newPriorityValueLower) {
// 			result = { country, fullDialCodeMatch };
// 		}
// 	};

// 	for (const parsedCountry of countries) {
// 		const { dialCode, areaCodes } = parsedCountry;

// 		// full match with dialCode
// 		if (phone.startsWith(dialCode)) {
// 			// make sure that we found the largest full dialCode
// 			const isNewDialCodeLonger = result.country
// 				? Number(dialCode) >= Number(result.country.dialCode)
// 				: true;

// 			if (areaCodes) {
// 				const phoneWithoutDialCode = phone.substring(dialCode.length);
// 				for (const areaCode of areaCodes) {
// 					if (phoneWithoutDialCode.startsWith(areaCode)) {
// 						// found full match with area code
// 						return {
// 							country: parsedCountry,
// 							fullDialCodeMatch: true
// 						};
// 					}
// 				}
// 			}

// 			if (isNewDialCodeLonger || dialCode === phone || !result.fullDialCodeMatch) {
// 				updateResult({
// 					country: parsedCountry,
// 					fullDialCodeMatch: true
// 				});
// 			}
// 		}

// 		// ignore particle matches if full match was found
// 		if (result.fullDialCodeMatch) continue;

// 		// particle match with dialCode
// 		if (phone.length < dialCode.length && dialCode.startsWith(phone)) {
// 			// make sure that we found smallest number dial code
// 			const isNewCodeLess = result.country
// 				? Number(dialCode) <= Number(result.country.dialCode)
// 				: true;

// 			if (isNewCodeLess) {
// 				updateResult({ country: parsedCountry, fullDialCodeMatch: false });
// 			}
// 		}
// 	}

// 	if (currentCountryIso2) {
// 		const currentCountry = getCountry({
// 			value: currentCountryIso2,
// 			field: 'iso2',
// 			countries
// 		});

// 		if (!currentCountry) {
// 			return result;
// 		}

// 		const getAreaCodesPartialMatch = (country: Country | undefined) => {
// 			if (!country?.areaCodes) return false;
// 			return country.areaCodes?.some((areaCode) =>
// 				areaCode.startsWith(phone.substring(country.dialCode.length))
// 			);
// 		};

// 		const currentAreaCodePartiallyMatch = currentCountry
// 			? getAreaCodesPartialMatch(currentCountry)
// 			: false;

// 		const shouldSaveCurrentCountry =
// 			!!result &&
// 			// countries have same dial code
// 			result.country?.dialCode === currentCountry.dialCode &&
// 			result.country !== currentCountry &&
// 			result.fullDialCodeMatch &&
// 			// current country area-code is still partially match input
// 			(!currentCountry.areaCodes || currentAreaCodePartiallyMatch);

// 		if (shouldSaveCurrentCountry) {
// 			result = {
// 				country: currentCountry,
// 				fullDialCodeMatch: true
// 			};
// 		}
// 	}
// 	return result;
// };

// export const updateCountryByPartialNumber = (
// 	input: E164Number,
// 	currentCountry: CountryCode | null,
// 	previousCountry: CountryCode | null,
// 	updateCountry: (newCountry: CountryCode | null) => CountryCode | null
// ) => {
// 	const { country: resolvedCountry } = guessCountryByPartialNumber({
// 		partialE164Number: input,
// 		currentCountryIso2: currentCountry
// 	});
// 	if (resolvedCountry && resolvedCountry.iso2 !== previousCountry) {
// 		return updateCountry(resolvedCountry.iso2);
// 	}
// 	return null;
// };
