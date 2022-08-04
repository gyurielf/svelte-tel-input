import type { PhoneNumberParseError } from '$lib/types/enums';
import type {
	CountryCallingCode,
	CountryCode,
	E164Number,
	NationalNumber
} from 'libphonenumber-js';

export interface PhoneNumberError {
	isValid: false;
	error: PhoneNumberParseError;
}

export interface NormalizedPhoneNumber {
	countryCode?: CountryCode | null;
	isValid: boolean;
	phoneNumber: string | null;
	countryCallingCode: CountryCallingCode | null;
	formattedNumber: string | null;
	formatOriginal: string | null;
	nationalNumber: NationalNumber | null;
	formatInternational: string | null;
	formatNational: string | null;
	uri: string | null;
	e164: E164Number | null;
	error?: string;
}
