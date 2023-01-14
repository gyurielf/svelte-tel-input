import { inputParser, inspectAllowedChars } from '$lib/utils/helpers';
import { describe, it, expect } from 'vitest';

describe('Hello.svelte', () => {
	it('Input should be eleminate leters and special chars, and resul should be trimmed.', () => {
		const testValue = '+36 30 1aS 34 .9 ';
		const resut = inputParser(testValue, {
			allowSpaces: true,
			parseCharacter: inspectAllowedChars
		});
		expect(resut).toStrictEqual('+36 30 1 34 9 ');
	});

	it('Input should be eleminate leters and special chars, and resul should be untrimmed.', () => {
		const testValue = '+36 30 1aS 34 .9 ';
		const resut = inputParser(testValue, {
			allowSpaces: true,
			parseCharacter: inspectAllowedChars
		});
		expect(resut).toStrictEqual('+36 30 1 34 9 ');
	});

	it('Trimmed input with spaces', () => {
		const testValue = '+36 30 1a3 45 67';
		const resut = inputParser(testValue, {
			allowSpaces: true,
			parseCharacter: inspectAllowedChars
		});
		expect(resut).toStrictEqual('+36 30 13 45 67');
	});

	it('Perfect input without spaces', () => {
		const testValue = '+36a301234567';
		const resut = inputParser(testValue, {
			allowSpaces: false,
			parseCharacter: inspectAllowedChars
		});
		expect(resut).toStrictEqual('+36301234567');
	});
});
