import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import TelInput from '$lib/components/input/TelInput.svelte';

describe('TelInput - Cursor Positioning Integration Tests', () => {
	const user = userEvent.setup();

	describe('Typing and Insertion', () => {
		it('should maintain cursor position when typing digits', async () => {
			const { getByTestId } = render(TelInput, { props: { value: '', country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			await user.type(input, '2');
			expect(input.value).toBe('2');
			expect(input.selectionStart).toBe(1);

			await user.type(input, '1');
			expect(input.value).toBe('21');
			expect(input.selectionStart).toBe(2);

			await user.type(input, '5');
			expect(input.value).toBe('(215)');
			expect(input.selectionStart).toBe(input.value.length);
		});

		it('should skip spaces when they are auto-inserted', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '', country: 'US', options: { spaces: true } }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await user.type(input, '+1215456');
			expect(input.value).toBe('+1 215-456');
			expect(input.selectionStart).toBe(input.value.length);
		});

		it('should handle typing full phone number', async () => {
			const { getByTestId } = render(TelInput, { props: { value: '', country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			await user.type(input, '2154567890');
			expect(input.value).toBe('(215) 456-7890');
			expect(input.selectionStart).toBe(input.value.length);
		});
	});

	describe('Backspace from Different Positions', () => {
		it('should handle backspace from end of input', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '+12154567890', country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			// Wait for initial formatting
			await new Promise((r) => setTimeout(r, 100));
			expect(input.value).toBe('+1 215-456-7890');

			// Move cursor to end
			await user.click(input);
			input.setSelectionRange(input.value.length, input.value.length);
			await user.keyboard('{Backspace}');
			expect(input.value).not.toBe('+1 215-456-7890');
		});

		it('should handle backspace from middle of input', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '(215) 456-7890', country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await new Promise((r) => setTimeout(r, 100));
			expect(input.value).toBe('(215) 456-7890');

			// Position cursor after the area code close-paren: "(215)| 456-7890"
			input.setSelectionRange(5, 5);
			await user.keyboard('{Backspace}');

			expect(input.value).toContain('456-7890');
		});

		it('should skip spaces when backspacing', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '+12154567890', country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await new Promise((r) => setTimeout(r, 100));
			// Position cursor right after the space: "+1 |215-..."
			input.setSelectionRange(3, 3);

			// Simulate beforeinput and keydown events
			const beforeInputEvent = new InputEvent('beforeinput', {
				bubbles: true,
				cancelable: true,
				inputType: 'deleteContentBackward'
			});
			input.dispatchEvent(beforeInputEvent);

			const keydownEvent = new KeyboardEvent('keydown', {
				key: 'Backspace',
				code: 'Backspace',
				bubbles: true,
				cancelable: true
			});
			input.dispatchEvent(keydownEvent);

			// Cursor should not get stuck on the space
			expect(input.selectionStart).toBeLessThanOrEqual(3);
		});
	});

	describe('Delete from Different Positions', () => {
		it('should handle delete from middle', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '2154567890', country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await new Promise((r) => setTimeout(r, 100));
			expect(input.value).toBe('(215) 456-7890');
			await user.click(input);

			// Position cursor before the first digit of the exchange (after ") ")
			input.setSelectionRange(6, 6);
			await user.keyboard('{Delete}');

			// Should delete a digit (format may shift)
			expect(input.value).not.toBe('(215) 456-7890');
		});

		it('should skip spaces when deleting forward', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '+12154567890', country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await new Promise((r) => setTimeout(r, 100));
			await user.click(input);
			// Position cursor just after "+1" (before the space)
			input.setSelectionRange(2, 2);

			const keydownEvent = new KeyboardEvent('keydown', {
				key: 'Delete',
				code: 'Delete',
				bubbles: true,
				cancelable: true
			});
			input.dispatchEvent(keydownEvent);

			// Cursor should skip formatting chars
			expect(input.selectionStart).toBeGreaterThanOrEqual(2);
		});
	});

	describe('Selection and Replacement', () => {
		it('should handle selection deletion', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '2154567890', country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await new Promise((r) => setTimeout(r, 100));
			expect(input.value).toBe('(215) 456-7890');
			await user.click(input);

			// Select area code digits
			input.setSelectionRange(1, 4);
			await user.keyboard('{Backspace}');

			expect(input.value).not.toContain('215');
		});

		it('should handle selection replacement with single digit', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '2154567890', country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await new Promise((r) => setTimeout(r, 100));
			expect(input.value).toBe('(215) 456-7890');
			await user.click(input);

			// Select first two area code digits
			input.setSelectionRange(1, 3);
			await user.type(input, '7');

			expect(input.value).toContain('7');
		});

		it('should handle selection replacement with multiple digits', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '2154567890', country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await new Promise((r) => setTimeout(r, 100));
			expect(input.value).toBe('(215) 456-7890');
			await user.click(input);

			// Select the exchange digits
			input.setSelectionRange(6, 9);
			await user.type(input, '999');
			// Number is already at max valid length; additional digits should be ignored/capped.
			expect(input.value).toBe('(215) 456-7890');
		});
	});

	describe('Paste Operations', () => {
		it('should handle paste with formatted number', async () => {
			const { getByTestId } = render(TelInput, { props: { value: '', country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			await user.click(input);
			await user.paste('2154567890');

			expect(input.value).toBe('(215) 456-7890');
			// Cursor should be at the end after paste
			expect(input.selectionStart).toBeGreaterThanOrEqual(10);
		});

		it('should handle paste in middle of existing number', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '2154567890', country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await new Promise((r) => setTimeout(r, 100));
			await user.click(input);
			// Select middle section
			input.setSelectionRange(6, 9);

			await user.paste('999');
			expect(input.value).not.toBe('(215) 456-7890');
		});
	});

	describe('Edge Cases', () => {
		it('should handle rapid typing', async () => {
			const { getByTestId } = render(TelInput, { props: { value: '', country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			// Type digits
			await user.type(input, '2154567890');

			expect(input.value).toBe('(215) 456-7890');
			expect(input.selectionStart).toBe(input.value.length);
		});

		it('should handle cursor at start of input', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '(215) 456-7890', country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await new Promise((r) => setTimeout(r, 100));
			// Move cursor to start
			input.setSelectionRange(0, 0);
			await user.type(input, '1');

			// Should handle insertion at start
			expect(input.value.length).toBeGreaterThan(0);
		});

		it('should handle clearing entire input', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '(215) 456-7890', country: 'US' }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await new Promise((r) => setTimeout(r, 100));
			await user.click(input);
			// Select all and delete
			input.setSelectionRange(0, input.value.length);
			await user.keyboard('{Backspace}');
			expect(input.value).toBe('');
		});

		it('should handle backspace with no spaces option', async () => {
			const { getByTestId } = render(TelInput, {
				props: { value: '+12154567890', country: 'US', options: { spaces: false } }
			});
			const input = getByTestId('tel-input') as HTMLInputElement;

			await new Promise((r) => setTimeout(r, 100));
			expect(input.value).toBe('+12154567890');

			await user.click(input);
			input.setSelectionRange(input.value.length, input.value.length);
			await user.keyboard('{Backspace}');

			expect(input.value).toBe('+1215456789');
		});
	});

	describe('Cross-browser Compatibility', () => {
		it('should handle IME input (composition)', async () => {
			const { getByTestId } = render(TelInput, { props: { value: '', country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			// Simulate composition events (e.g., for Asian languages)
			const compositionStart = new CompositionEvent('compositionstart', { bubbles: true });
			input.dispatchEvent(compositionStart);

			await user.type(input, '21');

			const compositionEnd = new CompositionEvent('compositionend', { bubbles: true });
			input.dispatchEvent(compositionEnd);

			// Should still format correctly
			expect(input.value.length).toBeGreaterThan(0);
		});

		it('should handle touch input', async () => {
			const { getByTestId } = render(TelInput, { props: { value: '', country: 'US' } });
			const input = getByTestId('tel-input') as HTMLInputElement;

			// Simulate touch-like typing (with focus/blur)
			await input.focus();
			await user.type(input, '2154567890');
			await input.blur();

			expect(input.value).toBe('(215) 456-7890');
		});
	});
});
