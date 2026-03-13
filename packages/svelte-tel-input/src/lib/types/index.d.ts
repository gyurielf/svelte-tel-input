import type { CountryCallingCode, CountryCode, MetadataJson, PhoneNumber } from 'libphonenumber-js';
import type { HTMLInputAttributes } from 'svelte/elements';

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
	/** Granular validation error when `isValid` is `false`. */
	validationError?: ValidationError;
}

/**
 * The reason the current phone number input is invalid.
 * - `'required'` — field is empty and `required` is `true`
 * - `'country_not_allowed'` — the resolved country is not in `options.allowedCountries`
 * - `'TOO_SHORT'` — number has too few digits
 * - `'TOO_LONG'` — number has too many digits
 * - `'NOT_A_NUMBER'` — input does not look like a phone number at all
 * - `'INVALID_COUNTRY'` — country code is not recognized
 * - `'INVALID_LENGTH'` — number length doesn't match any valid length for the country
 * - `'INVALID'` — fallback when the specific reason cannot be determined
 * - `null` — no error (input is valid)
 */
export type ValidationError =
	| 'required'
	| 'country_not_allowed'
	| 'TOO_SHORT'
	| 'TOO_LONG'
	| 'NOT_A_NUMBER'
	| 'INVALID_COUNTRY'
	| 'INVALID_LENGTH'
	| 'INVALID'
	| null;

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
	/**
	 * Prevent the country from changing when the user types a different
	 * international dial code (e.g. `+1`, `+36`).
	 * The input stays locked to the current `country` (or `defaultCountry`).
	 * @default false
	 */
	lockCountry?: boolean;
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
	/** It accepts any Country Code Alpha-2 (ISO 3166) -- DEFAULT COUNTRY */
	country?: CountryCode | null | undefined;
	/**
	 * Country to restore when `api.reset()` is called without `{ country: true }`.
	 * If not set, `reset()` clears `country` to `null`.
	 */
	defaultCountry?: CountryCode | null;
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

export type { CountryCallingCode, CountryCode, PhoneNumber, MetadataJson };
