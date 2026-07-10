import { describe, it, expect } from 'vitest';
import { parse } from '../lib/utils/index.js';

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
