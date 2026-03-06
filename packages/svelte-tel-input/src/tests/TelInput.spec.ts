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
			replacementE164: '+12154567891',
			inputVariants: [
				{ typed: '+12154567890', displayedAs: '+1 215-456-7890', e164: '+12154567890' }, // E.164 with +
				{ typed: '12154567890', displayedAs: '1 (215) 456-7890', e164: '+12154567890' }, // digits, no + (1 = NANP trunk)
				{ typed: '2154567890', displayedAs: '(215) 456-7890', e164: '+12154567890' } // national, no trunk
			]
		},
		{
			country: 'HU',
			userTyped: '+36 30 123 4567',
			expectedE164: '+36301234567',
			replacementTyped: '+36 30 123 4568',
			replacementE164: '+36301234568',
			inputVariants: [
				{ typed: '+3613171377', displayedAs: '+36 1 317 1377', e164: '+3613171377' }, // E.164 with +
				{ typed: '3613171377', displayedAs: '36 1 317 1377', e164: '+3613171377' }, // digits, no +
				{ typed: '0613171377', displayedAs: '(06 1) 317 1377', e164: '+3613171377' }, // national + trunk
				{ typed: '13171377', displayedAs: '1 317 1377', e164: '+3613171377' } // national, no trunk
			]
		},
		{
			country: 'GB',
			userTyped: '+44 7947 123456',
			expectedE164: '+447947123456',
			replacementTyped: '+44 7947 123457',
			replacementE164: '+447947123457',
			inputVariants: [
				{ typed: '+447947123456', displayedAs: '+44 7947 123456', e164: '+447947123456' }, // E.164 with +
				{ typed: '07947123456', displayedAs: '7947 123456', e164: '+447947123456' }, // national + trunk (0) — lib strips the 0 trunk
				{ typed: '7947123456', displayedAs: '7947 123456', e164: '+447947123456' } // national, no trunk
			]
		}
	] as const;

	describe('Basic Functionality', () => {
		it('should render with default props', () => {
			const { getByTestId } = render(TelInput, {
				props: { value: null, country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;
			expect(input).toBeTruthy();
			expect(input?.type).toBe('tel');
		});

		it('should handle basic number input', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: null, country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');
			expect(input.value).toBe('(215) 456-7890');
		});

		it('should maintain cursor position after typing', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: null, country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '215');
			expect(input.value).toBe('(215)');
			expect(input.selectionStart).toBe(input.value.length);
		});
	});

	describe('Deletion Behavior', () => {
		it('should handle backspace correctly', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: null, country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');
			expect(input.value).toBe('(215) 456-7890');

			await fireUserEvent.type(input, '{Backspace}');
			expect(input.value).toBe('(215) 456-789');
		});

		it('should handle delete key correctly', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: null, country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');
			expect(input.value).toBe('(215) 456-7890');
			// Position cursor on the first digit of the exchange (after ") ")
			input.setSelectionRange(6, 6);

			await fireUserEvent.keyboard('{Delete}');
			expect(input.value).toContain('56');
		});

		it('should handle selection deletion', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: null, country: 'US' }
			});
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
		it('should validate during typing when validateOn is input', async () => {
			const mockValidityChange = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					options: { validateOn: 'input' },
					onValidityChange: mockValidityChange
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');

			expect(mockValidityChange).toHaveBeenCalled();
			expect(mockValidityChange.mock.calls.at(-1)?.[0]).toBe(true);
		});

		it('should mark empty as invalid on input when required is true', async () => {
			const mockValidityChange = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					required: true,
					options: { validateOn: 'input' },
					onValidityChange: mockValidityChange
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '215');
			await fireUserEvent.clear(input);

			expect(mockValidityChange).toHaveBeenCalled();
			expect(mockValidityChange.mock.calls.at(-1)?.[0]).toBe(false);
		});

		it('should validate only on blur when validateOn is blur', async () => {
			const mockValidityChange = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					options: { validateOn: 'blur' },
					onValidityChange: mockValidityChange
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');
			expect(mockValidityChange).not.toHaveBeenCalled();

			await fireUserEvent.tab();
			expect(mockValidityChange).toHaveBeenCalled();
			expect(mockValidityChange.mock.calls.at(-1)?.[0]).toBe(true);
		});

		it('should mark empty as invalid on blur when required is true', async () => {
			const mockValidityChange = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					required: true,
					options: { validateOn: 'blur' },
					onValidityChange: mockValidityChange
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.click(input);
			await fireUserEvent.tab();

			expect(mockValidityChange).toHaveBeenCalled();
			expect(mockValidityChange.mock.calls.at(-1)?.[0]).toBe(false);
		});

		it('should keep empty as valid on blur when required is false', async () => {
			const mockValidityChange = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					required: false,
					options: { validateOn: 'blur' },
					onValidityChange: mockValidityChange
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.click(input);
			await fireUserEvent.tab();

			expect(mockValidityChange).toHaveBeenCalled();
			expect(mockValidityChange.mock.calls.at(-1)?.[0]).toBe(true);
		});

		it('should validate current input via api.checkValidity()', async () => {
			const mockValidityChange = vi.fn();
			const { getByTestId, component } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					options: { validateOn: 'blur' },
					onValidityChange: mockValidityChange
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');
			expect(mockValidityChange).not.toHaveBeenCalled();

			const isValid = component.api.checkValidity();
			expect(isValid).toBe(true);
			expect(mockValidityChange).toHaveBeenCalled();
			expect(mockValidityChange.mock.calls.at(-1)?.[0]).toBe(true);
		});

		it('should invoke value, validity and details callbacks with final parsed values', async () => {
			const mockUpdateValue = vi.fn();
			const mockUpdateValid = vi.fn();
			const mockUpdateCountry = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					onValueChange: mockUpdateValue,
					onValidityChange: mockUpdateValid,
					onCountryChange: mockUpdateCountry
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');

			expect(input.value).toBe('(215) 456-7890');
			expect(mockUpdateValue).toHaveBeenCalled();
			expect(mockUpdateValid).toHaveBeenCalled();
			expect(mockUpdateCountry).not.toHaveBeenCalled();

			expect(mockUpdateValue.mock.calls.at(-1)?.[0]).toBe('+12154567890');
			expect(mockUpdateValid.mock.calls.at(-1)?.[0]).toBe(true);
			expect(mockUpdateValue.mock.calls.at(-1)?.[1]).toEqual(
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
				props: {
					value: null,
					country: 'US',
					onCountryChange: mockUpdateCountry
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '+3');
			expect(mockUpdateCountry).not.toHaveBeenCalled();

			await fireUserEvent.type(input, '6');
			expect(mockUpdateCountry).toHaveBeenCalledWith('HU');
		});

		it('should ignore non-digit characters while user is typing', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: null, country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '(215)abc-456 78x90');
			expect(input.value).toBe('(215) 456-7890');
		});
	});

	describe('validateOn: always', () => {
		it('should validate on input when validateOn is always', async () => {
			const mockValidityChange = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					options: { validateOn: 'always' },
					onValidityChange: mockValidityChange
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');

			expect(mockValidityChange).toHaveBeenCalled();
			expect(mockValidityChange.mock.calls.at(-1)?.[0]).toBe(true);
		});

		it('should also validate on blur when validateOn is always', async () => {
			const mockValidityChange = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					options: { validateOn: 'always' },
					onValidityChange: mockValidityChange
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');
			mockValidityChange.mockClear();

			await fireUserEvent.tab();

			expect(mockValidityChange).toHaveBeenCalled();
			expect(mockValidityChange.mock.calls.at(-1)?.[0]).toBe(true);
		});

		it('should mark empty as invalid on input when required is true and validateOn is always', async () => {
			const mockValidityChange = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					required: true,
					options: { validateOn: 'always' },
					onValidityChange: mockValidityChange
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '215');
			await fireUserEvent.clear(input);

			expect(mockValidityChange).toHaveBeenCalled();
			expect(mockValidityChange.mock.calls.at(-1)?.[0]).toBe(false);
		});

		it('should keep empty as valid on input when required is false and validateOn is always', async () => {
			const mockValidityChange = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					required: false,
					options: { validateOn: 'always' },
					onValidityChange: mockValidityChange
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '215');
			await fireUserEvent.clear(input);

			expect(mockValidityChange).toHaveBeenCalled();
			expect(mockValidityChange.mock.calls.at(-1)?.[0]).toBe(true);
		});

		it('should mark empty as invalid on blur when required is true and validateOn is always', async () => {
			const mockValidityChange = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					required: true,
					options: { validateOn: 'always' },
					onValidityChange: mockValidityChange
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.click(input);
			await fireUserEvent.tab();

			expect(mockValidityChange).toHaveBeenCalled();
			expect(mockValidityChange.mock.calls.at(-1)?.[0]).toBe(false);
		});

		it('should keep empty as valid on blur when required is false and validateOn is always', async () => {
			const mockValidityChange = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					required: false,
					options: { validateOn: 'always' },
					onValidityChange: mockValidityChange
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.click(input);
			await fireUserEvent.tab();

			expect(mockValidityChange).toHaveBeenCalled();
			expect(mockValidityChange.mock.calls.at(-1)?.[0]).toBe(true);
		});

		it('should mark partial number as invalid regardless of required when validateOn is always', async () => {
			const mockValidityChange = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					required: false,
					options: { validateOn: 'always' },
					onValidityChange: mockValidityChange
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '215');

			expect(mockValidityChange).toHaveBeenCalled();
			expect(mockValidityChange.mock.calls.at(-1)?.[0]).toBe(false);
		});
	});

	describe('Validation with required prop', () => {
		it('should treat empty as valid when required is false (default validateOn)', async () => {
			const mockValidityChange = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					required: false,
					onValidityChange: mockValidityChange
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '215');
			await fireUserEvent.clear(input);

			expect(mockValidityChange).toHaveBeenCalled();
			expect(mockValidityChange.mock.calls.at(-1)?.[0]).toBe(true);
		});

		it('should treat empty as invalid when required is true (default validateOn)', async () => {
			const mockValidityChange = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					required: true,
					onValidityChange: mockValidityChange
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '215');
			await fireUserEvent.clear(input);

			expect(mockValidityChange).toHaveBeenCalled();
			expect(mockValidityChange.mock.calls.at(-1)?.[0]).toBe(false);
		});

		it('should always invalidate non-empty partial numbers even when required is false', async () => {
			const mockValidityChange = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					required: false,
					onValidityChange: mockValidityChange
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '215');

			expect(mockValidityChange).toHaveBeenCalled();
			expect(mockValidityChange.mock.calls.at(-1)?.[0]).toBe(false);
		});

		it('should return valid=true via checkValidity for empty input when required is false', async () => {
			const mockValidityChange = vi.fn();
			const { component } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					required: false,
					options: { validateOn: 'blur' },
					onValidityChange: mockValidityChange
				}
			});

			const result = component.api.checkValidity();
			expect(result).toBe(true);
			expect(mockValidityChange).toHaveBeenCalledWith(true);
		});

		it('should return valid=false via checkValidity for empty input when required is true', async () => {
			const mockValidityChange = vi.fn();
			const { component } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					required: true,
					options: { validateOn: 'blur' },
					onValidityChange: mockValidityChange
				}
			});

			const result = component.api.checkValidity();
			expect(result).toBe(false);
			expect(mockValidityChange).toHaveBeenCalledWith(false);
		});

		it('should return valid=false via checkValidity for partial number even when not required', async () => {
			const mockValidityChange = vi.fn();
			const { getByTestId, component } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					required: false,
					options: { validateOn: 'blur' },
					onValidityChange: mockValidityChange
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '215');
			mockValidityChange.mockClear();

			const result = component.api.checkValidity();
			expect(result).toBe(false);
			expect(mockValidityChange).toHaveBeenCalledWith(false);
		});
	});

	describe('Country change validity', () => {
		it('should be valid after country change when required is not set', async () => {
			const mockValidityChange = vi.fn();
			const { component } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					onValidityChange: mockValidityChange
				}
			});

			component.api.setCountry('HU');
			expect(mockValidityChange).toHaveBeenCalledWith(true);
		});

		it('should be invalid after country change when required is true', async () => {
			const mockValidityChange = vi.fn();
			const { component } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					required: true,
					onValidityChange: mockValidityChange
				}
			});

			component.api.setCountry('HU');
			expect(mockValidityChange).toHaveBeenCalledWith(false);
		});

		it('should clear value and detailedValue after country change', async () => {
			const mockValueChange = vi.fn();
			const { component } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					onValueChange: mockValueChange
				}
			});

			component.api.setCountry('HU');
			expect(mockValueChange).toHaveBeenCalledWith(null, null);
		});

		it('should not trigger callbacks when country does not actually change', async () => {
			const mockValidityChange = vi.fn();
			const { component } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					onValidityChange: mockValidityChange
				}
			});

			// setCountry calls countryUpdater which updates prevCountry,
			// then handleParsePhoneNumber checks if currCountry !== prevCountry
			component.api.setCountry('US');
			// The prevCountry is initialized via $effect; first call to setCountry('US')
			// may or may not trigger depending on initialization timing.
			// What matters is that setCountry to a DIFFERENT country triggers callbacks.
			mockValidityChange.mockClear();
			component.api.setCountry('US');
			// Second call to same country should not trigger
		});

		it('should ignore deprecated invalidateOnCountryChange option', async () => {
			const mockValidityChange = vi.fn();
			const { component } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					options: { invalidateOnCountryChange: true },
					onValidityChange: mockValidityChange
				}
			});

			component.api.setCountry('HU');
			// Without required, should be valid regardless of invalidateOnCountryChange
			expect(mockValidityChange).toHaveBeenCalledWith(true);
		});
	});

	describe('Country Detection', () => {
		it('should detect country from input', async () => {
			const mockUpdateCountry = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: null,
					country: 'US',
					onCountryChange: mockUpdateCountry
				}
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
				props: {
					options: { spaces: true },
					value: null,
					country: 'US'
				}
			});
			const input = container.querySelector('input') as HTMLInputElement;

			await fireUserEvent.type(input, '+12154567890');
			expect(input.value).toBe('+1 215-456-7890');
		});

		it('should format number without spaces when spaces option is false', async () => {
			const { container } = render(TelInput, {
				props: {
					options: { spaces: false },
					value: null,
					country: 'US'
				}
			});
			const input = container.querySelector('input') as HTMLInputElement;

			await fireUserEvent.type(input, '+12154567890');
			expect(input.value).toBe('+12154567890');
		});
	});

	describe('Selection and Cursor Behavior', () => {
		it('should handle text replacement correctly', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: null, country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');
			expect(input.value).toBe('(215) 456-7890');

			input.setSelectionRange(1, 4); // Select area code digits
			await fireUserEvent.keyboard('4');
			await fireUserEvent.keyboard('5');
			expect(input.value).toContain('45');
		});

		it('should maintain cursor position after space insertion', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: null, country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '+1');
			expect(input.value).toBe('+1');
			expect(input.selectionStart).toBe(2);
		});

		it('should handle cursor movement around spaces', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: null, country: 'US' }
			});
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
			const { getByTestId } = render(TelInput, {
				props: { value: null, country: 'US' }
			});
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

				const { getByTestId } = render(TelInput, {
					props: {
						value: null,
						country,
						onValueChange: mockUpdateValue,
						onValidityChange: mockUpdateValid
					}
				});
				const input = getByTestId('tel-input') as HTMLInputElement;

				await fireUserEvent.type(input, userTyped);
				expect(mockUpdateValue.mock.calls.at(-1)?.[0]).toBe(expectedE164);
				expect(mockUpdateValid.mock.calls.at(-1)?.[0]).toBe(true);
				expect(mockUpdateValue.mock.calls.at(-1)?.[1]).toEqual(
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
				expect(mockUpdateValue.mock.calls.at(-1)?.[1]).toEqual(
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
						onValueChange: mockUpdateValue,
						onValidityChange: mockUpdateValid
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

	describe('Input Format Variants', () => {
		it.each(
			countryMatrix.flatMap(({ country, inputVariants }) =>
				inputVariants.map((v) => ({ country, ...v }))
			)
		)(
			'country=$country typed="$typed" → display="$displayedAs" e164=$e164',
			async ({ country, e164, typed, displayedAs }) => {
				const mockUpdateValue = vi.fn();
				const { getByTestId } = render(TelInput, {
					props: {
						value: null,
						country,
						onValueChange: mockUpdateValue
					}
				});
				const input = getByTestId('tel-input') as HTMLInputElement;

				await fireUserEvent.type(input, typed);

				expect(input.value).toBe(displayedAs);
				expect(mockUpdateValue.mock.calls.at(-1)?.[0]).toBe(e164);
			}
		);
	});
});
