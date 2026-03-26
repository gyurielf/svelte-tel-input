import type { CountryCode } from '$lib/types/index.js';
import { getCountry } from '$lib/utils/countryHelpers.js';
import { parsePhoneInput } from '$lib/utils/helpers.js';
import { calculateCursorPosition } from '../cursorPosition.js';

interface TelInputActionParams {
	handler: (val: string) => void;
	spaces: boolean;
	country: CountryCode | null | undefined;
	value: string;
}

interface InputState {
	beforeValue: string;
	beforeCursor: number;
	beforeSelection: number;
}

let inputState: InputState | null = null;

const normalizeUserInput = (input: string): string => {
	let value = '';
	for (let i = 0; i < input.length; i++) {
		const ch = input[i];
		if (ch >= '0' && ch <= '9') {
			value += ch;
			continue;
		}
		if (ch === '+' && value.length === 0) {
			value += ch;
		}
	}
	return value;
};

const isFormattingChar = (ch?: string): boolean => {
	if (!ch) return false;
	return !/[0-9+]/.test(ch);
};

export const telInputAction = (node: HTMLInputElement, params: TelInputActionParams) => {
	registerListeners(node, params);
	return {
		update(params: TelInputActionParams) {
			registerListeners(node, params);
			if (params.value === null || params.value === '') {
				node.value = '';
			}
		},
		destroy() {
			node.onkeydown = null;
			node.onbeforeinput = null;
			node.oninput = null;
			inputState = null;
		}
	};
};

const registerListeners = (el: HTMLInputElement, params: TelInputActionParams) => {
	/**
	 * Capture state before input changes
	 */
	el.onbeforeinput = (e: InputEvent) => {
		inputState = {
			beforeValue: el.value,
			beforeCursor: el.selectionStart ?? 0,
			beforeSelection: (el.selectionEnd ?? 0) - (el.selectionStart ?? 0)
		};

		// Handle formatting-char deletion - skip over spaces, hyphens, parentheses, etc.
		const isBackspace = e.inputType === 'deleteContentBackward';
		const isDelete = e.inputType === 'deleteContentForward';

		if (isBackspace && inputState.beforeSelection === 0) {
			const charBefore = el.value[inputState.beforeCursor - 1];
			if (isFormattingChar(charBefore)) {
				e.preventDefault();
				const newPos = inputState.beforeCursor - 1;
				el.setSelectionRange(newPos, newPos);
			}
		}

		if (isDelete && inputState.beforeSelection === 0) {
			const charAfter = el.value[inputState.beforeCursor];
			if (isFormattingChar(charAfter)) {
				e.preventDefault();
				const newPos = inputState.beforeCursor + 1;
				el.setSelectionRange(newPos, newPos);
			}
		}
	};

	/**
	 * Handle input changes and cursor positioning
	 */
	el.oninput = (e: Event) => {
		onInput(e as InputEvent, params, el);
	};

	/**
	 * Handle special keys
	 */
	el.onkeydown = (e: KeyboardEvent) => {
		onKeyDown(e, el);
	};
};

/**
 * Determine if this is a deletion operation
 */
const isDeletion = (inputType?: string): boolean => {
	return inputType?.toLowerCase().includes('delete') ?? false;
};

/**
 * Determine deletion direction
 */
const getDeletionDirection = (inputType?: string): 'forward' | 'backward' | null => {
	if (!isDeletion(inputType)) return null;
	return inputType?.toLowerCase().includes('forward') ? 'forward' : 'backward';
};

/**
 * Main input handler
 */
const onInput = (event: InputEvent, params: TelInputActionParams, node: HTMLInputElement) => {
	if (!node?.contains(event.target as HTMLInputElement)) return;

	const state = inputState || {
		beforeValue: '',
		beforeCursor: 0,
		beforeSelection: 0
	};

	const userInput = node.value;
	const currentCursor = node.selectionStart ?? 0;

	const normalized = normalizeUserInput(userInput);
	const countryObj = params.country
		? getCountry({ field: 'iso2', value: params.country })
		: undefined;
	const details = parsePhoneInput(normalized, countryObj);

	// Display formatting:
	// - When `spaces` is true, show formatted-as-you-type output (national or intl)
	// - When `spaces` is false, show unformatted normalized input (keeps optional leading '+')
	const formattedInput = params.spaces ? (details.formattedNumber ?? normalized) : normalized;

	// Calculate new cursor position
	const deletionDir = getDeletionDirection(event.inputType);
	const hasSelection = state.beforeSelection > 0;

	const newPosition = calculateCursorPosition({
		beforeValue: state.beforeValue,
		beforeCursor: state.beforeCursor,
		beforeSelection: state.beforeSelection,
		afterInputValue: userInput,
		afterInputCursor: currentCursor,
		afterValue: formattedInput,
		isDeletion: isDeletion(event.inputType),
		deletionDirection: deletionDir,
		hasSelection
	});

	// Update value and cursor
	node.value = formattedInput;
	node.setSelectionRange(newPosition, newPosition);

	// Notify parent component
	params.handler(formattedInput);

	// Clear state
	inputState = null;
};

/**
 * Handle special keyboard events
 */
const onKeyDown = (e: KeyboardEvent, el: HTMLInputElement) => {
	if (!e.key) return;

	const isBackspace = e.code === 'Backspace' || e.key === 'Backspace';
	const isDelete = e.code === 'Delete' || e.key === 'Delete';

	if (!isBackspace && !isDelete) return;

	const cursor = el.selectionStart ?? 0;
	const hasSelection = (el.selectionEnd ?? 0) - cursor > 0;

	// Don't interfere if there's a selection
	if (hasSelection) return;

	// Skip over formatting characters on backspace/delete (spaces, hyphens, parentheses, etc).
	if (isBackspace && cursor > 0) {
		const charBefore = el.value[cursor - 1];
		if (isFormattingChar(charBefore)) {
			e.preventDefault();
			let newPos = cursor - 1;
			while (newPos > 0 && isFormattingChar(el.value[newPos - 1])) {
				newPos--;
			}
			el.setSelectionRange(newPos, newPos);
		}
		return;
	}

	if (isDelete && cursor < el.value.length) {
		const charAfter = el.value[cursor];
		if (isFormattingChar(charAfter)) {
			e.preventDefault();
			let newPos = cursor + 1;
			while (newPos < el.value.length && isFormattingChar(el.value[newPos])) {
				newPos++;
			}
			el.setSelectionRange(newPos, newPos);
		}
	}
};
