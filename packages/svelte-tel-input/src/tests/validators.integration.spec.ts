/**
 * Integration tests for validateTelInput() with real Zod and Valibot schemas.
 */
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import * as v from 'valibot';
import { validateTelInput } from '$lib/validators/index.js';

// ---------------------------------------------------------------------------
// Zod integration
// ---------------------------------------------------------------------------

const zodPhoneSchema = z.object({
	phone: z.string().superRefine((val, ctx) => {
		const error = validateTelInput(val, { required: true });
		if (error) ctx.addIssue({ code: 'custom', message: error });
	})
});

const zodOptionalPhoneSchema = z.object({
	phone: z.string().superRefine((val, ctx) => {
		const error = validateTelInput(val);
		if (error) ctx.addIssue({ code: 'custom', message: error });
	})
});

const zodAllowedCountriesSchema = z.object({
	phone: z.string().superRefine((val, ctx) => {
		const error = validateTelInput(val, { allowedCountries: ['US', 'HU'] });
		if (error) ctx.addIssue({ code: 'custom', message: error });
	})
});

describe('Zod integration', () => {
	it('passes for a valid US number', () => {
		const result = zodPhoneSchema.safeParse({ phone: '+12154567890' });
		expect(result.success).toBe(true);
	});

	it('passes for a valid HU number', () => {
		const result = zodPhoneSchema.safeParse({ phone: '+36301234567' });
		expect(result.success).toBe(true);
	});

	it('fails with "REQUIRED" for an empty string', () => {
		const result = zodPhoneSchema.safeParse({ phone: '' });
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('REQUIRED');
		}
	});

	it('fails with "invalid" for garbage input', () => {
		const result = zodPhoneSchema.safeParse({ phone: 'not-a-phone' });
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('INVALID');
		}
	});

	it('passes for empty string when not required', () => {
		const result = zodOptionalPhoneSchema.safeParse({ phone: '' });
		expect(result.success).toBe(true);
	});

	it('fails with "COUNTRY_NOT_ALLOWED" for a GB number when only US/HU allowed', () => {
		const result = zodAllowedCountriesSchema.safeParse({ phone: '+447947123456' });
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('COUNTRY_NOT_ALLOWED');
		}
	});

	it('passes for a US number when US is in allowedCountries', () => {
		const result = zodAllowedCountriesSchema.safeParse({ phone: '+12154567890' });
		expect(result.success).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// Valibot integration
// ---------------------------------------------------------------------------

const valibotPhoneSchema = v.object({
	phone: v.pipe(
		v.string(),
		v.check(
			(val) => !validateTelInput(val, { required: true }),
			(issue) => (validateTelInput(issue.input, { required: true }) ?? 'INVALID') as string
		)
	)
});

const valibotOptionalPhoneSchema = v.object({
	phone: v.pipe(
		v.string(),
		v.check((val) => !validateTelInput(val))
	)
});

const valibotAllowedCountriesSchema = v.object({
	phone: v.pipe(
		v.string(),
		v.check(
			(val) => !validateTelInput(val, { allowedCountries: ['US', 'HU'] }),
			(issue) =>
				(validateTelInput(issue.input, { allowedCountries: ['US', 'HU'] }) ??
					'INVALID') as string
		)
	)
});

describe('Valibot integration', () => {
	it('passes for a valid US number', () => {
		const result = v.safeParse(valibotPhoneSchema, { phone: '+12154567890' });
		expect(result.success).toBe(true);
	});

	it('passes for a valid HU number', () => {
		const result = v.safeParse(valibotPhoneSchema, { phone: '+36301234567' });
		expect(result.success).toBe(true);
	});

	it('fails for an empty string when required', () => {
		const result = v.safeParse(valibotPhoneSchema, { phone: '' });
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.issues[0].message).toBe('REQUIRED');
		}
	});

	it('fails for garbage input', () => {
		const result = v.safeParse(valibotPhoneSchema, { phone: 'not-a-phone' });
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.issues[0].message).toBe('INVALID');
		}
	});

	it('passes for empty string when not required', () => {
		const result = v.safeParse(valibotOptionalPhoneSchema, { phone: '' });
		expect(result.success).toBe(true);
	});

	it('fails with "COUNTRY_NOT_ALLOWED" for a GB number when only US/HU allowed', () => {
		const result = v.safeParse(valibotAllowedCountriesSchema, { phone: '+447947123456' });
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.issues[0].message).toBe('COUNTRY_NOT_ALLOWED');
		}
	});

	it('passes for a US number when US is in allowedCountries', () => {
		const result = v.safeParse(valibotAllowedCountriesSchema, { phone: '+12154567890' });
		expect(result.success).toBe(true);
	});
});
