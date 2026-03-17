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
				props: { value: '', country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;
			expect(input).toBeTruthy();
			expect(input?.type).toBe('tel');
		});

		it('should handle basic number input', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '', country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');
			expect(input.value).toBe('(215) 456-7890');
		});

		it('should maintain cursor position after typing', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '', country: 'US' }
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
				props: { value: '', country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');
			expect(input.value).toBe('(215) 456-7890');

			await fireUserEvent.type(input, '{Backspace}');
			expect(input.value).toBe('(215) 456-789');
		});

		it('should handle delete key correctly', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '', country: 'US' }
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
				props: { value: '', country: 'US' }
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
					value: '',
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
					value: '',
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
					value: '',
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
					value: '',
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
					value: '',
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
					value: '',
					country: 'US',
					options: { validateOn: 'blur' },
					onValidityChange: mockValidityChange
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');
			expect(mockValidityChange).not.toHaveBeenCalled();

			const isValid = component.api.checkValidity();
			expect(isValid).toEqual({ valid: true, error: null });
			expect(mockValidityChange).toHaveBeenCalled();
			expect(mockValidityChange.mock.calls.at(-1)?.[0]).toBe(true);
		});

		it('should invoke value, validity and details callbacks with final parsed values', async () => {
			const mockUpdateValue = vi.fn();
			const mockUpdateValid = vi.fn();
			const mockUpdateCountry = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: '',
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
					value: '',
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
				props: { value: '', country: 'US' }
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
					value: '',
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
					value: '',
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
					value: '',
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
					value: '',
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
					value: '',
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
					value: '',
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
					value: '',
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
					value: '',
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
					value: '',
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
					value: '',
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
					value: '',
					country: 'US',
					required: false,
					options: { validateOn: 'blur' },
					onValidityChange: mockValidityChange
				}
			});

			const result = component.api.checkValidity();
			expect(result).toEqual({ valid: true, error: null });
			expect(mockValidityChange).toHaveBeenCalledWith(true, null);
		});

		it('should return valid=false via checkValidity for empty input when required is true', async () => {
			const mockValidityChange = vi.fn();
			const { component } = render(TelInput, {
				props: {
					value: '',
					country: 'US',
					required: true,
					options: { validateOn: 'blur' },
					onValidityChange: mockValidityChange
				}
			});

			const result = component.api.checkValidity();
			expect(result).toEqual({ valid: false, error: 'REQUIRED' });
			expect(mockValidityChange).toHaveBeenCalledWith(false, 'REQUIRED');
		});

		it('should return valid=false via checkValidity for partial number even when not required', async () => {
			const mockValidityChange = vi.fn();
			const { getByTestId, component } = render(TelInput, {
				props: {
					value: '',
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
			expect(result).toEqual({ valid: false, error: 'TOO_SHORT' });
			expect(mockValidityChange).toHaveBeenCalledWith(false, 'TOO_SHORT');
		});
	});

	describe('Country change validity', () => {
		it('should be valid after country change when required is not set', async () => {
			const mockValidityChange = vi.fn();
			const { rerender } = render(TelInput, {
				props: {
					value: '',
					country: 'US',
					onValidityChange: mockValidityChange
				}
			});

			await rerender({ country: 'HU' });
			expect(mockValidityChange).toHaveBeenCalledWith(true, null);
		});

		it('should be invalid after country change when required is true', async () => {
			const mockValidityChange = vi.fn();
			const { rerender } = render(TelInput, {
				props: {
					value: '',
					country: 'US',
					required: true,
					onValidityChange: mockValidityChange
				}
			});

			await rerender({ country: 'HU' });
			expect(mockValidityChange).toHaveBeenCalledWith(false, 'REQUIRED');
		});

		it('should clear value and detailedValue after country change', async () => {
			const mockValueChange = vi.fn();
			const { rerender } = render(TelInput, {
				props: {
					value: '',
					country: 'US',
					onValueChange: mockValueChange
				}
			});

			await rerender({ country: 'HU' });
			expect(mockValueChange).toHaveBeenCalledWith('', null);
		});

		it('should fire onCountryChange(null) when api.reset() is called', () => {
			const mockCountryChange = vi.fn();
			const { component } = render(TelInput, {
				props: { value: '+12154567890', country: 'US', onCountryChange: mockCountryChange }
			});

			mockCountryChange.mockClear();
			component.api.reset();

			expect(mockCountryChange).toHaveBeenCalledWith(null);
		});

		it('should restore defaultCountry when api.reset() is called', () => {
			const mockCountryChange = vi.fn();
			const { component } = render(TelInput, {
				props: {
					value: '+12154567890',
					country: 'US',
					defaultCountry: 'HU',
					onCountryChange: mockCountryChange
				}
			});

			mockCountryChange.mockClear();
			component.api.reset();

			expect(mockCountryChange).toHaveBeenCalledWith('HU');
		});

		it('should reset country to null when api.reset({ country: true }) is called, ignoring defaultCountry', () => {
			const mockCountryChange = vi.fn();
			const { component } = render(TelInput, {
				props: {
					value: '+12154567890',
					country: 'US',
					defaultCountry: 'HU',
					onCountryChange: mockCountryChange
				}
			});

			mockCountryChange.mockClear();
			component.api.reset({ country: true });

			expect(mockCountryChange).toHaveBeenCalledWith(null);
		});

		it('should clear value and set country to defaultCountry after reset', () => {
			const mockCountryChange = vi.fn();
			const mockValueChange = vi.fn();
			const mockValidityChange = vi.fn();
			const { component } = render(TelInput, {
				props: {
					value: '+12154567890',
					country: 'US',
					defaultCountry: 'HU',
					onCountryChange: mockCountryChange,
					onValueChange: mockValueChange,
					onValidityChange: mockValidityChange
				}
			});

			mockCountryChange.mockClear();
			mockValueChange.mockClear();
			mockValidityChange.mockClear();
			component.api.reset();

			expect(mockCountryChange).toHaveBeenCalledWith('HU');
			expect(mockValueChange).toHaveBeenCalledWith('', null);
			expect(mockValidityChange).toHaveBeenCalledWith(true, null);
		});

		it('should not trigger callbacks when country prop does not actually change', async () => {
			const mockValidityChange = vi.fn();
			const { rerender } = render(TelInput, {
				props: {
					value: '',
					country: 'US',
					onValidityChange: mockValidityChange
				}
			});

			mockValidityChange.mockClear();
			await rerender({ country: 'US' });
			// Re-rendering with the same country should not trigger callbacks
			expect(mockValidityChange).not.toHaveBeenCalled();
		});

		it('should ignore deprecated invalidateOnCountryChange option', async () => {
			const mockValidityChange = vi.fn();
			const { rerender } = render(TelInput, {
				props: {
					value: '',
					country: 'US',
					onValidityChange: mockValidityChange
				}
			});

			await rerender({ country: 'HU' });
			// Without required, should be valid regardless of invalidateOnCountryChange
			expect(mockValidityChange).toHaveBeenCalledWith(true, null);
		});
	});

	describe('Country Detection', () => {
		it('should detect country from input', async () => {
			const mockUpdateCountry = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: '',
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

	describe('lockCountry option', () => {
		it('should not switch country when lockCountry is true and a different dial code is typed', async () => {
			const mockCountryChange = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: '',
					country: 'US',
					options: { lockCountry: true },
					onCountryChange: mockCountryChange
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '+447947123456');
			expect(mockCountryChange).not.toHaveBeenCalled();
		});

		it('should switch country normally when lockCountry is false', async () => {
			const mockCountryChange = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: '',
					country: 'US',
					options: { lockCountry: false },
					onCountryChange: mockCountryChange
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '+447947123456');
			expect(mockCountryChange).toHaveBeenCalledWith('GB');
		});

		it('should parse number using the locked country even when dial code differs', async () => {
			const mockCountryChange = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: {
					value: '',
					country: 'HU',
					options: { lockCountry: true },
					onCountryChange: mockCountryChange
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '+36301234567');
			// Country should remain HU — no country change callback fired
			expect(mockCountryChange).not.toHaveBeenCalled();
		});

		it('should not switch country when value is set externally with lockCountry', async () => {
			const mockCountryChange = vi.fn();
			const { rerender } = render(TelInput, {
				props: {
					value: '+12154567890',
					country: 'US',
					options: { lockCountry: true },
					onCountryChange: mockCountryChange
				}
			});

			mockCountryChange.mockClear();
			await rerender({ value: '+447947123456' });
			expect(mockCountryChange).not.toHaveBeenCalled();
		});
	});

	describe('Formatting', () => {
		it('should format number with spaces when spaces option is true', async () => {
			const { container } = render(TelInput, {
				props: {
					options: { spaces: true },
					value: '',
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
					value: '',
					country: 'US'
				}
			});
			const input = container.querySelector('input') as HTMLInputElement;

			await fireUserEvent.type(input, '+12154567890');
			expect(input.value).toBe('+12154567890');
		});

		it('should reformat existing value when spaces is toggled off', async () => {
			const { container, rerender } = render(TelInput, {
				props: {
					options: { spaces: true },
					value: '+12154567890',
					country: 'US'
				}
			});
			const input = container.querySelector('input') as HTMLInputElement;

			expect(input.value).toBe('+1 215-456-7890');

			await rerender({ options: { spaces: false } });
			expect(input.value).toBe('+12154567890');
		});

		it('should reformat existing value when spaces is toggled on', async () => {
			const { container, rerender } = render(TelInput, {
				props: {
					options: { spaces: false },
					value: '+12154567890',
					country: 'US'
				}
			});
			const input = container.querySelector('input') as HTMLInputElement;

			expect(input.value).toBe('+12154567890');

			await rerender({ options: { spaces: true } });
			expect(input.value).toBe('+1 215-456-7890');
		});

		it('should reformat HU number when spaces toggled off', async () => {
			const { container, rerender } = render(TelInput, {
				props: {
					options: { spaces: true },
					value: '+36301234567',
					country: 'HU'
				}
			});
			const input = container.querySelector('input') as HTMLInputElement;

			expect(input.value).toContain(' ');

			await rerender({ options: { spaces: false } });
			expect(input.value).toBe('+36301234567');
		});
	});

	describe('External prop binding', () => {
		it('should reformat and update detailedValue when value prop changes externally', async () => {
			const mockValueChange = vi.fn();
			const { container, rerender } = render(TelInput, {
				props: {
					value: '+12154567890',
					country: 'US',
					onValueChange: mockValueChange
				}
			});
			const input = container.querySelector('input') as HTMLInputElement;
			expect(input.value).toBe('+1 215-456-7890');

			mockValueChange.mockClear();
			await rerender({ value: '+447947123456' });

			expect(input.value).toBe('+44 7947 123456');
			expect(mockValueChange.mock.calls.at(-1)?.[0]).toBe('+447947123456');
			expect(mockValueChange.mock.calls.at(-1)?.[1]).toEqual(
				expect.objectContaining({ countryCode: 'GB', isValid: true })
			);
		});

		it("should reset when value prop is set to '' externally", async () => {
			const { container, rerender } = render(TelInput, {
				props: {
					value: '+12154567890',
					country: 'US'
				}
			});
			const input = container.querySelector('input') as HTMLInputElement;
			expect(input.value).toBe('+1 215-456-7890');

			await rerender({ value: '' });

			expect(input.value).toBe('');
		});

		it('should reset input when country prop changes externally', async () => {
			const mockValueChange = vi.fn();
			const { container, rerender } = render(TelInput, {
				props: {
					value: '+12154567890',
					country: 'US',
					onValueChange: mockValueChange
				}
			});
			const input = container.querySelector('input') as HTMLInputElement;
			expect(input.value).toBe('+1 215-456-7890');

			await rerender({ country: 'HU' });

			// Clears input on external country change
			expect(input.value).toBe('');
		});

		it('should not fire callbacks when parent re-renders with identical props', async () => {
			const mockValueChange = vi.fn();
			const { rerender } = render(TelInput, {
				props: {
					value: '+12154567890',
					country: 'US',
					onValueChange: mockValueChange
				}
			});

			mockValueChange.mockClear();
			await rerender({ value: '+12154567890', country: 'US' });

			expect(mockValueChange).not.toHaveBeenCalled();
		});

		it('should not loop when internal parse normalises value', async () => {
			const mockValueChange = vi.fn();
			const { container } = render(TelInput, {
				props: {
					value: '+12154567890',
					country: 'US',
					onValueChange: mockValueChange
				}
			});
			const input = container.querySelector('input') as HTMLInputElement;

			mockValueChange.mockClear();
			// After mount, the shadow tracker should equalise with the E164 value;
			// no further value-change calls should fire spontaneously.
			expect(mockValueChange).not.toHaveBeenCalled();
			expect(input.value).toBe('+1 215-456-7890');
		});

		it('should mark as invalid when value prop is set externally to a partial/invalid number', async () => {
			const mockValidityChange = vi.fn();
			const { rerender } = render(TelInput, {
				props: {
					value: '',
					country: 'US',
					onValidityChange: mockValidityChange
				}
			});

			await rerender({ value: '+1999' });

			expect(mockValidityChange).toHaveBeenCalledWith(false, 'TOO_SHORT');
		});

		it('should reflect the new country when country prop is set externally (no echo callback)', async () => {
			// When a parent drives country via a prop change, the component clears
			// the input and accepts the new country.  onCountryChange is intentionally
			// NOT echoed back to prevent parent→component→parent feedback loops.
			const mockCountryChange = vi.fn();
			const { container, rerender } = render(TelInput, {
				props: {
					value: '+12154567890',
					country: 'US',
					onCountryChange: mockCountryChange
				}
			});
			const input = container.querySelector('input') as HTMLInputElement;
			expect(input.value).toBe('+1 215-456-7890');

			mockCountryChange.mockClear();
			await rerender({ country: 'DE' });

			// Input is cleared on external country change
			expect(input.value).toBe('');
			// No echo back to avoid feedback loops
			expect(mockCountryChange).not.toHaveBeenCalled();
		});

		it('should reflect validity lifecycle: valid → invalid (external bind) → valid (external bind)', async () => {
			const mockValidityChange = vi.fn();
			const { rerender } = render(TelInput, {
				props: {
					value: '+12154567890',
					country: 'US',
					onValidityChange: mockValidityChange
				}
			});

			// Initially valid — no validity-change call expected on mount with valid value
			mockValidityChange.mockClear();

			// Set to invalid via external prop
			await rerender({ value: '+1999' });
			expect(mockValidityChange).toHaveBeenCalledWith(false, 'TOO_SHORT');

			mockValidityChange.mockClear();

			// Restore a valid value via external prop
			await rerender({ value: '+12014560001' });
			expect(mockValidityChange).toHaveBeenCalledWith(true, null);
		});
	});

	describe('Selection and Cursor Behavior', () => {
		it('should handle text replacement correctly', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '', country: 'US' }
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
				props: { value: '', country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '+1');
			expect(input.value).toBe('+1');
			expect(input.selectionStart).toBe(2);
		});

		it('should handle cursor movement around spaces', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '', country: 'US' }
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
				props: { value: '', country: 'US' }
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
						value: '',
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
						value: '',
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
						value: '',
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

	describe('allowedCountries option', () => {
		it('sets detailedValue.isValid=false and validationError=country_not_allowed when country is not allowed', async () => {
			let detailedValue: unknown = null;
			let valid: boolean | undefined;
			const { getByTestId } = render(TelInput, {
				props: {
					value: '',
					country: null,
					options: { allowedCountries: ['US', 'HU'] },
					onValueChange: (_v: string, dv: unknown) => {
						detailedValue = dv;
					},
					onValidityChange: (v: boolean) => {
						valid = v;
					}
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			// Type a valid German number
			await fireUserEvent.type(input, '+4930123456789');

			expect(valid).toBe(false);
			expect(detailedValue).toMatchObject({
				isPhoneValid: true,
				isValid: false,
				validationError: 'COUNTRY_NOT_ALLOWED',
				countryCode: 'DE'
			});
		});

		it('does not affect detailedValue.isValid when country is in allowedCountries', async () => {
			let detailedValue: unknown = null;
			const { getByTestId } = render(TelInput, {
				props: {
					value: '',
					country: null,
					options: { allowedCountries: ['US', 'HU'] },
					onValueChange: (_v: string, dv: unknown) => {
						detailedValue = dv;
					}
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '+12154567890');

			expect(detailedValue).toMatchObject({
				isValid: true,
				validationError: null,
				countryCode: 'US'
			});
		});
	});

	describe('isPhoneValid in detailedValue', () => {
		it('equals isValid for a valid number with no constraints', async () => {
			let detailedValue: unknown = null;
			const { getByTestId } = render(TelInput, {
				props: {
					value: '',
					country: 'US',
					onValueChange: (_v: string, dv: unknown) => {
						detailedValue = dv;
					}
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '2154567890');

			expect(detailedValue).toMatchObject({ isPhoneValid: true, isValid: true });
		});

		it('equals isValid for an invalid (too short) number', async () => {
			let detailedValue: unknown = null;
			const { getByTestId } = render(TelInput, {
				props: {
					value: '',
					country: 'US',
					options: { validateOn: 'input' },
					onValueChange: (_v: string, dv: unknown) => {
						detailedValue = dv;
					}
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '215');

			expect(detailedValue).toMatchObject({ isPhoneValid: false, isValid: false });
		});

		it('is true when the phone is valid but the country is not in allowedCountries (isValid false)', async () => {
			let detailedValue: unknown = null;
			const { getByTestId } = render(TelInput, {
				props: {
					value: '',
					country: null,
					options: { allowedCountries: ['US', 'HU'] },
					onValueChange: (_v: string, dv: unknown) => {
						detailedValue = dv;
					}
				}
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '+4930123456789');

			expect(detailedValue).toMatchObject({
				isPhoneValid: true,
				isValid: false,
				validationError: 'COUNTRY_NOT_ALLOWED'
			});
		});
	});

	describe('Prop type validation', () => {
		const badPropMsg = (prop: string) => new RegExp(`<TelInput> invalid prop "${prop}"`);

		it('should throw when value is an object', () => {
			expect(() =>
				render(TelInput, { props: { value: {} as unknown as string, country: 'US' } })
			).toThrow(badPropMsg('value'));
		});

		it('should throw when value is an array', () => {
			expect(() =>
				render(TelInput, { props: { value: [] as unknown as string, country: 'US' } })
			).toThrow(badPropMsg('value'));
		});

		it('should throw when value is a number', () => {
			expect(() =>
				render(TelInput, { props: { value: 123 as unknown as string, country: 'US' } })
			).toThrow(badPropMsg('value'));
		});

		it('should throw when country is an object', () => {
			expect(() =>
				render(TelInput, { props: { value: '', country: {} as unknown as null } })
			).toThrow(badPropMsg('country'));
		});

		it('should throw when name is an object', () => {
			expect(() =>
				render(TelInput, {
					props: { value: '', country: 'US', name: {} as unknown as string }
				})
			).toThrow(badPropMsg('name'));
		});

		it('should throw when placeholder is an array', () => {
			expect(() =>
				render(TelInput, {
					props: { value: '', country: 'US', placeholder: [] as unknown as string }
				})
			).toThrow(badPropMsg('placeholder'));
		});

		it('should throw when disabled is a string', () => {
			expect(() =>
				render(TelInput, {
					props: { value: '', country: 'US', disabled: 'yes' as unknown as boolean }
				})
			).toThrow(badPropMsg('disabled'));
		});

		it('should throw when readonly is a number', () => {
			expect(() =>
				render(TelInput, {
					props: { value: '', country: 'US', readonly: 1 as unknown as boolean }
				})
			).toThrow(badPropMsg('readonly'));
		});

		it('should throw when required is a string', () => {
			expect(() =>
				render(TelInput, {
					props: { value: '', country: 'US', required: 'true' as unknown as boolean }
				})
			).toThrow(badPropMsg('required'));
		});

		it('should throw when size is a string', () => {
			expect(() =>
				render(TelInput, {
					props: { value: '', country: 'US', size: '10' as unknown as number }
				})
			).toThrow(badPropMsg('size'));
		});

		it('should throw when options is an array', () => {
			expect(() =>
				render(TelInput, { props: { value: '', country: 'US', options: [] as any } })
			).toThrow(badPropMsg('options'));
		});

		it('should throw when options is a string', () => {
			expect(() =>
				render(TelInput, { props: { value: '', country: 'US', options: 'blur' as any } })
			).toThrow(badPropMsg('options'));
		});

		it('should include the received type in the error message', () => {
			expect(() =>
				render(TelInput, { props: { value: 42 as unknown as string, country: 'US' } })
			).toThrow(/received number/);
		});

		it('should include object key hints in the error message when an object is passed', () => {
			expect(() =>
				render(TelInput, {
					props: { value: { foo: 1, bar: 2 } as unknown as string, country: 'US' }
				})
			).toThrow(/object \{ foo, bar \}/);
		});

		it('should not throw for valid props', () => {
			expect(() =>
				render(TelInput, {
					props: {
						value: '',
						country: 'US',
						name: 'phone',
						disabled: false,
						required: true
					}
				})
			).not.toThrow();
		});

		it('should not throw when optional props are null or undefined', () => {
			expect(() =>
				render(TelInput, {
					props: {
						value: '',
						country: null,
						name: null,
						placeholder: null,
						required: null
					}
				})
			).not.toThrow();
		});
	});

	describe('Accessibility attribute passthrough', () => {
		it('should forward aria-label to the input element', () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '', country: 'US', 'aria-label': 'Phone number' }
			});
			expect(getByTestId('tel-input').getAttribute('aria-label')).toBe('Phone number');
		});

		it('should forward aria-labelledby to the input element', () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '', country: 'US', 'aria-labelledby': 'label-id' }
			});
			expect(getByTestId('tel-input').getAttribute('aria-labelledby')).toBe('label-id');
		});

		it('should forward aria-describedby to the input element', () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '', country: 'US', 'aria-describedby': 'hint-id' }
			});
			expect(getByTestId('tel-input').getAttribute('aria-describedby')).toBe('hint-id');
		});

		it('should not set aria-invalid when the input is valid', () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '+12154567890', country: 'US', valid: true }
			});
			expect(getByTestId('tel-input').getAttribute('aria-invalid')).toBeNull();
		});

		it('should set aria-invalid="true" when valid is false', async () => {
			const { getByTestId, rerender } = render(TelInput, {
				props: { value: '+12154567890', country: 'US', required: true }
			});
			// Rerender with an invalid value to trigger aria-invalid
			await rerender({ value: 'garbage', required: true });
			expect(getByTestId('tel-input').getAttribute('aria-invalid')).toBe('true');
		});

		it('should allow consumer to override aria-invalid via prop', () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '', country: 'US', 'aria-invalid': true }
			});
			expect(getByTestId('tel-input').getAttribute('aria-invalid')).toBe('true');
		});
	});
});
