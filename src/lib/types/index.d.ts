import type {
	CountryCallingCode,
	CountryCode,
	E164Number,
	NationalNumber,
	MetadataJson,
	PhoneNumber
} from 'libphonenumber-js';
import type { Countries } from 'libphonenumber-js/types';

export interface Country {
	id: string;
	label: string;
	name: string;
	iso2: CountryCode;
	dialCode: string | number | string[];
	priority: string | number | string[];
	areaCodes: string | number | string[] | null;
}

export type CountrySelectEvents<T> = {
	add: { option: T };
	remove: { option: T };
	same: { option: T };
	change: {
		option: T;
	};
	focus: unknown;
	blur: unknown;
};

export interface PhoneNumberError {
	isValid: false;
	error: PhoneNumberParseError;
}

export interface NormalizedTelNumber {
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

export type PhoneNumberParseError = 'NOT_A_NUMBER' | 'INVALID_COUNTRY' | 'TOO_SHORT' | 'TOO_LONG';
export type PhoneType = 'FIXED_LINE' | 'MOBILE';

export type {
	CountryCallingCode,
	CountryCode,
	E164Number,
	NationalNumber,
	PhoneNumber,
	Countries,
	MetadataJson
};

export interface TelInputValidity {
	value: boolean | null;
	errorMessage?: string;
}

export type TelInputDispatchEvents = {
	country: CountryCode | null;
	parseError: string;
	parseInput: Partial<NormalizedTelNumber> | null;
	valid: boolean;
	value: E164Number | null;
};
