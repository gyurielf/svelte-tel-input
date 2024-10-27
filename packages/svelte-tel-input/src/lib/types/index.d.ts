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

export interface Props {
	autocomplete?: AutoFill | null;
	/** You can set the classes of the input field*/
	class?: string;
	/** You can disable the component and set the disabled attribute of the input field */
	disabled?: boolean;
	/** You can set the id attribute of the input field */
	id?: string;
	/** You can set the name attribute of the input field */
	name?: string | null;
	/** It will overwrite the autoPlaceholder ! */
	placeholder?: string | null;
	/** You can set the readonly attribute of the input field */
	readonly?: boolean | null;
	/** Set the required attribute on the input element */
	required?: boolean | null;
	/** You can set the size attribute of the input field */
	size?: number | null;
	/** The core value of the input, this is the only one what you can store. It's an E164 phone number.*/
	value: E164Number | null;
	/** It's accept any Country Code Alpha-2 (ISO 3166) */
	country?: CountryCode | null | undefined;
	/** Detailed parse of the E164 phone number */
	detailedValue?: Readonly<Partial<DetailedValue> | null>;
	/** Validity of the input based on the config settings. */
	valid?: boolean;
	/** You can turn on and off certain features by this object */
	options?: TelInputOptions;
	/** Binding to the underlying `<input>` element */
	el?: HTMLInputElement | undefined;
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
