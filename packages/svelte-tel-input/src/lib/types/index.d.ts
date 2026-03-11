import type { CountryCallingCode, CountryCode, MetadataJson, PhoneNumber } from 'libphonenumber-js';
import type { HTMLInputAttributes } from 'svelte/elements';

type Countries = {
	// Metadata here is a compressed one,
	// so a country's data is just an array of some properties
	// instead of a JSON object of shape:
	// {
	//   phone_code: string,
	//   idd_prefix: string,
	//   national_number_pattern: string,
	//   types: object,
	//   examples: object,
	//   formats: object[]?,
	//   possible_lengths: number[],
	//   ...
	// }
	//
	// `in` operator docs:
	// https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types
	// `country in CountryCode` means "for each and every CountryCode".
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[country in CountryCode]?: any[];
};

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
	isPossible: boolean;
	isValid: boolean;
	phoneNumber: string | null;
	countryCallingCode: string | null;
	formattedNumber: string | null;
	formatOriginal: string | null;
	nationalNumber: string | null;
	formatInternational: string | null;
	formatNational: string | null;
	uri: string | null;
	e164: string | null;
	error?: string;
}

export type PhoneNumberParseError = 'NOT_A_NUMBER' | 'INVALID_COUNTRY' | 'TOO_SHORT' | 'TOO_LONG';
export type PhoneType = 'FIXED_LINE' | 'MOBILE';

/**
 * The reason the current phone number input is invalid.
 * - `'required'` — field is empty and `required` is `true`
 * - `'country_not_allowed'` — the resolved country is not in `options.allowedCountries`
 * - `'invalid'` — number does not pass libphonenumber-js validation
 * - `null` — no error (input is valid)
 */
export type ValidationError = 'required' | 'country_not_allowed' | 'invalid' | null;

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
	 * @deprecated This option is no longer used. Country-change validity is now
	 * determined by the `required` prop: empty input after a country change is
	 * invalid when `required` is set, valid otherwise.
	 */
	invalidateOnCountryChange?: boolean;
	/**
	 * Control when validation is triggered.
	 * @default 'always'
	 */
	validateOn?: 'input' | 'blur' | 'always';
	/**
	 * Restrict validation to a specific set of countries.
	 * When provided, any resolved country that is not in this list will cause
	 * the field to be marked invalid with `validationError = 'country_not_allowed'`.
	 * Pass `undefined` (or omit) to allow all countries.
	 */
	allowedCountries?: CountryCode[];
}

export interface Props extends HTMLInputAttributes {
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
	value: string;
	/** It's accept any Country Code Alpha-2 (ISO 3166) -- DEFAULT COUNTRY */
	country?: CountryCode | null | undefined;
	/** Detailed parse of the E164 phone number */
	detailedValue?: Readonly<Partial<DetailedValue> | null>;
	/** Validity of the input based on the config settings. */
	valid?: boolean;
	/** The reason the current value is invalid, or `null` when valid. */
	validationError?: ValidationError;
	/** You can turn on and off certain features by this object */
	options?: TelInputOptions;
	/** Binding to the underlying `<input>` element */
	el?: HTMLInputElement | undefined;
	onCountryChange?: (newCountry: CountryCode | null) => void;
	onValidityChange?: (newValidity: boolean, error: ValidationError) => void;
	onValueChange?: (newValue: string, newDetails: Readonly<Partial<DetailedValue> | null>) => void;
	onError?: (error: string) => void;
	onLoad?: () => void;
}

export type {
	CountryCallingCode,
	CountryCode,
	PhoneNumber,
	Countries,
	MetadataJson,
	ValidationError
};
