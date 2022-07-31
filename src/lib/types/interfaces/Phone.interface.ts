import type { PhoneNumberParseError } from '$lib/types/enums';
import type { CountryCallingCode, E164Number, NationalNumber } from 'libphonenumber-js';

export interface PhoneNumberError {
	isValid: false;
	error: PhoneNumberParseError;
}

export interface NormalizedPhoneNumber {
	[k: string]:
		| string
		| boolean
		| E164Number
		| CountryCallingCode
		| NationalNumber
		| null
		| undefined;
}
