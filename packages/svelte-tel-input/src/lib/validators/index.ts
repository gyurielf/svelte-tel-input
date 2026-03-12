import { parse } from '$lib/utils/helpers.js';
import type { CountryCode } from 'libphonenumber-js';
import type { ValidationError } from '$lib/types/index.js';

export interface TelValidatorOptions {
	/** Mark the field as required — empty string becomes an error. */
	required?: boolean;
	/** Restrict to a subset of country codes. Numbers from other countries are invalid. */
	allowedCountries?: CountryCode[];
	/** Country hint used when parsing numbers without a leading `+`. */
	country?: CountryCode | null;
}

/**
 * Validate a raw phone-number string and return the `ValidationError` reason,
 * or `null` when the value is valid.
 *
 * Works with any schema validation library — pass the result directly:
 *
 * @example Zod
 * ```ts
 * const schema = z.object({
 *   phone: z.string().superRefine((val, ctx) => {
 *     const error = validateTelInput(val, { required: true });
 *     if (error) ctx.addIssue({ code: 'custom', message: error });
 *   })
 * });
 * ```
 *
 * @example Valibot
 * ```ts
 * const schema = v.object({
 *   phone: v.pipe(v.string(), v.check(val => !validateTelInput(val, { required: true })))
 * });
 * ```
 *
 * @example Yup
 * ```ts
 * const schema = yup.object({
 *   phone: yup.string().test('tel', 'Invalid phone', val => !validateTelInput(val ?? ''))
 * });
 * ```
 */
export function validateTelInput(
	value: string,
	options: TelValidatorOptions = {}
): ValidationError {
	const { required = false, allowedCountries, country } = options;

	if (!value) return required ? 'required' : null;

	const result = parse(value, country ?? null);

	if (!result.isValid) return result.validationError ?? 'INVALID';

	if (
		allowedCountries &&
		allowedCountries.length &&
		result.countryCode != null &&
		!allowedCountries.includes(result.countryCode)
	) {
		return 'country_not_allowed';
	}

	return null;
}
