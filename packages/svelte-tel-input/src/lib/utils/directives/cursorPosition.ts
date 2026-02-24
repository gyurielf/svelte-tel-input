interface CalculateCursorPositionProps {
	beforeValue: string;
	beforeCursor: number;
	beforeSelection: number;
	afterInputValue?: string;
	afterInputCursor?: number;
	afterValue: string;
	currentCursor?: number;
	isDeletion: boolean;
	deletionDirection: 'forward' | 'backward' | null;
	hasSelection: boolean;
}

/**
 * Check if a character is a digit
 */
export const isDigit = (char?: string): boolean => {
	if (!char) return false;
	return /^\d$/.test(char);
};

const isRelevantChar = (char?: string): boolean => {
	if (!char) return false;
	return char === '+' || isDigit(char);
};

/**
 * Count digits up to a position in a string
 */
const countRelevantUpTo = (str: string, position: number): number => {
	let count = 0;
	for (let i = 0; i < position && i < str.length; i++) {
		if (isRelevantChar(str[i])) {
			count++;
		}
	}
	return count;
};

/**
 * Find position of nth digit in a string
 */
const findNthRelevantPosition = (str: string, n: number, afterPosition = false): number => {
	let count = 0;
	for (let i = 0; i < str.length; i++) {
		if (isRelevantChar(str[i])) {
			count++;
			if (count === n) {
				return afterPosition ? i + 1 : i;
			}
		}
	}
	return str.length;
};

const skipFormattingChars = (str: string, pos: number): number => {
	let p = pos;
	while (p < str.length && str[p] && !isRelevantChar(str[p])) {
		p++;
	}
	return p;
};

/**
 * Calculate the correct cursor position after input formatting
 */
export const calculateCursorPosition = ({
	beforeValue,
	beforeCursor,
	afterInputValue,
	afterInputCursor,
	afterValue,
	currentCursor,
	isDeletion,
	deletionDirection,
	hasSelection
}: CalculateCursorPositionProps): number => {
	// Handle empty cases
	if (!afterValue) return 0;
	if (!beforeValue) return afterValue.length;

	// Count relevant chars (+ and digits) before cursor in the original value
	const digitsBefore = countRelevantUpTo(beforeValue, beforeCursor);

	// Handle deletion
	if (isDeletion) {
		if (hasSelection) {
			// Selection was deleted - position after the remaining digits before selection
			const targetDigit = countRelevantUpTo(beforeValue, beforeCursor);
			const newPos = findNthRelevantPosition(afterValue, targetDigit, true);

			return Math.min(skipFormattingChars(afterValue, newPos), afterValue.length);
		}

		if (deletionDirection === 'backward') {
			// Backspace - we deleted one digit, so position after the previous digit
			// If we had 3 digits before cursor, now we should have 2, position after digit 2
			const targetDigit = Math.max(0, digitsBefore - 1);

			if (targetDigit === 0) {
				// We deleted the first digit or everything before
				return 0;
			}

			// Position right after the target digit (don't skip spaces for backspace)
			const newPos = findNthRelevantPosition(afterValue, targetDigit, true);
			return Math.min(skipFormattingChars(afterValue, newPos), afterValue.length);
		} else {
			// Forward delete - position stays at the same digit count
			// If we had 3 digits before cursor, position after digit 3
			const targetDigit = digitsBefore;

			if (targetDigit === 0) {
				return 0;
			}

			// Position right after the target digit (don't skip spaces for forward delete)
			const newPos = findNthRelevantPosition(afterValue, targetDigit, true);
			return Math.min(skipFormattingChars(afterValue, newPos), afterValue.length);
		}
	}

	// Handle insertion/replacement
	// Find where we are in terms of relevant chars (+ and digits) in the *unformatted* value
	// as it exists right after the browser applied the edit.
	// (Using a cursor index from one string against another is a common source of caret drift.)
	const inputValueForCursor = afterInputValue ?? afterValue;
	const inputCursorForCursor = afterInputCursor ?? currentCursor ?? 0;
	const digitsAfter = countRelevantUpTo(inputValueForCursor, inputCursorForCursor);

	// If we added digits, position after the last one added
	if (digitsAfter > digitsBefore) {
		const newPos = findNthRelevantPosition(afterValue, digitsAfter, true);
		return Math.min(skipFormattingChars(afterValue, newPos), afterValue.length);
	}

	// Default: try to maintain relative position
	const newPos = findNthRelevantPosition(afterValue, digitsBefore, true);
	return Math.min(skipFormattingChars(afterValue, newPos), afterValue.length);
};

// Legacy exports for backward compatibility
interface GetCursorPositionProps {
	phoneBeforeInput: string;
	phoneAfterInput: string;
	phoneAfterFormatted: string;
	cursorPositionAfterInput: number;
	leftOffset?: number;
	deletion?: 'forward' | 'backward' | undefined;
	isReplacement?: boolean;
}

export const isNumeric = isDigit;

export const getCursorPosition = (props: GetCursorPositionProps): number => {
	return calculateCursorPosition({
		beforeValue: props.phoneBeforeInput,
		beforeCursor: props.cursorPositionAfterInput,
		beforeSelection: 0,
		afterInputValue: props.phoneAfterInput,
		afterInputCursor: props.cursorPositionAfterInput,
		afterValue: props.phoneAfterFormatted,
		isDeletion: !!props.deletion,
		deletionDirection: props.deletion || null,
		hasSelection: false
	});
};

export const setCursorPosition = (node: HTMLInputElement, cursorPosition: number) => {
	/**
	 * HACK: should set cursor on the next tick to make sure that the phone value is updated
	 * useTimeout with 0ms provides issues when two keys are pressed same time
	 */
	Promise.resolve().then(() => {
		// workaround for safari autofocus bug:
		// Check if the input is focused before setting the cursor, otherwise safari sometimes autofocuses on setSelectionRange
		if (typeof window === 'undefined' || node !== document?.activeElement) {
			return;
		}
		node?.setSelectionRange(cursorPosition, cursorPosition);
	});
};
