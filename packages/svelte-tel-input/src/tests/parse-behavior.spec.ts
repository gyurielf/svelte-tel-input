/**
 * parse-behavior.spec.ts
 *
 * Documents and validates how `parsePhoneInput` (and the higher-level `parse`)
 * format phone numbers for display, covering:
 *   - The fixed "calling-code-leak" bug for inputs like `3611234567` with HU selected
 *   - Formatted output uses spaces only (parentheses and dashes are stripped)
 *
 * Test inputs are taken verbatim from number-inconsistencies.md.
 */

import { describe, it, expect } from 'vitest';
import { parse } from '../lib/utils/index.js';

// ---------------------------------------------------------------------------
// Hungarian inputs (country = 'HU', callingCode = 36)
// ---------------------------------------------------------------------------

describe('parsePhoneInput HU — spaces-only display', () => {
	it('+3611234567 — E.164 with +, international display', () => {
		const result = parse('+3611234567', 'HU');
		expect(result.e164).toBe('+3611234567');
		expect(result.isValid).toBe(true);
		expect(result.countryCode).toBe('HU');
		expect(result.formattedNumber).toBe('+36 1 123 4567');
		expect(result.formatInternational).toBe('+36 1 123 4567');
		expect(result.formatNational).toBe('(06 1) 123 4567');
		expect(result.formatOriginal).toBe('1 123 4567');
	});

	it('3611234567 — calling-code digits without + (no brackets/hyphens)', () => {
		// formatIncompletePhoneNumber returns "36 1 123 4567" — preserve digits as typed, just strip brackets/hyphens
		const result = parse('3611234567', 'HU');
		expect(result.e164).toBe('+3611234567');
		expect(result.isValid).toBe(true);
		expect(result.formattedNumber).toBe('36 1 123 4567');
	});

	it('+36301234567 — E.164 mobile with +', () => {
		const result = parse('+36301234567', 'HU');
		expect(result.e164).toBe('+36301234567');
		expect(result.isValid).toBe(true);
		expect(result.formattedNumber).toBe('+36 30 123 4567');
		expect(result.formatNational).toBe('06 30 123 4567');
	});

	it('301234567 — national significant digits (mobile, no trunk)', () => {
		const result = parse('301234567', 'HU');
		expect(result.e164).toBe('+36301234567');
		expect(result.isValid).toBe(true);
		expect(result.formattedNumber).toBe('30 123 4567');
	});

	it('11234567 — national significant digits (landline, no trunk)', () => {
		const result = parse('11234567', 'HU');
		expect(result.e164).toBe('+3611234567');
		expect(result.isValid).toBe(true);
		expect(result.formattedNumber).toBe('1 123 4567');
	});

	it('0611234567 — national with trunk 06 (landline)', () => {
		const result = parse('0611234567', 'HU');
		expect(result.e164).toBe('+3611234567');
		expect(result.isValid).toBe(true);
		// strips parens from "(06 1) 123 4567" → "06 1 123 4567"
		expect(result.formattedNumber).toBe('06 1 123 4567');
	});

	it('06301234567 — national with trunk 06 (mobile)', () => {
		const result = parse('06301234567', 'HU');
		expect(result.e164).toBe('+36301234567');
		expect(result.isValid).toBe(true);
		expect(result.formattedNumber).toBe('06 30 123 4567');
	});
});

// ---------------------------------------------------------------------------
// US inputs
// ---------------------------------------------------------------------------

describe('parsePhoneInput US — spaces-only display', () => {
	it('2154567890 — national, strips parens and dash', () => {
		const result = parse('2154567890', 'US');
		expect(result.e164).toBe('+12154567890');
		expect(result.isValid).toBe(true);
		// "(215) 456-7890" → "215 456 7890"
		expect(result.formattedNumber).toBe('215 456 7890');
	});

	it('+12154567890 — E.164, spaces only', () => {
		const result = parse('+12154567890', 'US');
		expect(result.e164).toBe('+12154567890');
		// formatIncompletePhoneNumber already returns "+1 213 373 4253" style (no dashes)
		expect(result.formattedNumber).toBe('+1 215 456 7890');
	});

	it('returns null for empty input', () => {
		expect(parse('', 'HU').formattedNumber).toBeNull();
	});

	it("'11' — leading 1 preserved (calling-code leak)", () => {
		expect(parse('11', 'US').formattedNumber).toBe('11');
	});

	it("'111' — leading 1 preserved (calling-code leak)", () => {
		expect(parse('111', 'US').formattedNumber).toBe('111');
	});
});

// ---------------------------------------------------------------------------
// NANP trunk-prefix leniency (US/CA)
//
// libphonenumber treats a leading `1` in a North American number as the
// country code, and a *further* leading `1` as the national trunk (long-
// distance) prefix — stripping both before validating the 10-digit core.
// So `254 567 8900`, `1 254 567 8900`, and `1 1 254 567 8900` all resolve to
// the same E.164 (+12545678900) and are all valid.
//
// This is NOT a bug in this library: it is standard libphonenumber behaviour.
// The leniency is bounded — an 11-digit string with no clean trunk split, or
// surplus leading 1s, still resolves to an invalid number. These tests pin that
// intentional behaviour so it is not mistaken for a regression later.
// ---------------------------------------------------------------------------

describe('parsePhoneInput US — NANP trunk-prefix leniency', () => {
	it("'254 567 8900' — plain 10-digit national is valid", () => {
		const result = parse('254 567 8900', 'US');
		expect(result.isValid).toBe(true);
		expect(result.e164).toBe('+12545678900');
		expect(result.nationalNumber).toBe('2545678900');
	});

	it("'1 254 567 8900' — leading trunk '1' stripped, same number", () => {
		const result = parse('1 254 567 8900', 'US');
		expect(result.isValid).toBe(true);
		expect(result.e164).toBe('+12545678900');
		expect(result.nationalNumber).toBe('2545678900');
	});

	it("'1 1 254 567 8900' — country code + trunk '1' both stripped, same number", () => {
		const result = parse('1 1 254 567 8900', 'US');
		expect(result.isValid).toBe(true);
		expect(result.e164).toBe('+12545678900');
		expect(result.nationalNumber).toBe('2545678900');
	});

	it('all three NANP spellings collapse to the same E.164', () => {
		const e164 = (input: string) => parse(input, 'US').e164;
		expect(e164('254 567 8900')).toBe('+12545678900');
		expect(e164('1 254 567 8900')).toBe('+12545678900');
		expect(e164('1 1 254 567 8900')).toBe('+12545678900');
	});

	it("'11254567890' — 11 raw digits (no resolvable trunk split) is NOT valid", () => {
		const result = parse('11254567890', 'US');
		expect(result.isValid).toBe(false);
	});

	it("'1112545678900' — surplus leading 1s do not produce a valid number", () => {
		const result = parse('1112545678900', 'US');
		expect(result.isValid).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// HU partial national input — consistent spacing
// Covers the inconsistency where typing without a '+36' prefix produced no
// spaces until ~8 digits, but typing with '+36' prefix produced spaces from
// the first digit after the calling code.
// ---------------------------------------------------------------------------

describe('HU partial national input — consistent spacing', () => {
	// Short inputs where synthesis is bypassed (national formatter already agrees)
	it("'2' — single digit, no change", () => {
		expect(parse('2', 'HU').formattedNumber).toBe('2');
	});

	it("'20' — two digits, no spaces yet", () => {
		expect(parse('20', 'HU').formattedNumber).toBe('20');
	});

	// Inputs where the bug was: national formatter returned unchanged, no spaces
	it("'201' — should format '20 1' (was '201')", () => {
		expect(parse('201', 'HU').formattedNumber).toBe('20 1');
	});

	it("'2012' — should format '20 12' (was '2012')", () => {
		expect(parse('2012', 'HU').formattedNumber).toBe('20 12');
	});

	it("'20123' — should format '20 123' (was '20123')", () => {
		expect(parse('20123', 'HU').formattedNumber).toBe('20 123');
	});

	it("'201234' — should format '20 123 4' (was '201234')", () => {
		expect(parse('201234', 'HU').formattedNumber).toBe('20 123 4');
	});

	it("'2012345' — should format '20 123 45' (was '2012345')", () => {
		expect(parse('2012345', 'HU').formattedNumber).toBe('20 123 45');
	});

	// Inputs that already worked via the old formatInternational fallback
	it("'20123456' — 8 digits, '20 123 456'", () => {
		expect(parse('20123456', 'HU').formattedNumber).toBe('20 123 456');
	});

	it("'201234567' — complete number, '20 123 4567'", () => {
		expect(parse('201234567', 'HU').formattedNumber).toBe('20 123 4567');
	});

	// Regression: trunk-prefix inputs must be unaffected (national formatter
	// returns them with spaces, so formatted !== capped → synthesis never triggers)
	it("'0620' — trunk prefix, national formatter applies correctly", () => {
		expect(parse('0620', 'HU').formattedNumber).toBe('06 20');
	});

	it("'06201234567' — full trunk-prefix number unaffected", () => {
		expect(parse('06201234567', 'HU').formattedNumber).toBe('06 20 123 4567');
	});
});
