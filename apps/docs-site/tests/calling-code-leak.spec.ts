import { expect, test, type Page } from '@playwright/test';

async function clearTelInput(input: ReturnType<Page['getByTestId']>) {
	await input.click();
	await input.press('Control+A');
	await input.press('Backspace');
}

async function selectCountry(page: Page, country: string) {
	const countryButton = page.locator('#states-button');
	await expect(countryButton).toBeEnabled();
	await countryButton.click();
	await page.locator(`#dropdown-countries button[value="${country}"]`).click();
}

// Regression for the NANP / single-digit dial-code bug: in a US field, typing
// "1", "1", "1" appeared stuck on a single "1" because libphonenumber consumed
// the leading digit (equal to the country calling code) as the code itself.
// Every typed digit must survive in the displayed value.
test.describe('Calling-code leak — repeated leading digits', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/playground');
		await expect(page.locator('#states-button')).toBeEnabled();
		await expect(page.getByTestId('tel-input')).toBeVisible();
	});

	test('US: typing 1, 1, 1 key-by-key keeps every digit', async ({ page }) => {
		await selectCountry(page, 'US');
		const input = page.getByTestId('tel-input');
		await clearTelInput(input);

		await input.press('1');
		await expect(input).toHaveValue('1');
		await input.press('1');
		await expect(input).toHaveValue('11');
		await input.press('1');
		await expect(input).toHaveValue('111');
	});

	test('US: prepopulated number → clear → retype 1, 1, 1', async ({ page }) => {
		await selectCountry(page, 'US');
		const input = page.getByTestId('tel-input');
		await clearTelInput(input);

		await input.pressSequentially('+12154567890', { delay: 30 });
		await expect(input).toHaveValue('+1 215 456 7890');

		await clearTelInput(input);
		await expect(input).toHaveValue('');

		await input.press('1');
		await expect(input).toHaveValue('1');
		await input.press('1');
		await expect(input).toHaveValue('11');
		await input.press('1');
		await expect(input).toHaveValue('111');
	});

	test('RU (+7): typing 7, 7, 7 key-by-key keeps every digit', async ({ page }) => {
		await selectCountry(page, 'RU');
		const input = page.getByTestId('tel-input');
		await clearTelInput(input);

		await input.pressSequentially('777', { delay: 30 });
		// Display may add formatting spaces, but no digit may be dropped.
		expect((await input.inputValue()).replace(/\D/g, '')).toBe('777');
	});
});
