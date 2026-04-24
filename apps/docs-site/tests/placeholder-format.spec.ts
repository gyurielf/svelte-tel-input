import { expect, test } from '@playwright/test';

/**
 * E2E tests for the `placeholderFormat` prop.
 *
 * The options bar (including the "Placeholder format" select) is visible on all
 * tabs except "Usage". These tests use the Validation tab.
 *
 * Priority rules under test:
 *  - Neither provided            → international placeholder (default)
 *  - Only initialFormat          → initialFormat drives placeholder
 *  - Only placeholderFormat      → placeholderFormat drives placeholder
 *  - Both provided               → placeholderFormat wins
 */

async function openValidationTab(page: import('@playwright/test').Page) {
	await page.getByRole('tab', { name: 'Validation' }).click();
	await expect(page.locator('select[id^="placeholderFormat-"]')).toBeVisible();
}

async function setInitialFormat(
	page: import('@playwright/test').Page,
	format: 'international' | 'national'
) {
	await page.locator('select[id^="initialFormat-"]').selectOption(format);
	await expect(page.getByTestId('tel-input')).toBeVisible();
}

async function setPlaceholderFormat(
	page: import('@playwright/test').Page,
	format: 'auto' | 'international' | 'national'
) {
	await page.locator('select[id^="placeholderFormat-"]').selectOption(format);
	await expect(page.getByTestId('tel-input')).toBeVisible();
}

/** Clear the input so the placeholder is unobstructed. */
async function clearInput(page: import('@playwright/test').Page) {
	const input = page.getByTestId('tel-input');
	await input.click();
	await input.press('Control+A');
	await input.press('Backspace');
}

test.describe('placeholderFormat option in playground', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/playground');
		await expect(page.locator('#states-button')).toBeEnabled({ timeout: 15000 });
		await expect(page.getByTestId('tel-input')).toBeVisible();
		await openValidationTab(page);
	});

	// ── Scenario 1: default (neither prop set) → international ───────────────

	test('placeholder is international by default (neither prop provided)', async ({ page }) => {
		// Playground defaults: initialFormat=international, placeholderFormat=auto (undefined)
		const placeholder = await page.getByTestId('tel-input').getAttribute('placeholder');
		expect(placeholder).toBeTruthy();
		expect(placeholder).toMatch(/^\+/);
	});

	// ── Scenario 2: only initialFormat drives placeholder ────────────────────

	test('national placeholder when only initialFormat="national"', async ({ page }) => {
		await setInitialFormat(page, 'national');
		// placeholderFormat stays "auto" (undefined)
		const placeholder = await page.getByTestId('tel-input').getAttribute('placeholder');
		expect(placeholder).toBeTruthy();
		expect(placeholder).not.toMatch(/^\+/);
	});

	test('international placeholder when only initialFormat="international"', async ({ page }) => {
		await setInitialFormat(page, 'international');
		const placeholder = await page.getByTestId('tel-input').getAttribute('placeholder');
		expect(placeholder).toBeTruthy();
		expect(placeholder).toMatch(/^\+/);
	});

	// ── Scenario 3: only placeholderFormat drives placeholder ────────────────

	test('national placeholder when only placeholderFormat="national"', async ({ page }) => {
		// initialFormat stays "international" (default)
		await setPlaceholderFormat(page, 'national');
		const placeholder = await page.getByTestId('tel-input').getAttribute('placeholder');
		expect(placeholder).toBeTruthy();
		expect(placeholder).not.toMatch(/^\+/);
	});

	test('international placeholder when only placeholderFormat="international"', async ({
		page
	}) => {
		await setPlaceholderFormat(page, 'international');
		const placeholder = await page.getByTestId('tel-input').getAttribute('placeholder');
		expect(placeholder).toBeTruthy();
		expect(placeholder).toMatch(/^\+/);
	});

	// ── Scenario 4: both provided — placeholderFormat wins ───────────────────

	test('placeholderFormat="national" wins over initialFormat="international"', async ({
		page
	}) => {
		await setInitialFormat(page, 'international');
		await setPlaceholderFormat(page, 'national');
		const placeholder = await page.getByTestId('tel-input').getAttribute('placeholder');
		expect(placeholder).toBeTruthy();
		expect(placeholder).not.toMatch(/^\+/);
	});

	test('placeholderFormat="international" wins over initialFormat="national"', async ({
		page
	}) => {
		await setInitialFormat(page, 'national');
		await setPlaceholderFormat(page, 'international');
		const placeholder = await page.getByTestId('tel-input').getAttribute('placeholder');
		expect(placeholder).toBeTruthy();
		expect(placeholder).toMatch(/^\+/);
	});

	// ── Toggling back to "auto" restores initialFormat-driven behaviour ───────

	test('resetting placeholderFormat to "auto" falls back to initialFormat', async ({ page }) => {
		await setInitialFormat(page, 'national');
		await setPlaceholderFormat(page, 'national');
		// confirm national
		expect(await page.getByTestId('tel-input').getAttribute('placeholder')).not.toMatch(/^\+/);

		// Override with international
		await setPlaceholderFormat(page, 'international');
		expect(await page.getByTestId('tel-input').getAttribute('placeholder')).toMatch(/^\+/);

		// Reset to auto — should follow initialFormat ('national')
		await setPlaceholderFormat(page, 'auto');
		const placeholder = await page.getByTestId('tel-input').getAttribute('placeholder');
		expect(placeholder).toBeTruthy();
		expect(placeholder).not.toMatch(/^\+/);
	});

	// ── Placeholder is independent of the current input value ────────────────

	test('placeholder attribute is set even when the input has a value', async ({ page }) => {
		// Default playground state has a US value — placeholder still present
		const placeholder = await page.getByTestId('tel-input').getAttribute('placeholder');
		expect(placeholder).toBeTruthy();
	});

	test('placeholder changes to national after clearing and switching format', async ({
		page
	}) => {
		await setPlaceholderFormat(page, 'national');
		await clearInput(page);
		const placeholder = await page.getByTestId('tel-input').getAttribute('placeholder');
		expect(placeholder).toBeTruthy();
		expect(placeholder).not.toMatch(/^\+/);
	});

	// ── autoPlaceholder=false disables the placeholder regardless of format ──

	test('no placeholder when autoPlaceholder is disabled', async ({ page }) => {
		// The Auto-placeholder toggle uses a custom styled checkbox that is visually
		// hidden; use evaluate() to click the underlying input directly.
		await page.evaluate(() => {
			const el = document.querySelector(
				'input[id^="autoPlaceholder-"]'
			) as HTMLInputElement | null;
			if (!el) throw new Error('Auto-placeholder checkbox not found');
			if (el.checked) el.click();
		});
		await expect(page.getByRole('checkbox', { name: 'Auto-placeholder' })).not.toBeChecked();
		await expect(page.getByTestId('tel-input')).toBeVisible();
		await setPlaceholderFormat(page, 'national');
		const placeholder = await page.getByTestId('tel-input').getAttribute('placeholder');
		expect(placeholder).toBeNull();
	});
});
