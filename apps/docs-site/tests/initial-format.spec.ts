import { expect, test } from '@playwright/test';

/**
 * E2E tests for the `initialFormat` prop.
 *
 * The playground options bar (including the "Initial format" select) is only
 * visible on the Validation / Events / API tabs.  The value-display hidden
 * span lives inside the api-test-panel that renders on Validation and API tabs.
 */

async function openValidationTab(page: import('@playwright/test').Page) {
	await page.getByRole('tab', { name: 'Validation' }).click();
	await expect(page.locator('select[id^="initialFormat-"]')).toBeVisible();
}

async function setInitialFormat(
	page: import('@playwright/test').Page,
	format: 'international' | 'national'
) {
	await page.locator('select[id^="initialFormat-"]').selectOption(format);
	// Changing the format remounts the component (inputKey changes);
	// wait for the input to be visible again before asserting values.
	await expect(page.getByTestId('tel-input')).toBeVisible();
}

async function clickPreset(page: import('@playwright/test').Page, label: string) {
	await page.getByRole('button', { name: label, exact: true }).click();
}

test.describe('initialFormat option in playground', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/playground');
		await expect(page.locator('#states-button')).toBeEnabled({ timeout: 15_000 });
		await expect(page.getByTestId('tel-input')).toBeVisible();
		await openValidationTab(page);
	});

	// ── default behaviour ────────────────────────────────────────────────────

	test('defaults to international format (dial code visible in input)', async ({ page }) => {
		// The playground starts with +14155552671; international = +1 415 555 2671
		const input = page.getByTestId('tel-input');
		await expect(input).toHaveValue(/^\+1/);
	});

	test('international option keeps dial code prefix after explicit selection', async ({
		page
	}) => {
		await setInitialFormat(page, 'international');
		await expect(page.getByTestId('tel-input')).toHaveValue(/^\+1/);
	});

	// ── national format ──────────────────────────────────────────────────────

	test('national format strips the dial code from the displayed value', async ({ page }) => {
		await setInitialFormat(page, 'national');
		const input = page.getByTestId('tel-input');
		// Must not start with "+" — only the national part should appear.
		const value = await input.inputValue();
		expect(value).not.toMatch(/^\+/);
		expect(value.length).toBeGreaterThan(0);
	});

	test('national format for US number shows digits without +1 prefix', async ({ page }) => {
		// Use the US preset (+12015551234 → national "201 555 1234")
		await clickPreset(page, '🇺🇸 US');
		await setInitialFormat(page, 'national');
		const input = page.getByTestId('tel-input');
		await expect(input).toHaveValue('201 555 1234');
	});

	test('national format for UK number shows digits without +44 prefix', async ({ page }) => {
		await clickPreset(page, '🇬🇧 UK');
		await setInitialFormat(page, 'national');
		const input = page.getByTestId('tel-input');
		// +441234567890 → strip "+44 " → "1234 567890"
		await expect(input).toHaveValue('1234 567890');
	});

	test('national format for DE number shows national digits', async ({ page }) => {
		await clickPreset(page, '🇩🇪 DE');
		await setInitialFormat(page, 'national');
		const input = page.getByTestId('tel-input');
		// +4915123456789 → strip "+49 " → "1512 3456789"
		const value = await input.inputValue();
		expect(value).not.toMatch(/^\+/);
		expect(value.length).toBeGreaterThan(0);
	});

	// ── E164 value unchanged ─────────────────────────────────────────────────

	test('underlying E164 value is unchanged when national format is active', async ({ page }) => {
		await clickPreset(page, '🇺🇸 US');
		// Confirm international before switching
		await expect(page.getByTestId('tel-input')).toHaveValue(/^\+1/);

		await setInitialFormat(page, 'national');

		// The hidden value-display inside the output panel reflects the E164 value
		const valueDisplay = page.getByTestId('api-test-panel').getByTestId('value-display');
		await expect(valueDisplay).toHaveText('+12015551234');
	});

	// ── switching back ────────────────────────────────────────────────────────

	test('switching back to international restores dial code in input', async ({ page }) => {
		await clickPreset(page, '🇺🇸 US');
		await setInitialFormat(page, 'national');
		await expect(page.getByTestId('tel-input')).toHaveValue('201 555 1234');

		await setInitialFormat(page, 'international');
		await expect(page.getByTestId('tel-input')).toHaveValue('+1 201 555 1234');
	});

	// ── typing after national init ────────────────────────────────────────────

	test('user can clear and retype a new number after national init', async ({ page }) => {
		await clickPreset(page, '🇺🇸 US');
		await setInitialFormat(page, 'national');

		const input = page.getByTestId('tel-input');
		await expect(input).toHaveValue('201 555 1234');

		// Clear and type a different US national number
		await input.click();
		await input.press('Control+A');
		await input.press('Backspace');
		await input.pressSequentially('2154567890', { delay: 30 });

		await expect(input).toHaveValue('215 456 7890');
		// E164 value should update normally
		const valueDisplay = page.getByTestId('api-test-panel').getByTestId('value-display');
		await expect(valueDisplay).toHaveText('+12154567890');
	});

	// ── spaces=false + national ───────────────────────────────────────────────

	test('national format respects spaces=false option', async ({ page }) => {
		await clickPreset(page, '🇺🇸 US');

		// Turn off spaces
		await page.evaluate(() => {
			const el = document.querySelector('input[id^="spaces-"]') as HTMLInputElement | null;
			if (!el) throw new Error('Spaces checkbox not found');
			if (el.checked) el.click();
		});
		await expect(page.getByRole('checkbox', { name: 'Spaces' })).not.toBeChecked();

		await setInitialFormat(page, 'national');

		const input = page.getByTestId('tel-input');
		const value = await input.inputValue();
		// No spaces, no "+" prefix
		expect(value).not.toContain(' ');
		expect(value).not.toMatch(/^\+/);
		expect(value.length).toBeGreaterThan(0);
	});
});
