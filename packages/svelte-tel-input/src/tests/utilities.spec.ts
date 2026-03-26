import { describe, it, expect } from 'vitest';
import { parse, normalizeToE164, pickCountries } from '../lib/utils/index.js';

describe('parse()', () => {
	it('parses a full E.164 number without a country hint', () => {
		const result = parse('+12154567890');
		expect(result.isValid).toBe(true);
		expect(result.e164).toBe('+12154567890');
		expect(result.countryCode).toBe('US');
	});

	it('parses a national number given a country hint', () => {
		const result = parse('2154567890', 'US');
		expect(result.isValid).toBe(true);
		expect(result.e164).toBe('+12154567890');
		expect(result.countryCode).toBe('US');
	});

	it('returns isValid: false for garbage input', () => {
		const result = parse('not-a-phone');
		expect(result.isValid).toBe(false);
		expect(result.e164).toBeNull();
	});

	it('returns isValid: false for an empty string', () => {
		const result = parse('');
		expect(result.isValid).toBe(false);
		expect(result.e164).toBeNull();
	});

	it('parses a Hungarian number from E.164', () => {
		const result = parse('+36301234567');
		expect(result.isValid).toBe(true);
		expect(result.countryCode).toBe('HU');
		expect(result.e164).toBe('+36301234567');
	});

	it('parses a national Hungarian number with a country hint', () => {
		const result = parse('0630 123 4567', 'HU');
		expect(result.isValid).toBe(true);
		expect(result.e164).toBe('+36301234567');
	});

	it('ignores the country hint when the number leads with a + (E.164)', () => {
		// +1-215... is US regardless of the hint
		const result = parse('+12154567890', 'HU');
		expect(result.countryCode).toBe('US');
		expect(result.e164).toBe('+12154567890');
	});

	it('includes formatInternational when the number is valid', () => {
		const result = parse('+12154567890');
		expect(result.formatInternational).toBeTruthy();
	});
});

describe('normalizeToE164()', () => {
	it('returns E.164 for a valid number without country hint', () => {
		expect(normalizeToE164('+12154567890')).toBe('+12154567890');
	});

	it('returns E.164 for a national number with country hint', () => {
		expect(normalizeToE164('2154567890', 'US')).toBe('+12154567890');
	});

	it('returns null for garbage input', () => {
		expect(normalizeToE164('not-a-phone')).toBeNull();
	});

	it('returns null for an empty string', () => {
		expect(normalizeToE164('')).toBeNull();
	});

	it('returns null for an incomplete number', () => {
		// Not enough digits to be valid
		expect(normalizeToE164('+1215')).toBeNull();
	});
});

describe('pickCountries()', () => {
	it('returns only the requested countries', () => {
		const result = pickCountries(['US', 'HU']);
		expect(result).toHaveLength(2);
		expect(result.map((c) => c.iso2)).toEqual(['US', 'HU']);
	});

	it('preserves the order specified by the caller', () => {
		const result = pickCountries(['GB', 'US', 'HU']);
		expect(result.map((c) => c.iso2)).toEqual(['GB', 'US', 'HU']);
	});

	it('returns an empty array when given an empty list', () => {
		expect(pickCountries([])).toEqual([]);
	});

	it('skips unknown codes gracefully', () => {
		// 'XX' is not a valid CountryCode but the function shouldn't crash
		const result = pickCountries(['US', 'XX' as any, 'HU']);
		expect(result.map((c) => c.iso2)).toEqual(['US', 'HU']);
	});

	it('returns full Country objects with all fields', () => {
		const [us] = pickCountries(['US']);
		expect(us).toMatchObject({
			id: 'US',
			iso2: 'US',
			dialCode: '1',
			name: expect.stringContaining('United States')
		});
	});

	it('returns a single country when given one code', () => {
		const result = pickCountries(['DE']);
		expect(result).toHaveLength(1);
		expect(result[0].iso2).toBe('DE');
	});
});
