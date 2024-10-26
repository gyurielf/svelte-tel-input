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
