import { expect, test } from '@playwright/test';

function panel(page: import('@playwright/test').Page) {
	return page.getByTestId('api-test-panel');
}

async function enableRequiredInValidation(page: import('@playwright/test').Page) {
	await page.getByRole('tab', { name: 'Validation' }).click();
	await page.locator('label:has(input[id^="required-"])').click();
	await page.getByRole('tab', { name: 'API' }).click();
	await expect(page.getByTestId('bind-set-value-btn')).toBeVisible();
}

test.describe('validationError binding', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/playground');
		await expect(page.locator('#states-button')).toBeEnabled({ timeout: 15000 });
		await expect(page.getByTestId('tel-input')).toBeVisible();
		await page.getByRole('tab', { name: 'API' }).click();
		await expect(page.getByTestId('bind-set-value-btn')).toBeVisible();
	});

	test('shows empty validationError when input is valid', async ({ page }) => {
		await page.getByTestId('bind-set-value-btn').click();
		await expect(panel(page).getByTestId('valid-display')).toHaveText('true');
		await expect(panel(page).getByTestId('validation-error-display')).toHaveText('');
	});

	test('shows "TOO_SHORT" when an incomplete number is set externally', async ({ page }) => {
		await page.getByTestId('bind-set-invalid-btn').click();
		await expect(panel(page).getByTestId('valid-display')).toHaveText('false');
		await expect(panel(page).getByTestId('validation-error-display')).toHaveText('TOO_SHORT');
	});

	test('shows "required" when field is empty and required is true', async ({ page }) => {
		await enableRequiredInValidation(page);
		// Set a valid value then clear it.
		await page.getByTestId('bind-set-value-btn').click();
		await page.getByTestId('bind-clear-btn').click();
		// Clearing via binding triggers validation automatically.
		await expect(panel(page).getByTestId('valid-display')).toHaveText('false');
		await expect(panel(page).getByTestId('validation-error-display')).toHaveText('REQUIRED');
	});

	test('clears validationError when valid value is restored', async ({ page }) => {
		await page.getByTestId('bind-set-invalid-btn').click();
		await expect(panel(page).getByTestId('validation-error-display')).toHaveText('TOO_SHORT');

		await page.getByTestId('bind-set-value-btn').click();
		await expect(panel(page).getByTestId('validation-error-display')).toHaveText('');
	});
});

test.describe('api.checkValidity() returns { valid, error }', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/playground');
		await expect(page.locator('#states-button')).toBeEnabled({ timeout: 15000 });
		await page.getByRole('tab', { name: 'API' }).click();
		await expect(page.getByTestId('bind-set-value-btn')).toBeVisible();
	});

	test('returns { valid: true, error: null } for a valid number', async ({ page }) => {
		await page.getByTestId('bind-set-value-btn').click();
		await page.getByTestId('api-check-validity-btn').click();
		await expect(panel(page).getByTestId('check-validity-result')).toHaveText('true');
		await expect(panel(page).getByTestId('check-validity-error-result')).toHaveText('');
	});

	test('returns { valid: false, error: "TOO_SHORT" } for an incomplete number', async ({
		page
	}) => {
		await page.getByTestId('bind-set-invalid-btn').click();
		await page.getByTestId('api-check-validity-btn').click();
		await expect(panel(page).getByTestId('check-validity-result')).toHaveText('false');
		await expect(panel(page).getByTestId('check-validity-error-result')).toHaveText(
			'TOO_SHORT'
		);
	});

	test('returns { valid: false, error: "required" } for empty field when required', async ({
		page
	}) => {
		await enableRequiredInValidation(page);
		// Start with valid, then clear
		await page.getByTestId('bind-set-value-btn').click();
		await page.getByTestId('bind-clear-btn').click();
		await page.getByTestId('api-check-validity-btn').click();
		await expect(panel(page).getByTestId('check-validity-result')).toHaveText('false');
		await expect(panel(page).getByTestId('check-validity-error-result')).toHaveText('REQUIRED');
	});
});

test.describe('allowedCountries option', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/playground');
		await expect(page.locator('#states-button')).toBeEnabled({ timeout: 15000 });
		await expect(page.getByTestId('tel-input')).toBeVisible();
		await page.getByRole('tab', { name: 'Validation' }).click();
		await expect(page.getByTestId('set-allowed-us-hu-btn')).toBeVisible();
	});

	test('allows any valid number when allowedCountries is not set', async ({ page }) => {
		const input = page.getByTestId('tel-input');
		await input.click();
		await input.press('Control+A');
		await input.press('Backspace');
		await input.pressSequentially('+12014560001', { delay: 50 });

		await expect(panel(page).getByTestId('valid-display')).toHaveText('true');
		await expect(panel(page).getByTestId('validation-error-display')).toHaveText('');
	});

	test('marks US number as country_not_allowed when only HU is allowed', async ({ page }) => {
		// Restrict to US and HU, then set a GB number to trigger country_not_allowed
		await page.getByTestId('set-allowed-us-hu-btn').click();

		// Type a GB number directly
		const input = page.getByTestId('tel-input');
		await input.click();
		await input.press('Control+A');
		await input.press('Backspace');
		await input.pressSequentially('+447947123456', { delay: 50 });

		// GB is not in [US, HU], so should be invalid
		await expect(panel(page).getByTestId('valid-display')).toHaveText('false');
		await expect(panel(page).getByTestId('validation-error-display')).toHaveText(
			'COUNTRY_NOT_ALLOWED'
		);
	});

	test('allows HU number when HU is in allowedCountries', async ({ page }) => {
		await page.getByTestId('set-allowed-us-hu-btn').click();

		const input = page.getByTestId('tel-input');
		await input.click();
		await input.press('Control+A');
		await input.press('Backspace');
		await input.pressSequentially('+36301234567', { delay: 50 });

		// HU is in [US, HU], number is valid
		await expect(panel(page).getByTestId('valid-display')).toHaveText('true');
		await expect(panel(page).getByTestId('validation-error-display')).toHaveText('');
	});

	test('restores validity when allowedCountries is cleared', async ({ page }) => {
		// Restrict, type a GB number (not allowed)
		await page.getByTestId('set-allowed-us-hu-btn').click();
		const input = page.getByTestId('tel-input');
		await input.click();
		await input.press('Control+A');
		await input.press('Backspace');
		await input.pressSequentially('+447947123456', { delay: 50 });
		await expect(panel(page).getByTestId('validation-error-display')).toHaveText(
			'COUNTRY_NOT_ALLOWED'
		);

		// Clear allowedCountries restriction
		await page.getByTestId('clear-allowed-btn').click();
		await expect(panel(page).getByTestId('valid-display')).toHaveText('true');
		await expect(panel(page).getByTestId('validation-error-display')).toHaveText('');
	});
});
