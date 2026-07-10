import { describe, it, expect } from 'vitest';
import { getCountryByIso2, guessCountryByPartialNumber } from '../lib/utils/countryHelpers.js';
import type { CountryCode } from '../lib/types';

describe('getCountryByIso2', () => {
	it('returns the country for a known ISO2 code', () => {
		const us = getCountryByIso2('US');
		expect(us).toMatchObject({ iso2: 'US', dialCode: '1' });
	});

	it('returns undefined for an unknown code', () => {
		expect(getCountryByIso2('ZZ' as CountryCode)).toBeUndefined();
	});
});

describe('guessCountryByPartialNumber', () => {
	it('returns no match for empty / digitless input', () => {
		expect(guessCountryByPartialNumber({ partialE164Number: '' })).toEqual({
			country: undefined,
			fullDialCodeMatch: false
		});
		expect(guessCountryByPartialNumber({ partialE164Number: '+' })).toEqual({
			country: undefined,
			fullDialCodeMatch: false
		});
	});

	it('resolves a unique full dial code', () => {
		const hu = guessCountryByPartialNumber({ partialE164Number: '+36' });
		expect(hu.fullDialCodeMatch).toBe(true);
		expect(hu.country?.iso2).toBe('HU');

		const gb = guessCountryByPartialNumber({ partialE164Number: '+44' });
		expect(gb.fullDialCodeMatch).toBe(true);
		expect(gb.country?.iso2).toBe('GB');
	});

	it('breaks a shared dial code by lowest priority (US wins over CA on +1)', () => {
		const one = guessCountryByPartialNumber({ partialE164Number: '+1' });
		expect(one.fullDialCodeMatch).toBe(true);
		expect(one.country?.iso2).toBe('US');
	});

	it('breaks a shared dial code by lowest priority (RU wins over KZ on +7)', () => {
		const seven = guessCountryByPartialNumber({ partialE164Number: '+7' });
		expect(seven.fullDialCodeMatch).toBe(true);
		expect(seven.country?.iso2).toBe('RU');
	});

	it('disambiguates a shared dial code by matching area code (KZ via +733)', () => {
		const kz = guessCountryByPartialNumber({ partialE164Number: '+733' });
		expect(kz.fullDialCodeMatch).toBe(true);
		expect(kz.country?.iso2).toBe('KZ');
	});

	it('reports a partial (incomplete) dial code as not a full match', () => {
		const partial = guessCountryByPartialNumber({ partialE164Number: '+3' });
		expect(partial.fullDialCodeMatch).toBe(false);
		expect(partial.country?.dialCode.startsWith('3')).toBe(true);
	});

	it('retains the current country on a shared dial code (+1 keeps CA)', () => {
		const kept = guessCountryByPartialNumber({
			partialE164Number: '+1',
			currentCountryIso2: 'CA'
		});
		expect(kept.fullDialCodeMatch).toBe(true);
		expect(kept.country?.iso2).toBe('CA');
	});

	it('ignores an unknown currentCountryIso2 and returns the computed match', () => {
		const res = guessCountryByPartialNumber({
			partialE164Number: '+1',
			currentCountryIso2: 'ZZ' as CountryCode
		});
		expect(res.country?.iso2).toBe('US');
	});
});
