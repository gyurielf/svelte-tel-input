interface GetCursorPositionProps {
	phoneBeforeInput: string;
	phoneAfterInput: string;
	phoneAfterFormatted: string;
	cursorPositionAfterInput: number;
	leftOffset?: number;
	deletion?: 'forward' | 'backward' | undefined;
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
	deletion
}: GetCursorPositionProps) => {
	if (cursorPositionAfterInput < leftOffset) {
		return leftOffset;
	}

	if (!phoneBeforeInput) {
		return phoneAfterFormatted.length;
	}

	let afterInputPointIndex: number | null = null;

	// iterate from right to left and get first digit char
	for (let index = cursorPositionAfterInput - 1; index >= 0; index -= 1) {
		if (isNumeric(phoneAfterInput[index])) {
			afterInputPointIndex = index;
			break;
		}
	}

	if (afterInputPointIndex === null) {
		for (let index = 0; index < phoneAfterInput.length; index += 1) {
			if (isNumeric(phoneAfterFormatted[index])) {
				return index;
			}
		}
		return phoneAfterInput.length;
	}

	// find "digit index" of new char (only digits count)
	let digitIndex = 0;
	for (let index = 0; index < afterInputPointIndex; index += 1) {
		if (isNumeric(phoneAfterInput[index])) {
			digitIndex += 1;
		}
	}

	// find cursor position by going over digits until we get digitIndex
	let cursorPosition = 0;
	let digitsCounter = 0;
	for (let index = 0; index < phoneAfterFormatted.length; index += 1) {
		cursorPosition += 1;

		if (isNumeric(phoneAfterFormatted[index])) {
			digitsCounter += 1;
		}

		if (digitsCounter >= digitIndex + 1) {
			break;
		}
	}

	// set cursor before next digit (jump over mask chars on the right side)
	if (deletion !== 'backward') {
		while (
			!isNumeric(phoneAfterFormatted[cursorPosition]) &&
			cursorPosition < phoneAfterFormatted.length
		) {
			cursorPosition += 1;
		}
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
// const setCursorPosition = (cursorPosition: number) => {
//     /**
//      * HACK: should set cursor on the next tick to make sure that the phone value is updated
//      * useTimeout with 0ms provides issues when two keys are pressed same time
//      */
//     Promise.resolve().then(() => {
//       // workaround for safari autofocus bug:
//       // Check if the input is focused before setting the cursor, otherwise safari sometimes autofocuses on setSelectionRange
//       if (
//         typeof window === 'undefined' ||
//         inputRef.current !== document?.activeElement
//       ) {
//         return;
//       }

//       inputRef.current?.setSelectionRange(cursorPosition, cursorPosition);
//     });
//   };
