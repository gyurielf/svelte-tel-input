import { expect, test } from '@playwright/test';

const BIND_VALUE = '+12014560001';

test.describe('API & Binding playground', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/playground');
		// Wait for the Svelte component to be fully hydrated before clicking any tab
		await expect(page.locator('#states-button')).toBeEnabled({ timeout: 15000 });
		await expect(page.getByTestId('tel-input')).toBeVisible();
		// Switch to the API tab to reveal action buttons
		await page.getByRole('tab', { name: 'API' }).click();
		await expect(page.getByTestId('bind-set-value-btn')).toBeVisible();
	});

	// ── bind:value ─────────────────────────────────────────────────────────────

	test('bind:value - sets input and value-display', async ({ page }) => {
		await page.getByTestId('bind-set-value-btn').click();
		// The E164 value is reflected in the display
		await expect(page.getByTestId('value-display')).toHaveText(BIND_VALUE);
		// The input shows the formatted number (contains the national part "201")
		await expect(page.getByTestId('tel-input')).toHaveValue(/201/);
	});

	test('bind:value "" - clears input and value-display', async ({ page }) => {
		// First set a value, then clear it
		await page.getByTestId('bind-set-value-btn').click();
		await expect(page.getByTestId('value-display')).toHaveText(BIND_VALUE);

		await page.getByTestId('bind-clear-btn').click();
		await expect(page.getByTestId('value-display')).toHaveText('');
		await expect(page.getByTestId('tel-input')).toHaveValue('');
	});

	test('bind:value invalid - marks input as invalid', async ({ page }) => {
		await page.getByTestId('bind-set-invalid-btn').click();
		await expect(page.getByTestId('valid-display')).toHaveText('false');
	});

	// ── bind:country ───────────────────────────────────────────────────────────

	test('bind:country - updates country selector and country-display', async ({ page }) => {
		await page.getByTestId('bind-set-country-btn').click();
		await expect(page.getByTestId('country-display')).toHaveText('DE');
		await expect(page.locator('#states-button .flag-de')).toHaveCount(1);
	});

	// ── api.reset ─────────────────────────────────────────────────────────────

	test('api.reset() - clears input, value-display and country', async ({ page }) => {
		await page.getByTestId('bind-set-value-btn').click();
		await expect(page.getByTestId('tel-input')).toHaveValue(/201/);

		await page.getByTestId('api-reset-btn').click();
		await expect(page.getByTestId('tel-input')).toHaveValue('');
		await expect(page.getByTestId('value-display')).toHaveText('');
		await expect(page.getByTestId('country-display')).toHaveText('');
	});

	test('api.reset() - restores defaultCountry when configured', async ({ page }) => {
		await page.getByTestId('default-country-select').selectOption('HU');
		await page.getByTestId('bind-set-value-btn').click();
		await expect(page.getByTestId('country-display')).toHaveText('US');

		await page.getByTestId('api-reset-btn').click();
		await expect(page.getByTestId('tel-input')).toHaveValue('');
		await expect(page.getByTestId('value-display')).toHaveText('');
		await expect(page.getByTestId('country-display')).toHaveText('HU');
	});

	test('api.reset({ country: true }) - clears country even when defaultCountry is set', async ({
		page
	}) => {
		await page.getByTestId('default-country-select').selectOption('HU');
		await page.getByTestId('bind-set-value-btn').click();
		await expect(page.getByTestId('country-display')).toHaveText('US');

		await page.getByTestId('api-reset-clear-country-btn').click();
		await expect(page.getByTestId('tel-input')).toHaveValue('');
		await expect(page.getByTestId('value-display')).toHaveText('');
		await expect(page.getByTestId('country-display')).toHaveText('');
	});

	// ── api.checkValidity ──────────────────────────────────────────────────────

	test('api.checkValidity() - returns true for valid number', async ({ page }) => {
		await page.getByTestId('bind-set-value-btn').click();
		await page.getByTestId('api-check-validity-btn').click();
		await expect(page.getByTestId('check-validity-result')).toHaveText('true');
	});

	test('api.checkValidity() - returns false for invalid number', async ({ page }) => {
		await page.getByTestId('bind-set-invalid-btn').click();
		await page.getByTestId('api-check-validity-btn').click();
		await expect(page.getByTestId('check-validity-result')).toHaveText('false');
	});

	test('api.checkValidity() - returns true for initial valid number', async ({ page }) => {
		// Initial state has a valid number; checkValidity() should return true
		await page.getByTestId('api-check-validity-btn').click();
		await expect(page.getByTestId('check-validity-result')).toHaveText('true');
	});

	// ── valid display reflects state ───────────────────────────────────────────

	test('valid-display reflects validity lifecycle', async ({ page }) => {
		await expect(page.getByTestId('valid-display')).toHaveText('true');

		await page.getByTestId('bind-set-invalid-btn').click();
		await expect(page.getByTestId('valid-display')).toHaveText('false');

		await page.getByTestId('bind-set-value-btn').click();
		await expect(page.getByTestId('valid-display')).toHaveText('true');
	});

	// ── bind:country clears value even after a second round-trip ──────────────

	// Regression: after set-value → set-country(DE) → set-value, a second
	// set-country(DE) was a no-op because prevCountry was stale ('DE') and the
	// country-change handler thought nothing had changed.
	test('bind:country - clears value when country set again after second set-value', async ({
		page
	}) => {
		// Round 1 — set US value, then switch to DE (value should clear)
		await page.getByTestId('bind-set-value-btn').click();
		await expect(page.getByTestId('value-display')).toHaveText(BIND_VALUE);

		await page.getByTestId('bind-set-country-btn').click();
		await expect(page.getByTestId('country-display')).toHaveText('DE');
		await expect(page.getByTestId('value-display')).toHaveText('');
		await expect(page.getByTestId('tel-input')).toHaveValue('');

		// Round 2 — set US value again (auto-switches country back to US)
		await page.getByTestId('bind-set-value-btn').click();
		await expect(page.getByTestId('value-display')).toHaveText(BIND_VALUE);
		await expect(page.getByTestId('country-display')).toHaveText('US');

		// Switch to DE a second time — value MUST be cleared
		await page.getByTestId('bind-set-country-btn').click();
		await expect(page.getByTestId('country-display')).toHaveText('DE');
		await expect(page.getByTestId('value-display')).toHaveText('');
		await expect(page.getByTestId('tel-input')).toHaveValue('');
	});
});
