import { expect, test } from '@playwright/test';

async function clearTelInput(input: ReturnType<import('@playwright/test').Page['getByTestId']>) {
	await input.click();
	await input.press('Control+A');
	await input.press('Backspace');
}

async function toggleRequiredCheckbox(page: import('@playwright/test').Page) {
	await page.evaluate(() => {
		const el = document.querySelector('input[id^="required-"]') as HTMLInputElement | null;
		if (!el) throw new Error('Required checkbox not found');
		el.click();
	});
}

async function openOptionsPanel(page: import('@playwright/test').Page) {
	const optionsButton = page.getByRole('button', { name: 'Options' });
	await optionsButton.click();
	await expect(page.getByRole('checkbox', { name: 'Spaces' })).toBeAttached();
}

test.describe('TelInput (demo)', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/playground');

		// Wait for the demo to initialize (country dropdown enabled) and for hydration to settle.
		await expect(page.locator('#states-button')).toBeEnabled();
		await expect(page.getByTestId('tel-input')).toBeVisible();
	});

	test('formats +12154567890 as +1 215-456-7890', async ({ page }) => {
		const input = page.getByTestId('tel-input');
		await clearTelInput(input);
		await input.pressSequentially('+12154567890', { delay: 50 });
		await expect(input).toHaveValue('+1 215-456-7890');
	});

	test('formats national US examples when US is selected', async ({ page }) => {
		// Wait until the country dropdown is initialized/enabled.
		const countryButton = page.locator('#states-button');
		await expect(countryButton).toBeEnabled();

		// Select US.
		await countryButton.click();
		await page.locator('#dropdown-countries button[value="US"]').click();

		const input = page.getByTestId('tel-input');
		await clearTelInput(input);

		await input.pressSequentially('12154567890', { delay: 50 });
		await expect(input).toHaveValue('1 (215) 456-7890');

		await clearTelInput(input);
		await input.pressSequentially('2154567890', { delay: 50 });
		await expect(input).toHaveValue('(215) 456-7890');
	});

	test('caps length at max valid length (NANP)', async ({ page }) => {
		const countryButton = page.locator('#states-button');
		await expect(countryButton).toBeEnabled();
		await countryButton.click();
		await page.locator('#dropdown-countries button[value="US"]').click();

		const input = page.getByTestId('tel-input');
		await clearTelInput(input);

		await input.pressSequentially('+12154567890', { delay: 50 });
		await expect(input).toHaveValue('+1 215-456-7890');

		// Extra digits should be ignored/capped.
		await input.pressSequentially('12', { delay: 50 });
		await expect(input).toHaveValue('+1 215-456-7890');
	});

	test('does not switch country on partial dial code during backspace (+3 should not become GR)', async ({
		page
	}) => {
		const countryButton = page.locator('#states-button');
		await expect(countryButton).toBeEnabled();

		// Start from a known selected country (US).
		await countryButton.click();
		await page.locator('#dropdown-countries button[value="US"]').click();

		const input = page.getByTestId('tel-input');
		await clearTelInput(input);

		// Type a HU number: should switch to HU once +36 is fully present.
		await input.pressSequentially('+36203135150', { delay: 50 });

		await expect(countryButton.locator('.flag-hu')).toHaveCount(1);

		// Backspace until the input is "+3".
		// We do this iteratively because formatting may add chars.
		for (let i = 0; i < 30; i++) {
			const current = await input.inputValue();
			if (current === '+3') break;
			await input.press('Backspace');
		}

		await expect(input).toHaveValue('+3');

		// Ensure it did not switch to Greece.
		await expect(countryButton.locator('.flag-gr')).toHaveCount(0);
		// And we keep the previously inferred country (HU) while dial code is incomplete.
		await expect(countryButton.locator('.flag-hu')).toHaveCount(1);
	});

	test('pasting formatted input normalizes + formats', async ({ page }) => {
		const input = page.getByTestId('tel-input');
		await clearTelInput(input);

		// Simulate a common paste payload.
		await input.fill('+1 (215) 456-7890');
		await expect(input).toHaveValue('+1 215-456-7890');
	});

	test('backspace skips formatting characters (caret moves, value unchanged)', async ({
		page
	}) => {
		const input = page.getByTestId('tel-input');
		await clearTelInput(input);
		await input.pressSequentially('+12154567890', { delay: 30 });
		await expect(input).toHaveValue('+1 215-456-7890');

		// Place caret just after the first hyphen ("+1 215-456-7890").
		const before = await page.evaluate(() => {
			const el = document.querySelector(
				'[data-testid="tel-input"]'
			) as HTMLInputElement | null;
			if (!el) throw new Error('tel input not found');
			const idx = el.value.indexOf('-');
			el.setSelectionRange(idx + 1, idx + 1);
			return { value: el.value, idx, selectionStart: el.selectionStart };
		});
		expect(before.selectionStart).toBe(before.idx + 1);

		await input.press('Backspace');

		const after = await page.evaluate(() => {
			const el = document.querySelector(
				'[data-testid="tel-input"]'
			) as HTMLInputElement | null;
			if (!el) throw new Error('tel input not found');
			return { value: el.value, selectionStart: el.selectionStart };
		});

		expect(after.value).toBe(before.value);
		// Caret should have moved left over the formatting character.
		expect(after.selectionStart).toBe(before.idx);
	});

	test('delete skips formatting characters (caret moves, value unchanged)', async ({ page }) => {
		const input = page.getByTestId('tel-input');
		await clearTelInput(input);
		await input.pressSequentially('+12154567890', { delay: 30 });
		await expect(input).toHaveValue('+1 215-456-7890');

		// Place caret just before the first hyphen.
		const before = await page.evaluate(() => {
			const el = document.querySelector(
				'[data-testid="tel-input"]'
			) as HTMLInputElement | null;
			if (!el) throw new Error('tel input not found');
			const idx = el.value.indexOf('-');
			el.setSelectionRange(idx, idx);
			return { value: el.value, idx, selectionStart: el.selectionStart };
		});
		expect(before.selectionStart).toBe(before.idx);

		await input.press('Delete');

		const after = await page.evaluate(() => {
			const el = document.querySelector(
				'[data-testid="tel-input"]'
			) as HTMLInputElement | null;
			if (!el) throw new Error('tel input not found');
			return { value: el.value, selectionStart: el.selectionStart };
		});

		expect(after.value).toBe(before.value);
		// Caret should have moved right over the formatting character.
		expect(after.selectionStart).toBe(before.idx + 1);
	});

	test('spaces=false disables formatting separators', async ({ page }) => {
		await openOptionsPanel(page);
		const spacesToggle = page.getByRole('checkbox', { name: 'Spaces' });
		if (await spacesToggle.isChecked()) {
			await page.evaluate(() => {
				const el = document.querySelector(
					'input[id^="spaces-"]'
				) as HTMLInputElement | null;
				if (!el) throw new Error('Spaces checkbox not found');
				el.click();
			});
			await expect(spacesToggle).not.toBeChecked();
		}

		const input = page.getByTestId('tel-input');
		await clearTelInput(input);
		await input.pressSequentially('+12154567890', { delay: 30 });
		await expect(input).toHaveValue('+12154567890');
	});

	test('toggling spaces off reformats existing value without spaces', async ({ page }) => {
		// Ensure spaces is ON first
		await openOptionsPanel(page);
		const spacesToggle = page.getByRole('checkbox', { name: 'Spaces' });
		if (!(await spacesToggle.isChecked())) {
			await page.evaluate(() => {
				const el = document.querySelector(
					'input[id^="spaces-"]'
				) as HTMLInputElement | null;
				if (!el) throw new Error('Spaces checkbox not found');
				el.click();
			});
			await expect(spacesToggle).toBeChecked();
		}

		// Type a number with spaces enabled — should be formatted
		const input = page.getByTestId('tel-input');
		await clearTelInput(input);
		await input.pressSequentially('+12154567890', { delay: 30 });
		await expect(input).toHaveValue('+1 215-456-7890');

		// Now toggle spaces OFF — existing value should reformat immediately
		await page.evaluate(() => {
			const el = document.querySelector('input[id^="spaces-"]') as HTMLInputElement | null;
			if (!el) throw new Error('Spaces checkbox not found');
			el.click();
		});
		await expect(spacesToggle).not.toBeChecked();
		await expect(input).toHaveValue('+12154567890');
	});

	test('toggling spaces on reformats existing value with spaces', async ({ page }) => {
		// Ensure spaces is OFF first
		await openOptionsPanel(page);
		const spacesToggle = page.getByRole('checkbox', { name: 'Spaces' });
		if (await spacesToggle.isChecked()) {
			await page.evaluate(() => {
				const el = document.querySelector(
					'input[id^="spaces-"]'
				) as HTMLInputElement | null;
				if (!el) throw new Error('Spaces checkbox not found');
				el.click();
			});
			await expect(spacesToggle).not.toBeChecked();
		}

		// Type a number with spaces disabled — should be unformatted
		const input = page.getByTestId('tel-input');
		await clearTelInput(input);
		await input.pressSequentially('+12154567890', { delay: 30 });
		await expect(input).toHaveValue('+12154567890');

		// Now toggle spaces ON — existing value should reformat immediately
		await page.evaluate(() => {
			const el = document.querySelector('input[id^="spaces-"]') as HTMLInputElement | null;
			if (!el) throw new Error('Spaces checkbox not found');
			el.click();
		});
		await expect(spacesToggle).toBeChecked();
		await expect(input).toHaveValue('+1 215-456-7890');
	});

	test('country change shows invalid styling when required is set', async ({ page }) => {
		const input = page.getByTestId('tel-input');
		await clearTelInput(input);
		await input.pressSequentially('+12154567890', { delay: 30 });
		await expect(input).toHaveValue('+1 215-456-7890');

		const countryButton = page.locator('#states-button');
		await expect(countryButton).toBeEnabled();

		// Manual country change clears input; demo default has required=true,
		// so the empty input should be invalid.
		await countryButton.click();
		await page.locator('#dropdown-countries button[value="US"]').click();
		await countryButton.click();
		await page.locator('#dropdown-countries button[value="HU"]').click();

		// Input should reset/clear.
		await expect(input).toHaveValue('');

		// Wrapper should reflect invalid styling.
		const wrapper = countryButton
			.locator('xpath=ancestor::div[contains(@class,"rounded-lg")]')
			.first();
		await expect(wrapper).toHaveClass(/ring-pink-500/);
	});
});

test.describe('Validation behavior', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/playground');
		await expect(page.locator('#states-button')).toBeEnabled();
		await expect(page.getByTestId('tel-input')).toBeVisible();
	});

	test('empty input is valid when required is off', async ({ page }) => {
		const input = page.getByTestId('tel-input');
		const countryButton = page.locator('#states-button');
		const wrapper = countryButton
			.locator('xpath=ancestor::div[contains(@class,"rounded-lg")]')
			.first();

		// Open options and disable required
		await openOptionsPanel(page);
		const requiredCheckbox = page.locator('input[id^="required-"]');
		if (await requiredCheckbox.isChecked()) {
			await toggleRequiredCheckbox(page);
			await expect(requiredCheckbox).not.toBeChecked();
		}

		// Clear input, verify it's empty, then blur
		await clearTelInput(input);
		await expect(input).toHaveValue('');
		await input.press('Tab');

		// Should NOT show invalid styling
		await expect(wrapper).not.toHaveClass(/ring-pink-500/);
	});

	test('empty input is invalid when required is on', async ({ page }) => {
		const input = page.getByTestId('tel-input');
		const countryButton = page.locator('#states-button');
		const wrapper = countryButton
			.locator('xpath=ancestor::div[contains(@class,"rounded-lg")]')
			.first();

		// Ensure required is ON
		await openOptionsPanel(page);
		const requiredCheckbox = page.locator('input[id^="required-"]');
		if (!(await requiredCheckbox.isChecked())) {
			await toggleRequiredCheckbox(page);
			await expect(requiredCheckbox).toBeChecked();
		}

		// Clear input and blur
		await clearTelInput(input);
		await expect(input).toHaveValue('');
		await input.press('Tab');

		// Should show invalid styling
		await expect(wrapper).toHaveClass(/ring-pink-500/);
	});

	test('partial number is invalid regardless of required setting', async ({ page }) => {
		const input = page.getByTestId('tel-input');
		const countryButton = page.locator('#states-button');
		const wrapper = countryButton
			.locator('xpath=ancestor::div[contains(@class,"rounded-lg")]')
			.first();

		// Disable required
		await openOptionsPanel(page);
		const requiredCheckbox = page.locator('input[id^="required-"]');
		if (await requiredCheckbox.isChecked()) {
			await toggleRequiredCheckbox(page);
			await expect(requiredCheckbox).not.toBeChecked();
		}

		// Type partial number
		await clearTelInput(input);
		await input.pressSequentially('215', { delay: 50 });
		await input.press('Tab');

		// Should show invalid styling because partial numbers are always invalid
		await expect(wrapper).toHaveClass(/ring-pink-500/);
	});

	test('validateOn=always validates during typing and on blur', async ({ page }) => {
		const input = page.getByTestId('tel-input');
		const countryButton = page.locator('#states-button');
		const wrapper = countryButton
			.locator('xpath=ancestor::div[contains(@class,"rounded-lg")]')
			.first();

		// Open options and set validateOn to always
		await openOptionsPanel(page);
		const validateOnSelect = page.locator('select[id^="validateOn-"]');
		await validateOnSelect.selectOption('always');

		// Ensure required is OFF
		const requiredCheckbox = page.locator('input[id^="required-"]');
		if (await requiredCheckbox.isChecked()) {
			await toggleRequiredCheckbox(page);
		}

		// Wait for potential {#key} re-mount to settle
		await expect(page.locator('#states-button')).toBeEnabled();
		await expect(page.getByTestId('tel-input')).toBeVisible();

		// Select a country to start with
		await countryButton.click();
		await page.locator('#dropdown-countries button[value="US"]').click();

		// Type a partial number — should show invalid during typing
		await clearTelInput(input);
		await input.pressSequentially('215', { delay: 50 });
		await expect(wrapper).toHaveClass(/ring-pink-500/);

		// Complete the number — should become valid
		await input.pressSequentially('4567890', { delay: 50 });
		await expect(wrapper).not.toHaveClass(/ring-pink-500/);

		// Clear and verify empty is valid (required is off)
		await clearTelInput(input);
		await expect(input).toHaveValue('');
		await expect(wrapper).not.toHaveClass(/ring-pink-500/);
	});

	test('validateOn=blur does not show invalid while typing, only after blur', async ({
		page
	}) => {
		const input = page.getByTestId('tel-input');
		const countryButton = page.locator('#states-button');
		const wrapper = countryButton
			.locator('xpath=ancestor::div[contains(@class,"rounded-lg")]')
			.first();

		// Open options and set validateOn to blur
		await openOptionsPanel(page);
		const validateOnSelect = page.locator('select[id^="validateOn-"]');
		await validateOnSelect.selectOption('blur');

		// Ensure required is OFF
		const requiredCheckbox = page.locator('input[id^="required-"]');
		if (await requiredCheckbox.isChecked()) {
			await toggleRequiredCheckbox(page);
		}

		// Wait for potential {#key} re-mount to settle
		await expect(page.locator('#states-button')).toBeEnabled();
		await expect(page.getByTestId('tel-input')).toBeVisible();

		// Select a country to start with
		await countryButton.click();
		await page.locator('#dropdown-countries button[value="US"]').click();

		// Clear existing value first
		await clearTelInput(input);
		await expect(input).toHaveValue('');
		// Blur to clear any prior validation state, then refocus
		await input.press('Tab');
		await input.click();

		// Type a partial number — should NOT show invalid during typing
		await input.pressSequentially('215', { delay: 50 });
		await expect(wrapper).not.toHaveClass(/ring-pink-500/);

		// Blur — NOW should show invalid
		await input.press('Tab');
		await expect(wrapper).toHaveClass(/ring-pink-500/);
	});
});

const inputFormatsMatrix = [
	{
		country: 'HU',
		variants: [
			{ typed: '+3613171377', displayedAs: '+36 1 317 1377', e164: '+3613171377' },
			{ typed: '3613171377', displayedAs: '36 1 317 1377', e164: '+3613171377' },
			{ typed: '0613171377', displayedAs: '(06 1) 317 1377', e164: '+3613171377' },
			{ typed: '13171377', displayedAs: '1 317 1377', e164: '+3613171377' }
		]
	},
	{
		country: 'US',
		variants: [
			{ typed: '+12154567890', displayedAs: '+1 215-456-7890', e164: '+12154567890' },
			{ typed: '12154567890', displayedAs: '1 (215) 456-7890', e164: '+12154567890' },
			{ typed: '2154567890', displayedAs: '(215) 456-7890', e164: '+12154567890' }
		]
	},
	{
		country: 'GB',
		variants: [
			{ typed: '+447947123456', displayedAs: '+44 7947 123456', e164: '+447947123456' },
			{ typed: '07947123456', displayedAs: '7947 123456', e164: '+447947123456' },
			{ typed: '7947123456', displayedAs: '7947 123456', e164: '+447947123456' }
		]
	}
] as const;

test.describe('Input Format Variants', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/playground');
		await expect(page.locator('#states-button')).toBeEnabled();
		await expect(page.getByTestId('tel-input')).toBeVisible();
	});

	for (const { country, variants } of inputFormatsMatrix) {
		for (const { typed, displayedAs, e164 } of variants) {
			test(`country=${country} typed="${typed}" → display="${displayedAs}" e164=${e164}`, async ({
				page
			}) => {
				const countryButton = page.locator('#states-button');
				await countryButton.click();
				await page.locator(`#dropdown-countries button[value="${country}"]`).click();

				const input = page.getByTestId('tel-input');
				await clearTelInput(input);
				await input.pressSequentially(typed, { delay: 50 });

				await expect(input).toHaveValue(displayedAs);

				// Verify the stored e164 value appears in the payload block
				await expect(
					page.locator('div.validation-table.mt-5:not(.rounded-t)')
				).toContainText(e164);
			});
		}
	}
});
