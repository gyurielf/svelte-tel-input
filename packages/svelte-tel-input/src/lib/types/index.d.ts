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

export interface DetailedValue {
	countryCode?: CountryCode | null;
	isValid: boolean;
	phoneNumber: string | null;
	countryCallingCode: CountryCallingCode | null;
	formattedNumber: string | null;
	formatOriginal: string | null;
	nationalNumber: string | null;
	formatInternational: string | null;
	formatNational: string | null;
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
	 */
	invalidateOnCountryChange?: boolean;
	/**
	 *  "international": `+36 20 123 4567`,
	 *  "default": `20 123 4567`
	 * @default national
	 */
	format?: 'national' | 'international';
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
