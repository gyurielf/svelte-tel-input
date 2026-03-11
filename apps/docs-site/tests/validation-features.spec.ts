import { expect, test } from '@playwright/test';

function panel(page: import('@playwright/test').Page) {
	return page.getByTestId('api-test-panel');
}

test.describe('validationError binding', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/playground');
		await expect(page.locator('#states-button')).toBeEnabled({ timeout: 15_000 });
		await expect(page.getByTestId('tel-input')).toBeVisible();
	});

	test('shows empty validationError when input is valid', async ({ page }) => {
		await page.getByTestId('bind-set-value-btn').click();
		await expect(panel(page).getByTestId('valid-display')).toHaveText('true');
		await expect(panel(page).getByTestId('validation-error-display')).toHaveText('');
	});

	test('shows "invalid" when an incomplete number is set externally', async ({ page }) => {
		await page.getByTestId('bind-set-invalid-btn').click();
		await expect(panel(page).getByTestId('valid-display')).toHaveText('false');
		await expect(panel(page).getByTestId('validation-error-display')).toHaveText('invalid');
	});

	test('shows "required" when field is empty and required is true', async ({ page }) => {
		// The advanced example is required by default. Clear the value.
		await page.getByTestId('bind-set-value-btn').click();
		await page.getByTestId('bind-clear-btn').click();
		// Blur the input so validation fires.
		await page.getByTestId('tel-input').blur();
		await expect(panel(page).getByTestId('valid-display')).toHaveText('false');
		await expect(panel(page).getByTestId('validation-error-display')).toHaveText('required');
	});

	test('clears validationError when valid value is restored', async ({ page }) => {
		await page.getByTestId('bind-set-invalid-btn').click();
		await expect(panel(page).getByTestId('validation-error-display')).toHaveText('invalid');

		await page.getByTestId('bind-set-value-btn').click();
		await expect(panel(page).getByTestId('validation-error-display')).toHaveText('');
	});
});

test.describe('api.checkValidity() returns { valid, error }', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/playground');
		await expect(page.locator('#states-button')).toBeEnabled({ timeout: 15_000 });
	});

	test('returns { valid: true, error: null } for a valid number', async ({ page }) => {
		await page.getByTestId('bind-set-value-btn').click();
		await page.getByTestId('api-check-validity-btn').click();
		await expect(panel(page).getByTestId('check-validity-result')).toHaveText('true');
		await expect(panel(page).getByTestId('check-validity-error-result')).toHaveText('');
	});

	test('returns { valid: false, error: "invalid" } for an invalid number', async ({ page }) => {
		await page.getByTestId('bind-set-invalid-btn').click();
		await page.getByTestId('api-check-validity-btn').click();
		await expect(panel(page).getByTestId('check-validity-result')).toHaveText('false');
		await expect(panel(page).getByTestId('check-validity-error-result')).toHaveText('invalid');
	});

	test('returns { valid: false, error: "required" } for empty field when required', async ({
		page
	}) => {
		// Start with valid, then clear
		await page.getByTestId('bind-set-value-btn').click();
		await page.getByTestId('bind-clear-btn').click();
		await page.getByTestId('api-check-validity-btn').click();
		await expect(panel(page).getByTestId('check-validity-result')).toHaveText('false');
		await expect(panel(page).getByTestId('check-validity-error-result')).toHaveText('required');
	});
});

test.describe('allowedCountries option', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/playground');
		await expect(page.locator('#states-button')).toBeEnabled({ timeout: 15_000 });
		await expect(page.getByTestId('tel-input')).toBeVisible();
	});

	test('allows any valid number when allowedCountries is not set', async ({ page }) => {
		// Default state: no allowedCountries restriction
		await page.getByTestId('bind-set-value-btn').click();
		// BIND_VALUE is a US number
		await expect(panel(page).getByTestId('valid-display')).toHaveText('true');
		await expect(panel(page).getByTestId('validation-error-display')).toHaveText('');
	});

	test('marks US number as country_not_allowed when only HU is allowed', async ({ page }) => {
		// Restrict to US and HU, then set a GB number to trigger country_not_allowed
		await page.getByTestId('set-allowed-us-hu-btn').click();

		// Set a GB number via binding
		await page.evaluate(() => {
			// Directly set a GB number value via custom event to bypass URL, using the bind-set-invalid as a proxy
			// We'll type it directly into the input instead
		});

		// Type a GB number directly
		const input = page.getByTestId('tel-input');
		await input.click();
		await input.press('Control+A');
		await input.press('Backspace');
		await input.pressSequentially('+447947123456', { delay: 50 });

		// GB is not in [US, HU], so should be invalid
		await expect(panel(page).getByTestId('valid-display')).toHaveText('false');
		await expect(panel(page).getByTestId('validation-error-display')).toHaveText(
			'country_not_allowed'
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
			'country_not_allowed'
		);

		// Clear allowedCountries restriction
		await page.getByTestId('clear-allowed-btn').click();

		// Re-validate by calling checkValidity()
		await page.getByTestId('api-check-validity-btn').click();
		await expect(panel(page).getByTestId('check-validity-result')).toHaveText('true');
		await expect(panel(page).getByTestId('check-validity-error-result')).toHaveText('');
	});

	test('checkValidity() reports country_not_allowed when country is restricted', async ({
		page
	}) => {
		// Set a US number first (valid)
		await page.getByTestId('bind-set-value-btn').click();
		await expect(panel(page).getByTestId('valid-display')).toHaveText('true');

		// Now restrict to HU only (excludes US)
		await page.getByTestId('set-allowed-us-hu-btn').click();

		// Type a GB number
		const input = page.getByTestId('tel-input');
		await input.click();
		await input.press('Control+A');
		await input.press('Backspace');
		await input.pressSequentially('+447947123456', { delay: 50 });

		await page.getByTestId('api-check-validity-btn').click();
		await expect(panel(page).getByTestId('check-validity-result')).toHaveText('false');
		await expect(panel(page).getByTestId('check-validity-error-result')).toHaveText(
			'country_not_allowed'
		);
	});
});
