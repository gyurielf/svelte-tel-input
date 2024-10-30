// // helpers

// import {
// 	AsYouType,
// 	Metadata,
// 	getCountryCallingCode,
// 	getExampleNumber
// } from 'libphonenumber-js/max';
// import type { PhoneNumber, Countries, E164Number, CountryCode, Country } from '$lib/types/index.js';
// import { examplePhoneNumbers, countries as countries } from '$lib/assets/index.js';

// export const normalizeTelInput = (input?: PhoneNumber) => {
// 	const result = {
// 		countryCode: input ? input.country : null,
// 		isValid: input ? input.isValid() : false,
// 		isPossible: input ? input.isPossible() : false,
// 		phoneNumber: input ? input.number : null,
// 		countryCallingCode: input ? input.countryCallingCode : null,
// 		formattedNumber: input ? input.formatInternational() : null,
// 		nationalNumber: input ? input.nationalNumber : null,
// 		formatInternational: input ? input.formatInternational() : null,
// 		formatOriginal: input
// 			? input
// 					.formatInternational()
// 					.slice(input.countryCallingCode.length + 1)
// 					.trim()
// 			: null,
// 		formatNational: input ? input.formatNational() : null,
// 		uri: input ? input.getURI() : null,
// 		e164: input ? input.number : null
// 	};

// 	const filteredResult: Record<string, unknown> = {};
// 	for (const key in result) {
// 		if (
// 			result[key as keyof typeof result] !== undefined &&
// 			result[key as keyof typeof result] !== null
// 		) {
// 			filteredResult[key] = result[key as keyof typeof result];
// 		}
// 	}
// 	return filteredResult;
// };

// newParse
import type { Country, DetailedValue, E164Number } from '$lib/types';
import { AsYouType, formatIncompletePhoneNumber } from 'libphonenumber-js/max';

export const newNormalizer = (input: E164Number, country: Country | undefined): DetailedValue => {
	// console.log('formatIncompletePhoneNumber - CA - ', formatIncompletePhoneNumber('+2123'));
	// console.log('formatIncompletePhoneNumber - US - ', formatIncompletePhoneNumber('+212'));
	// console.log('formatIncompletePhoneNumber - US - ', formatIncompletePhoneNumber('+23'));
	// console.log('formatIncompletePhoneNumber - US - ', formatIncompletePhoneNumber('+1767132'));
	// console.log('formatIncompletePhoneNumber - ', formatIncompletePhoneNumber(input));
	// console.log('formatIncompletePhoneNumber - ', formatIncompletePhoneNumber(input));
	// console.log(guessCountryByPartialNumber({ partialE164Number: input })?.country?.iso2);

	const asYouType = new AsYouType({
		defaultCountry: country?.iso2,
		defaultCallingCode: country?.dialCode
	});
	asYouType.input(input);
	const phone = asYouType.getNumber();
	const countryCallingCode = asYouType.getCallingCode() || null;
	const countryCode = asYouType.getCountry() || country?.iso2 || null;
	const formatInternational = phone?.formatInternational() || null;
	const formatNational = phone?.formatNational() || null;
	const formattedNumber = formatIncompletePhoneNumber(input) || null;
	const nationalNumber = phone?.formatNational() || null;
	const phoneNumber = phone?.number || null;
	const uri = phone?.getURI() || null;

	// Should implement try catch<--
	// try {
	//     const asYouType = new libphonenumber.AsYouType(this.state.asYouTypeCountry)
	//     text = asYouType.input(value)
	//     template = asYouType.getTemplate()
	// } catch (error) {
	//     if (error.message.indexOf('Unknown country') === 0) {
	//         text = value
	//         template = value.replace(/./g, 'x')
	//     } else {
	//         throw error
	//     }
	// }
	// return { text, template }

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
