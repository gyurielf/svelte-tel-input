interface GetCursorPositionProps {
	phoneBeforeInput: string;
	phoneAfterInput: string;
	phoneAfterFormatted: string;
	cursorPositionAfterInput: number;
	leftOffset?: number;
	deletion?: 'forward' | 'backward' | undefined;
	isReplacement?: boolean;
}

export const isNumeric = (str?: string) => {
	if (!str) return false;
	return /^\d+$/.test(str);
};

export const getCursorPosition = ({
	phoneBeforeInput,
	phoneAfterInput,
	phoneAfterFormatted,
	cursorPositionAfterInput,
	leftOffset = 0,
	deletion,
	isReplacement
}: GetCursorPositionProps) => {
	if (cursorPositionAfterInput < leftOffset) {
		return leftOffset;
	}

	if (!phoneBeforeInput) {
		return phoneAfterFormatted.length;
	}

	let afterInputPointIndex: number | null = null;

	// Find last digit before cursor
	for (let index = cursorPositionAfterInput - 1; index >= 0; index--) {
		if (isNumeric(phoneAfterInput[index])) {
			afterInputPointIndex = index;
			break;
		}
	}

	if (afterInputPointIndex === null) {
		for (let index = 0; index < phoneAfterInput.length; index++) {
			if (isNumeric(phoneAfterFormatted[index])) {
				return index;
			}
		}
		return phoneAfterInput.length;
	}

	// Count digits up to cursor
	let digitIndex = 0;
	for (let index = 0; index <= afterInputPointIndex; index++) {
		if (isNumeric(phoneAfterInput[index])) {
			digitIndex++;
		}
	}

	// Find position in formatted string
	let cursorPosition = 0;
	let digitsCounter = 0;

	// For replacements, we want to position after the last replaced digit
	if (isReplacement) {
		for (let index = 0; index < phoneAfterFormatted.length; index++) {
			if (isNumeric(phoneAfterFormatted[index])) {
				digitsCounter++;
				if (digitsCounter === digitIndex + 1) {
					// +1 to move past the replaced digit
					cursorPosition = index + 1;
					break;
				}
			}
		}
		// Skip spaces after replacement
		while (phoneAfterFormatted[cursorPosition] === ' ') {
			cursorPosition++;
		}
		return cursorPosition;
	}

	// Key change: Track the last non-space position
	let lastNonSpacePos = 0;

	for (let index = 0; index < phoneAfterFormatted.length; index++) {
		if (phoneAfterFormatted[index] !== ' ') {
			lastNonSpacePos = index;
		}

		if (isNumeric(phoneAfterFormatted[index])) {
			digitsCounter++;
			if (digitsCounter === digitIndex) {
				cursorPosition = index + 1;
				break;
			}
		}
	}

	// Don't move cursor if we're at a non-space position
	if (phoneAfterFormatted[cursorPosition] !== ' ') {
		return cursorPosition;
	}

	// If we landed on a space and it's a forward deletion,
	// stay before the space
	if (deletion === 'forward') {
		return lastNonSpacePos + 1;
	}

	return cursorPosition;
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
