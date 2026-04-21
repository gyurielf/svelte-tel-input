import { expect, test } from '@playwright/test';

/**
 * E2E tests for national partial-number formatting consistency.
 *
 * Reproduces the bug where typing a national number without a `+` prefix
 * (with country pre-selected) produced no spaces until ~8 digits, while
 * typing the same number with `+36` produced spaces from the first digit.
 *
 * After the fix, both input paths should produce identical national-digit
 * spacing at every digit count.
 */

async function selectCountry(page: import('@playwright/test').Page, country: string) {
	const countryButton = page.locator('#states-button');
	await expect(countryButton).toBeEnabled();
	await countryButton.click();
	await page.locator(`#dropdown-countries button[value="${country}"]`).click();
}

async function clearTelInput(input: ReturnType<import('@playwright/test').Page['getByTestId']>) {
	await input.click();
	await input.press('Control+A');
	await input.press('Backspace');
}

test.describe('National partial-number formatting consistency (HU)', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/playground');
		await expect(page.locator('#states-button')).toBeEnabled({ timeout: 15_000 });
		await expect(page.getByTestId('tel-input')).toBeVisible();
	});

	test('typing national digits produces spaces from the 3rd digit onward', async ({ page }) => {
		await selectCountry(page, 'HU');
		const input = page.getByTestId('tel-input');
		await clearTelInput(input);

		// Digit-by-digit assertions — mirrors the user-reported inconsistency
		const steps: [string, string][] = [
			['2', '2'],
			['0', '20'],
			['1', '20 1'],
			['2', '20 12'],
			['3', '20 123'],
			['4', '20 123 4'],
			['5', '20 123 45'],
			['6', '20 123 456'],
			['7', '20 123 4567']
		];

		for (const [digit, expected] of steps) {
			await input.press(digit);
			await expect(input).toHaveValue(expected);
		}
	});

	test('typing with +36 prefix produces same national spacing', async ({ page }) => {
		await selectCountry(page, 'HU');
		const input = page.getByTestId('tel-input');
		await clearTelInput(input);

		// Type "+36" first, then the national digits one by one
		await input.pressSequentially('+36', { delay: 50 });
		await expect(input).toHaveValue('+36');

		const steps: [string, string][] = [
			['2', '+36 2'],
			['0', '+36 20'],
			['1', '+36 20 1'],
			['2', '+36 20 12'],
			['3', '+36 20 123'],
			['4', '+36 20 123 4'],
			['5', '+36 20 123 45'],
			['6', '+36 20 123 456'],
			['7', '+36 20 123 4567']
		];

		for (const [digit, expected] of steps) {
			await input.press(digit);
			await expect(input).toHaveValue(expected);
		}
	});

	test('national and +36-prefix spacing match at every step', async ({ page }) => {
		// Collect national formatting
		await selectCountry(page, 'HU');
		const input = page.getByTestId('tel-input');
		await clearTelInput(input);

		const nationalValues: string[] = [];
		for (const digit of ['2', '0', '1', '2', '3', '4', '5', '6', '7']) {
			await input.press(digit);
			nationalValues.push(await input.inputValue());
		}

		// Collect international-prefix formatting (strip "+36 " to compare)
		await clearTelInput(input);
		await input.pressSequentially('+362', { delay: 50 });
		const intlValues: string[] = [await input.inputValue()];

		for (const digit of ['0', '1', '2', '3', '4', '5', '6', '7']) {
			await input.press(digit);
			intlValues.push(await input.inputValue());
		}

		// Strip the dial code prefix "+36 " so that "+36 20 1" → "20 1" for comparison
		const stripped = intlValues.map((v) => v.replace(/^\+36 ?/, ''));

		expect(nationalValues).toEqual(stripped);
	});
});
