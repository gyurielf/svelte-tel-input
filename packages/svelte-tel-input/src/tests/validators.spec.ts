import { describe, it, expect } from 'vitest';
import { validateTelInput } from '$lib/validators/index.js';
import type { CountryCode } from '$lib/types';

describe('validateTelInput()', () => {
	describe('empty input', () => {
		it('returns null for empty string when not required', () => {
			expect(validateTelInput('')).toBeNull();
		});

		it('returns "required" for empty string when required', () => {
			expect(validateTelInput('', { required: true })).toBe('required');
		});
	});

	describe('valid numbers', () => {
		it('returns null for a valid E.164 US number', () => {
			expect(validateTelInput('+12154567890')).toBeNull();
		});

		it('returns null for a valid national number with country hint', () => {
			expect(validateTelInput('2154567890', { country: 'US' })).toBeNull();
		});

		it('returns null for a valid HU number', () => {
			expect(validateTelInput('+36301234567')).toBeNull();
		});
	});

	describe('invalid numbers', () => {
		it('returns "invalid" for a garbage string', () => {
			expect(validateTelInput('not-a-phone')).toBe('INVALID');
		});

		it('returns "TOO_SHORT" for an incomplete number', () => {
			expect(validateTelInput('+1215')).toBe('TOO_SHORT');
		});

		it('returns "TOO_SHORT" for an incomplete number with country hint', () => {
			expect(validateTelInput('215', { country: 'US' })).toBe('TOO_SHORT');
		});

		it('returns "INVALID_COUNTRY" for digits-only without recognizable country code', () => {
			expect(validateTelInput('+0001234')).toBe('INVALID_COUNTRY');
		});
	});

	describe('allowedCountries', () => {
		it('returns null when country is in allowedCountries', () => {
			expect(validateTelInput('+12154567890', { allowedCountries: ['US', 'HU'] })).toBeNull();
		});

		it('returns "country_not_allowed" when country is not in allowedCountries', () => {
			expect(validateTelInput('+12154567890', { allowedCountries: ['HU', 'GB'] })).toBe(
				'country_not_allowed'
			);
		});

		it('returns null when allowedCountries is empty (no restriction)', () => {
			expect(validateTelInput('+12154567890', { allowedCountries: [] })).toBeNull();
		});
	});

	describe('usage with schema validators (integration patterns)', () => {
		it('works as a Zod .refine() predicate', () => {
			const isValid = (val: string) => !validateTelInput(val, { required: true });
			expect(isValid('+12154567890')).toBe(true);
			expect(isValid('')).toBe(false);
			expect(isValid('garbage')).toBe(false);
		});

		it('works as a Valibot v.check() predicate', () => {
			const check = (val: string) => validateTelInput(val) === null;
			expect(check('+12154567890')).toBe(true);
			expect(check('garbage')).toBe(false);
		});

		it('allows passing the error message to the schema library', () => {
			const opts = { required: true, allowedCountries: ['HU'] as CountryCode[] };
			expect(validateTelInput('', opts)).toBe('required');
			expect(validateTelInput('+12154567890', opts)).toBe('country_not_allowed');
			expect(validateTelInput('+36301234567', opts)).toBeNull();
		});
	});
});
