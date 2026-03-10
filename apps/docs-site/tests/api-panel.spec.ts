import { expect, test } from '@playwright/test';

// All selectors are scoped to the api-test-panel div to avoid conflicts with
// the Advanced Example above it (which also contains a tel-input and states-button).
const BIND_VALUE = '+12014560001';

function panel(page: import('@playwright/test').Page) {
	return page.getByTestId('api-test-panel');
}

test.describe('API & Binding playground', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		// Wait for the panel's country dropdown to be hydrated and enabled.
		await expect(page.locator('#states-button')).toBeEnabled({ timeout: 15_000 });
		await expect(page.getByTestId('tel-input')).toBeVisible();
	});

	// ── bind:value ─────────────────────────────────────────────────────────────

	test('bind:value – sets input and value-display', async ({ page }) => {
		await page.getByTestId('bind-set-value-btn').click();
		// The E164 value is reflected in the display
		await expect(panel(page).getByTestId('value-display')).toHaveText(BIND_VALUE);
		// The input shows the formatted number (contains the national part "201")
		await expect(page.getByTestId('tel-input')).toHaveValue(/201/);
	});

	test('bind:value "" – clears input and value-display', async ({ page }) => {
		// First set a value, then clear it
		await page.getByTestId('bind-set-value-btn').click();
		await expect(panel(page).getByTestId('value-display')).toHaveText(BIND_VALUE);

		await page.getByTestId('bind-clear-btn').click();
		await expect(panel(page).getByTestId('value-display')).toHaveText('');
		await expect(page.getByTestId('tel-input')).toHaveValue('');
	});

	test('bind:value invalid – marks input as invalid', async ({ page }) => {
		await page.getByTestId('bind-set-invalid-btn').click();
		await expect(panel(page).getByTestId('valid-display')).toHaveText('false');
	});

	// ── bind:country ───────────────────────────────────────────────────────────

	test('bind:country – updates country selector and country-display', async ({ page }) => {
		await page.getByTestId('bind-set-country-btn').click();
		await expect(panel(page).getByTestId('country-display')).toHaveText('DE');
		await expect(page.locator('#states-button .flag-de')).toHaveCount(1);
	});

	// ── api.reset ─────────────────────────────────────────────────────────────

	test('api.reset() – clears input, value-display and country', async ({ page }) => {
		await page.getByTestId('bind-set-value-btn').click();
		await expect(page.getByTestId('tel-input')).toHaveValue(/201/);

		await page.getByTestId('api-reset-btn').click();
		await expect(page.getByTestId('tel-input')).toHaveValue('');
		await expect(panel(page).getByTestId('value-display')).toHaveText('');
		await expect(panel(page).getByTestId('country-display')).toHaveText('');
	});

	// ── api.checkValidity ──────────────────────────────────────────────────────

	test('api.checkValidity() – returns true for valid number', async ({ page }) => {
		await page.getByTestId('bind-set-value-btn').click();
		await page.getByTestId('api-check-validity-btn').click();
		await expect(panel(page).getByTestId('check-validity-result')).toHaveText('true');
	});

	test('api.checkValidity() – returns false for invalid number', async ({ page }) => {
		await page.getByTestId('bind-set-invalid-btn').click();
		await page.getByTestId('api-check-validity-btn').click();
		await expect(panel(page).getByTestId('check-validity-result')).toHaveText('false');
	});

	test('api.checkValidity() – returns true for initial valid number', async ({ page }) => {
		// Initial state has a valid number; checkValidity() should return true
		await page.getByTestId('api-check-validity-btn').click();
		await expect(panel(page).getByTestId('check-validity-result')).toHaveText('true');
	});

	// ── valid display reflects state ───────────────────────────────────────────

	test('valid-display reflects validity lifecycle', async ({ page }) => {
		await expect(panel(page).getByTestId('valid-display')).toHaveText('true');

		await page.getByTestId('bind-set-invalid-btn').click();
		await expect(panel(page).getByTestId('valid-display')).toHaveText('false');

		await page.getByTestId('bind-set-value-btn').click();
		await expect(panel(page).getByTestId('valid-display')).toHaveText('true');
	});
});
