import { describe, it, expect } from 'vitest';
import { calculateCursorPosition, isDigit } from '$lib/utils/directives/cursorPosition';

describe('Cursor Position Utilities', () => {
	describe('isDigit', () => {
		it('should identify digits correctly', () => {
			expect(isDigit('0')).toBe(true);
			expect(isDigit('5')).toBe(true);
			expect(isDigit('9')).toBe(true);
		});

		it('should reject non-digits', () => {
			expect(isDigit('a')).toBe(false);
			expect(isDigit(' ')).toBe(false);
			expect(isDigit('+')).toBe(false);
			expect(isDigit('-')).toBe(false);
			expect(isDigit(undefined)).toBe(false);
		});
	});

	describe('calculateCursorPosition', () => {
		describe('Basic Insertion', () => {
			it('should position cursor after typing first digit', () => {
				const result = calculateCursorPosition({
					beforeValue: '',
					beforeCursor: 0,
					beforeSelection: 0,
					afterValue: '+3',
					currentCursor: 2,
					isDeletion: false,
					deletionDirection: null,
					hasSelection: false
				});
				expect(result).toBe(2);
			});

			it('should position cursor after space when formatting adds space', () => {
				const result = calculateCursorPosition({
					beforeValue: '+36',
					beforeCursor: 3,
					beforeSelection: 0,
					afterValue: '+36 3',
					currentCursor: 5,
					isDeletion: false,
					deletionDirection: null,
					hasSelection: false
				});
				expect(result).toBe(5);
			});

			it('should handle continuous digit typing', () => {
				const result = calculateCursorPosition({
					beforeValue: '+36 30',
					beforeCursor: 6,
					beforeSelection: 0,
					afterValue: '+36 30 1',
					currentCursor: 8,
					isDeletion: false,
					deletionDirection: null,
					hasSelection: false
				});
				expect(result).toBe(8);
			});

			it('should position cursor correctly when space is added by formatter', () => {
				const result = calculateCursorPosition({
					beforeValue: '+36 30 12',
					beforeCursor: 9,
					beforeSelection: 0,
					afterValue: '+36 30 123',
					currentCursor: 10,
					isDeletion: false,
					deletionDirection: null,
					hasSelection: false
				});
				expect(result).toBe(10);
			});
		});

		describe('Backspace (Backward Deletion)', () => {
			it('should handle backspace at end of input', () => {
				const result = calculateCursorPosition({
					beforeValue: '+36 30 123',
					beforeCursor: 10,
					beforeSelection: 0,
					afterValue: '+36 30 12',
					currentCursor: 9,
					isDeletion: true,
					deletionDirection: 'backward',
					hasSelection: false
				});
				expect(result).toBe(9);
			});

			it('should handle backspace in middle of input', () => {
				// Before: "+36 30| 123" -> After: "+36 3| 123"
				const result = calculateCursorPosition({
					beforeValue: '+36 30 123',
					beforeCursor: 6,
					beforeSelection: 0,
					afterValue: '+36 3 123',
					currentCursor: 5,
					isDeletion: true,
					deletionDirection: 'backward',
					hasSelection: false
				});
				expect(result).toBe(6);
			});

			it('should handle backspace across space boundary', () => {
				// Before: "+36 |30 123" -> After: "+36| 30 123"
				const result = calculateCursorPosition({
					beforeValue: '+36 30 123',
					beforeCursor: 4,
					beforeSelection: 0,
					afterValue: '+36 30 123',
					currentCursor: 3,
					isDeletion: true,
					deletionDirection: 'backward',
					hasSelection: false
				});
				expect(result).toBe(2); // Position before space
			});

			it('should handle backspace that triggers reformatting', () => {
				// Before: "+36 30 1|23" -> After: "+36 30 |23"
				const result = calculateCursorPosition({
					beforeValue: '+36 30 123',
					beforeCursor: 8,
					beforeSelection: 0,
					afterValue: '+36 30 23',
					currentCursor: 7,
					isDeletion: true,
					deletionDirection: 'backward',
					hasSelection: false
				});
				expect(result).toBe(7); // Position before space
			});
		});

		describe('Delete (Forward Deletion)', () => {
			it('should handle delete from middle', () => {
				// Before: "+36 3|0 123" -> After: "+36 3| 123"
				const result = calculateCursorPosition({
					beforeValue: '+36 30 123',
					beforeCursor: 5,
					beforeSelection: 0,
					afterValue: '+36 3 123',
					currentCursor: 5,
					isDeletion: true,
					deletionDirection: 'forward',
					hasSelection: false
				});
				expect(result).toBe(6); // Stay after the digit
			});

			it('should handle delete at start of group', () => {
				// Before: "+36 |30 123" -> After: "+36 |0 123"
				const result = calculateCursorPosition({
					beforeValue: '+36 30 123',
					beforeCursor: 4,
					beforeSelection: 0,
					afterValue: '+36 0 123',
					currentCursor: 4,
					isDeletion: true,
					deletionDirection: 'forward',
					hasSelection: false
				});
				expect(result).toBe(4); // Stay at same position
			});
			it('should handle delete that removes space', () => {
				// Before: "+36 30 1|23" -> After: "+36 30 |23"
				const result = calculateCursorPosition({
					beforeValue: '+36 30 123',
					beforeCursor: 8,
					beforeSelection: 0,
					afterValue: '+36 30 23',
					currentCursor: 7,
					isDeletion: true,
					deletionDirection: 'forward',
					hasSelection: false
				});
				expect(result).toBe(8); // Position after space
			});
		});

		describe('Selection Deletion/Replacement', () => {
			it('should handle selection deletion', () => {
				// Before: "+36 [30 12]3" -> After: "+36 |3"
				const result = calculateCursorPosition({
					beforeValue: '+36 30 123',
					beforeCursor: 4,
					beforeSelection: 5, // "30 12" selected
					afterValue: '+36 3',
					currentCursor: 4,
					isDeletion: true,
					deletionDirection: 'backward',
					hasSelection: true
				});
				expect(result).toBe(4); // After deletion
			});

			it('should handle selection replacement with single digit', () => {
				// Before: "+36 [30 12]3" -> After: "+36 9|3"
				const result = calculateCursorPosition({
					beforeValue: '+36 30 123',
					beforeCursor: 4,
					beforeSelection: 5,
					afterValue: '+36 93',
					currentCursor: 6,
					isDeletion: false,
					deletionDirection: null,
					hasSelection: false
				});
				expect(result).toBe(6);
			});

			it('should handle selection replacement with multiple digits', () => {
				// Before: "+36 [30]" -> After: "+36 45|"
				const result = calculateCursorPosition({
					beforeValue: '+36 30',
					beforeCursor: 4,
					beforeSelection: 2,
					afterValue: '+36 45',
					currentCursor: 6,
					isDeletion: false,
					deletionDirection: null,
					hasSelection: false
				});
				expect(result).toBe(6);
			});

			it('should handle full number selection and replacement', () => {
				// Before: "[+36 30 123]" -> After: "+1|"
				const result = calculateCursorPosition({
					beforeValue: '+36 30 123',
					beforeCursor: 0,
					beforeSelection: 10,
					afterValue: '+1',
					currentCursor: 2,
					isDeletion: false,
					deletionDirection: null,
					hasSelection: false
				});
				expect(result).toBe(2);
			});
		});

		describe('Edge Cases', () => {
			it('should handle empty before value', () => {
				const result = calculateCursorPosition({
					beforeValue: '',
					beforeCursor: 0,
					beforeSelection: 0,
					afterValue: '+36',
					currentCursor: 3,
					isDeletion: false,
					deletionDirection: null,
					hasSelection: false
				});
				expect(result).toBe(3);
			});

			it('should handle empty after value', () => {
				const result = calculateCursorPosition({
					beforeValue: '+36',
					beforeCursor: 3,
					beforeSelection: 0,
					afterValue: '',
					currentCursor: 0,
					isDeletion: true,
					deletionDirection: 'backward',
					hasSelection: false
				});
				expect(result).toBe(0);
			});

			it('should handle cursor at position 0', () => {
				const result = calculateCursorPosition({
					beforeValue: '+36 30',
					beforeCursor: 0,
					beforeSelection: 0,
					afterValue: '1+36 30',
					currentCursor: 1,
					isDeletion: false,
					deletionDirection: null,
					hasSelection: false
				});
				expect(result).toBeGreaterThanOrEqual(0);
			});

			it('should handle only non-digit characters', () => {
				const result = calculateCursorPosition({
					beforeValue: '+',
					beforeCursor: 1,
					beforeSelection: 0,
					afterValue: '+',
					currentCursor: 1,
					isDeletion: false,
					deletionDirection: null,
					hasSelection: false
				});
				expect(result).toBe(1);
			});

			it('should handle multiple consecutive spaces', () => {
				const result = calculateCursorPosition({
					beforeValue: '+36  30',
					beforeCursor: 5,
					beforeSelection: 0,
					afterValue: '+36  301',
					currentCursor: 8,
					isDeletion: false,
					deletionDirection: null,
					hasSelection: false
				});
				expect(result).toBeGreaterThan(5);
			});
		});

		describe('Complex Scenarios', () => {
			it('should handle typing with auto-formatting', () => {
				// Simulate typing a full Hungarian number
				let value = '';
				let cursor = 0;

				// Type: 3
				const step1 = calculateCursorPosition({
					beforeValue: value,
					beforeCursor: cursor,
					beforeSelection: 0,
					afterValue: '+3',
					currentCursor: 2,
					isDeletion: false,
					deletionDirection: null,
					hasSelection: false
				});
				value = '+3';
				cursor = step1;
				expect(cursor).toBe(2);

				// Type: 6
				const step2 = calculateCursorPosition({
					beforeValue: value,
					beforeCursor: cursor,
					beforeSelection: 0,
					afterValue: '+36',
					currentCursor: 3,
					isDeletion: false,
					deletionDirection: null,
					hasSelection: false
				});
				value = '+36';
				cursor = step2;
				expect(cursor).toBe(3);

				// Type: 3 (space gets added)
				const step3 = calculateCursorPosition({
					beforeValue: value,
					beforeCursor: cursor,
					beforeSelection: 0,
					afterValue: '+36 3',
					currentCursor: 5,
					isDeletion: false,
					deletionDirection: null,
					hasSelection: false
				});
				value = '+36 3';
				cursor = step3;
				expect(cursor).toBe(5);
			});

			it('should handle backspace-delete-type sequence', () => {
				let value = '+36 30 123';
				let cursor = 10;

				// Backspace
				const step1 = calculateCursorPosition({
					beforeValue: value,
					beforeCursor: cursor,
					beforeSelection: 0,
					afterValue: '+36 30 12',
					currentCursor: 9,
					isDeletion: true,
					deletionDirection: 'backward',
					hasSelection: false
				});
				value = '+36 30 12';
				cursor = step1;
				expect(cursor).toBe(9);

				// Type 4
				const step2 = calculateCursorPosition({
					beforeValue: value,
					beforeCursor: cursor,
					beforeSelection: 0,
					afterValue: '+36 30 124',
					currentCursor: 10,
					isDeletion: false,
					deletionDirection: null,
					hasSelection: false
				});
				value = '+36 30 124';
				cursor = step2;
				expect(cursor).toBe(10);
			});

			it('should handle paste operation (multiple digits at once)', () => {
				const result = calculateCursorPosition({
					beforeValue: '+36 ',
					beforeCursor: 4,
					beforeSelection: 0,
					afterValue: '+36 301234567',
					currentCursor: 13,
					isDeletion: false,
					deletionDirection: null,
					hasSelection: false
				});
				expect(result).toBe(13);
			});
		});
	});
});
