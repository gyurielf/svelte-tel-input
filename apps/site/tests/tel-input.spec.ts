import { expect, test } from '@playwright/test';

async function clearTelInput(input: ReturnType<import('@playwright/test').Page['getByTestId']>) {
	await input.click();
	await input.press('Control+A');
	await input.press('Backspace');
}

async function openOptionsPanel(page: import('@playwright/test').Page) {
	const optionsButton = page.getByRole('button', { name: 'Options' });
	await optionsButton.click();
	await expect(page.getByRole('checkbox', { name: 'Spaces' })).toBeAttached();
}

test.describe('TelInput (demo)', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');

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

	test('invalidateOnCountryChange shows invalid styling on manual country change', async ({
		page
	}) => {
		const input = page.getByTestId('tel-input');
		await clearTelInput(input);
		await input.pressSequentially('+12154567890', { delay: 30 });
		await expect(input).toHaveValue('+1 215-456-7890');

		const countryButton = page.locator('#states-button');
		await expect(countryButton).toBeEnabled();

		// Manual country change (demo default sets invalidateOnCountryChange=true).
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
