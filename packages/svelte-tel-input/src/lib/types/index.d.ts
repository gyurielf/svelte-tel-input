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
	/** International dial code */
	dialCode: string;
	/** Order (if >1 country with the same dial code) */
	priority: number;
	areaCodes: string[] | null;
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
	/** @new TODO - need to implement */
	isPossible: boolean;
	isValid: false;
	error: PhoneNumberParseError;
}

export interface DetailedValue {
	countryCode?: CountryCode | null;
	isValid: boolean;
	phoneNumber: string | null;
	countryCallingCode: CountryCallingCode | null;
	formattedNumber: E164Number | null;
	formatOriginal: E164Number | null;
	nationalNumber: E164Number | null;
	formatInternational: E164Number | null;
	formatNational: E164Number | null;
	uri: string | null;
	e164: E164Number | null;
	error?: string;
}

export type PhoneNumberParseError = 'NOT_A_NUMBER' | 'INVALID_COUNTRY' | 'TOO_SHORT' | 'TOO_LONG';
export type PhoneType = 'FIXED_LINE' | 'MOBILE';

export interface TelInputValidity {
	value: boolean | null;
	errorMessage?: string;
}

export interface TelInputOptions {
	/**
	 * It generates a placeholder into your input for the selected country. E.g. if the country is `US`, the placeholder will be `201 555 0123` by default.
	 * If you need other format, you can use tha `national` -> `(201) 555-0123` and `international` -> `+1 201 555 0123` mode.
	 * @default true
	 */

	autoPlaceholder?: boolean;
	/**
	 * Allow or disallow spaces in the input field
	 * @default true
	 */
	spaces?: boolean;
	/**
	 * Set validation to false if you change the country property.
	 * @default false
	 * @deprecated It became to the default behavior
	 */
	invalidateOnCountryChange?: boolean;
}

export type {
	CountryCallingCode,
	CountryCode,
	E164Number,
	NationalNumber,
	PhoneNumber,
	Countries,
	MetadataJson
};
