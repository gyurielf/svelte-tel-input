import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import TelInput from '$lib/components/input/TelInput.svelte';

describe('TelInput Component', () => {
	const fireUserEvent = userEvent.setup();

	const countryMatrix = [
		{
			country: 'US',
			userTyped: '+1 (215) 456-7890',
			expectedE164: '+12154567890',
			replacementTyped: '+1 215 456 7891',
			replacementE164: '+12154567891'
		},
		{
			country: 'HU',
			userTyped: '+36 30 123 4567',
			expectedE164: '+36301234567',
			replacementTyped: '+36 30 123 4568',
			replacementE164: '+36301234568'
		},
		{
			country: 'GB',
			userTyped: '+44 7947 123456',
			expectedE164: '+447947123456',
			replacementTyped: '+44 7947 123457',
			replacementE164: '+447947123457'
		}
	] as const;

	describe('Basic Functionality', () => {
		it('should render with default props', () => {
			const { getByTestId } = render(TelInput, { props: { value: null, country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;
			expect(input).toBeTruthy();
			expect(input?.type).toBe('tel');
		});

		it('should handle basic number input', async () => {
			const { getByTestId } = render(TelInput, { props: { value: null, country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');
			expect(input.value).toBe('(215) 456-7890');
		});

		it('should maintain cursor position after typing', async () => {
			const { getByTestId } = render(TelInput, { props: { value: null, country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '215');
			expect(input.value).toBe('(215)');
			expect(input.selectionStart).toBe(input.value.length);
		});
	});

	describe('Deletion Behavior', () => {
		it('should handle backspace correctly', async () => {
			const { getByTestId } = render(TelInput, { props: { value: null, country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');
			expect(input.value).toBe('(215) 456-7890');

			await fireUserEvent.type(input, '{Backspace}');
			expect(input.value).toBe('(215) 456-789');
		});

		it('should handle delete key correctly', async () => {
			const { getByTestId } = render(TelInput, { props: { value: null, country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');
			expect(input.value).toBe('(215) 456-7890');
			// Position cursor on the first digit of the exchange (after ") ")
			input.setSelectionRange(6, 6);

			await fireUserEvent.keyboard('{Delete}');
			expect(input.value).toContain('56');
		});

		it('should handle selection deletion', async () => {
			const { getByTestId } = render(TelInput, { props: { value: null, country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');
			expect(input.value).toBe('(215) 456-7890');
			// Select the area code digits "215"
			input.setSelectionRange(1, 4);

			await fireUserEvent.keyboard('{Backspace}');
			expect(input.value).not.toContain('215');
		});
	});

	describe('Callback Handling', () => {
		it('should invoke value, validity and details callbacks with final parsed values', async () => {
			const mockUpdateValue = vi.fn();
			const mockUpdateValid = vi.fn();
			const mockUpdateDetails = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					onUpdateValue: mockUpdateValue,
					onUpdateValid: mockUpdateValid,
					onUpdateDetails: mockUpdateDetails
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');

			expect(input.value).toBe('(215) 456-7890');
			expect(mockUpdateValue).toHaveBeenCalled();
			expect(mockUpdateValid).toHaveBeenCalled();
			expect(mockUpdateDetails).toHaveBeenCalled();

			expect(mockUpdateValue.mock.calls.at(-1)?.[0]).toBe('+12154567890');
			expect(mockUpdateValid.mock.calls.at(-1)?.[0]).toBe(true);
			expect(mockUpdateDetails.mock.calls.at(-1)?.[0]).toEqual(
				expect.objectContaining({
					e164: '+12154567890',
					isValid: true,
					countryCode: 'US'
				})
			);
		});

		it('should not switch country on partial dial code but switch on full dial code match', async () => {
			const mockUpdateCountry = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: { value: null, country: 'US', onUpdateCountry: mockUpdateCountry }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '+3');
			expect(mockUpdateCountry).not.toHaveBeenCalled();

			await fireUserEvent.type(input, '6');
			expect(mockUpdateCountry).toHaveBeenCalledWith('HU');
		});

		it('should ignore non-digit characters while user is typing', async () => {
			const { getByTestId } = render(TelInput, { props: { value: null, country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '(215)abc-456 78x90');
			expect(input.value).toBe('(215) 456-7890');
		});
	});

	describe('Country Detection', () => {
		it('should detect country from input', async () => {
			const mockUpdateCountry = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: { value: null, country: 'US', onUpdateCountry: mockUpdateCountry }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');
			// Should NOT switch country when there is no leading '+'.
			expect(mockUpdateCountry).not.toHaveBeenCalled();

			await fireUserEvent.clear(input);
			await fireUserEvent.type(input, '+447947123456');
			expect(mockUpdateCountry).toHaveBeenCalled();
		});
	});

	describe('Formatting', () => {
		it('should format number with spaces when spaces option is true', async () => {
			const { container } = render(TelInput, {
				props: { options: { spaces: true }, value: null, country: 'US' }
			});
			const input = container.querySelector('input') as HTMLInputElement;

			await fireUserEvent.type(input, '+12154567890');
			expect(input.value).toBe('+1 215-456-7890');
		});

		it('should format number without spaces when spaces option is false', async () => {
			const { container } = render(TelInput, {
				props: { options: { spaces: false }, value: null, country: 'US' }
			});
			const input = container.querySelector('input') as HTMLInputElement;

			await fireUserEvent.type(input, '+12154567890');
			expect(input.value).toBe('+12154567890');
		});
	});

	describe('Selection and Cursor Behavior', () => {
		it('should handle text replacement correctly', async () => {
			const { getByTestId } = render(TelInput, { props: { value: null, country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');
			expect(input.value).toBe('(215) 456-7890');

			input.setSelectionRange(1, 4); // Select area code digits
			await fireUserEvent.keyboard('4');
			await fireUserEvent.keyboard('5');
			expect(input.value).toContain('45');
		});

		it('should maintain cursor position after space insertion', async () => {
			const { getByTestId } = render(TelInput, { props: { value: null, country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '+1');
			expect(input.value).toBe('+1');
			expect(input.selectionStart).toBe(2);
		});

		it('should handle cursor movement around spaces', async () => {
			const { getByTestId } = render(TelInput, { props: { value: null, country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '+1215');
			// Place cursor just before the space after +1
			input.setSelectionRange(2, 2);
			await fireUserEvent.keyboard('{ArrowRight}');
			expect(input.selectionStart).toBeGreaterThanOrEqual(2);
		});
	});

	describe('Length Capping', () => {
		it('should cap length at maximum valid number length', async () => {
			const { getByTestId } = render(TelInput, { props: { value: null, country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');
			expect(input.value).toBe('(215) 456-7890');
			// Try to add extra digits beyond a valid US national number
			await fireUserEvent.type(input, '12345');
			expect(input.value).toBe('(215) 456-7890');
		});
	});

	describe('Country Matrix Human Flows', () => {
		it.each(countryMatrix)(
			'should support typing and full replacement for $country',
			async ({ country, userTyped, expectedE164, replacementTyped, replacementE164 }) => {
				const mockUpdateValue = vi.fn();
				const mockUpdateValid = vi.fn();
				const mockUpdateDetails = vi.fn();

				const { getByTestId } = render(TelInput, {
					props: {
						value: null,
						country,
						onUpdateValue: mockUpdateValue,
						onUpdateValid: mockUpdateValid,
						onUpdateDetails: mockUpdateDetails
					}
				});
				const input = getByTestId('tel-input') as HTMLInputElement;

				await fireUserEvent.type(input, userTyped);
				expect(mockUpdateValue.mock.calls.at(-1)?.[0]).toBe(expectedE164);
				expect(mockUpdateValid.mock.calls.at(-1)?.[0]).toBe(true);
				expect(mockUpdateDetails.mock.calls.at(-1)?.[0]).toEqual(
					expect.objectContaining({
						countryCode: country,
						isValid: true,
						e164: expectedE164
					})
				);

				await fireUserEvent.click(input);
				input.setSelectionRange(0, input.value.length);
				await fireUserEvent.paste(replacementTyped);

				expect(mockUpdateValue.mock.calls.at(-1)?.[0]).toBe(replacementE164);
				expect(mockUpdateValid.mock.calls.at(-1)?.[0]).toBe(true);
				expect(mockUpdateDetails.mock.calls.at(-1)?.[0]).toEqual(
					expect.objectContaining({
						countryCode: country,
						isValid: true,
						e164: replacementE164
					})
				);
			}
		);

		it.each(countryMatrix)(
			'should support in-place correction edits for $country',
			async ({ country, userTyped, replacementE164 }) => {
				const mockUpdateValue = vi.fn();
				const mockUpdateValid = vi.fn();
				const replacementDigit = replacementE164.slice(-1);

				const { getByTestId } = render(TelInput, {
					props: {
						value: null,
						country,
						onUpdateValue: mockUpdateValue,
						onUpdateValid: mockUpdateValid
					}
				});
				const input = getByTestId('tel-input') as HTMLInputElement;

				await fireUserEvent.type(input, userTyped);
				await fireUserEvent.click(input);
				input.setSelectionRange(input.value.length, input.value.length);
				await fireUserEvent.keyboard(`{Backspace}${replacementDigit}`);

				expect(mockUpdateValid.mock.calls.at(-1)?.[0]).toBe(true);
				expect(mockUpdateValue.mock.calls.at(-1)?.[0]).toBe(replacementE164);
			}
		);
	});
});
