import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import TelInput from '$lib/components/input/TelInput.svelte';

describe('TelInput Component', () => {
	const fireUserEvent = userEvent.setup();

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

			await fireUserEvent.type(input, '36301234567');
			expect(input.value).toBe('+36 30 123 4567');
		});

		it('should maintain cursor position after typing', async () => {
			const { getByTestId } = render(TelInput, { props: { value: null, country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '36301');
			expect(input.value).toBe('+36 30 1');
			expect(input.selectionStart).toBe(8);
		});
	});

	describe('Deletion Behavior', () => {
		it('should handle backspace correctly', async () => {
			const { getByTestId } = render(TelInput, { props: { value: null, country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '36301234567');
			expect(input.value).toBe('+36 30 123 4567');

			await fireUserEvent.type(input, '{Backspace}');
			expect(input.value).toBe('+36 30 123 456');
		});

		it('should handle delete key correctly', async () => {
			const { getByTestId } = render(TelInput, { props: { value: null, country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '36301234567');
			expect(input.value).toBe('+36 30 123 4567');
			input.setSelectionRange(7, 7); // Position cursor before '1' in '123'

			await fireUserEvent.keyboard('{Delete}');
			expect(input.value).toBe('+36 30 234 567');
		});

		it('should handle selection deletion', async () => {
			const { getByTestId } = render(TelInput, { props: { value: null, country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '36301234567');
			expect(input.value).toBe('+36 30 123 4567');
			input.setSelectionRange(4, 9); // Select "30 12"

			await fireUserEvent.keyboard('{Backspace}');
			expect(input.value).toBe('+36 34 567');
		});
	});

	describe.skip('Event Handling', () => {
		it('should emit updateValue event', async () => {
			const mockUpdateValue = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: { value: null, country: 'US', onUpdateValue: mockUpdateValue }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '36301234567');

			expect(mockUpdateValue).toHaveBeenCalled();
			expect(
				mockUpdateValue.mock.calls[mockUpdateValue.mock.calls.length - 1][0].detail
			).toBe('+36301234567');
		});

		it('should emit updateValid event', async () => {
			const mockUpdateValid = vi.fn();
			const { container } = render(TelInput, {
				props: { value: null, onUpdateValid: mockUpdateValid }
			});
			const input = container.querySelector('input') as HTMLInputElement;

			await fireUserEvent.type(input, '36301234567');

			expect(mockUpdateValid).toHaveBeenCalledWith(
				expect.objectContaining({
					detail: true
				})
			);
		});
	});

	describe('Country Detection', () => {
		it('should detect country from input', async () => {
			const mockUpdateCountry = vi.fn();
			const { getByTestId } = render(TelInput, {
				props: { value: null, country: 'US', onUpdateCountry: mockUpdateCountry }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '36301234567');

			expect(mockUpdateCountry).toHaveBeenNthCalledWith(1, 'GR');
			expect(mockUpdateCountry).toHaveBeenNthCalledWith(2, 'HU');
		});
	});

	describe('Formatting', () => {
		it('should format number with spaces when spaces option is true', async () => {
			const { container } = render(TelInput, {
				props: { options: { spaces: true }, value: null }
			});
			const input = container.querySelector('input') as HTMLInputElement;

			await fireUserEvent.type(input, '36301234567');
			expect(input.value).toBe('+36 30 123 4567');
		});

		it('should format number without spaces when spaces option is false', async () => {
			const { container } = render(TelInput, {
				props: { options: { spaces: false }, value: null }
			});
			const input = container.querySelector('input') as HTMLInputElement;

			await fireUserEvent.type(input, '36301234567');
			expect(input.value).toBe('+36301234567');
		});
	});

	describe('Selection and Cursor Behavior', () => {
		it.only('should handle text replacement correctly', async () => {
			const { getByTestId } = render(TelInput, { props: { value: null, country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '36301234567');
			expect(input.value).toBe('+36 45 345 67');

			input.setSelectionRange(4, 9); // Select "30 12"
			await fireUserEvent.keyboard('4');
			await fireUserEvent.keyboard('5');

			expect(input.value).toBe('+36 45 345 67');
		});

		it('should maintain cursor position after space insertion', async () => {
			const { getByTestId } = render(TelInput, { props: { value: null, country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '363');
			expect(input.value).toBe('+36 3');
			expect(input.selectionStart).toBe(5);
		});

		it('should handle cursor movement around spaces', async () => {
			const { getByTestId } = render(TelInput, { props: { value: null, country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			await fireUserEvent.type(input, '36301');
			input.setSelectionRange(3, 3); // Place cursor before space
			await fireUserEvent.keyboard('{ArrowRight}');

			expect(input.selectionStart).toBe(5);
		});
	});
});
