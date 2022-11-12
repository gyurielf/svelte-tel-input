import { getCountryCallingCode, Metadata } from 'libphonenumber-js/core';
import type { CountryCode } from '$lib/types';

// Should relocate this type.
import type { MetadataJson } from 'libphonenumber-js/core';

const ONLY_DIGITS_REGEXP = /^\d+$/;
export const getInternationalPhoneNumberPrefix = (country: CountryCode, metadata: MetadataJson) => {
	// Standard international phone number prefix: "+" and "country calling code".
	let prefix = '+' + getCountryCallingCode(country, metadata);
	// Get "leading digits" for a phone number of the country.
	// If there're "leading digits" then they can be part of the prefix too.
	const newMetadata = new Metadata(metadata);
	const leadingDigits = newMetadata.numberingPlan?.leadingDigits();
	if (leadingDigits && ONLY_DIGITS_REGEXP.test(leadingDigits)) {
		prefix += leadingDigits;
	}
	return prefix;
};
