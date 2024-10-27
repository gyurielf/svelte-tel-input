import { inputParser } from '$lib/index.js';
import type { E164Number } from 'libphonenumber-js';
import { setCursorPosition } from './cursorPosition';
import { isMacOS } from '../helpers';
export const telInputAction = (
	node: HTMLInputElement,
	{
		handler,
		spaces
	}: {
		handler: (val: string) => void;
		spaces: boolean;
		value: E164Number | null;
	}
) => {
	registerListeners(node, { handler, spaces });
	return {
		update(params: {
			handler: (val: string) => void;
			spaces: boolean;
			value: E164Number | null;
		}) {
			if (params.value === null || params.value === '') {
				node.value = '';
			}
		},
		destroy() {
			node.onkeydown = null;
			node.oninput = null;
			// node.onfocus = null;
		}
	};
};

const registerListeners = (
	el: HTMLInputElement,
	{
		handler,
		spaces
	}: {
		handler: (input: E164Number, val?: E164Number | null) => void;
		spaces: boolean;
	}
) => {
	el.onkeydown = (e: KeyboardEvent) => {
		onKeyDown(e);
	};

	el.oninput = (e: Event) => {
		onInput(e, handler, spaces);
	};

	// el.onfocus = (e: Event) => {
	// 	onFocus(e, opt);
	// };
};

const onInput = (
	event: Event,
	handler: (input: E164Number, val?: E164Number | null) => void,
	spaces: boolean
) => {
	const node = event.currentTarget as HTMLInputElement | null;

	if (node && node.contains(event.target as HTMLInputElement)) {
		// const newCursorPosition = getCursorPosition({
		// 	cursorPositionAfterInput,
		// 	phoneBeforeInput,
		// 	phoneAfterInput: userInput,
		// 	phoneAfterFormatted: newInputValue,
		// 	leftOffset: forceDialCode
		// 		? prefix.length + country.dialCode.length + charAfterDialCode.length
		// 		: 0,
		// 	deletion
		// });

		// const inputType: string | undefined = event.inputType;
		// const deletion = getDeletionType(inputType);
		// const isInserted = !!inputType?.startsWith('insertFrom');
		// const isTyped = inputType === 'insertText';

		// const eventData: string | null | undefined = event?.data;
		// Last char that user typed on a keyboard
		// const lastTypedChar = eventData || undefined;
		const inputValue = (event.target as HTMLInputElement).value;
		const cursorPositionAfterInput = node.selectionStart ?? 0;

		// // ignore user input if typed non-digit character
		// if (
		// 	isTyped &&
		// 	!isNumeric(lastTypedChar) &&
		// 	// allow type prefix when input value is empty
		// 	inputValue !== prefix
		// ) {
		// 	return {
		// 		inputValue: phoneBeforeInput,
		// 		phone: toE164({
		// 			phone: disableDialCodeAndPrefix
		// 				? `${country.dialCode}${phoneBeforeInput}`
		// 				: phoneBeforeInput,
		// 			prefix
		// 		}),
		// 		cursorPosition: cursorPositionAfterInput - (lastTypedChar?.length ?? 0),
		// 		country
		// 	};
		// }

		// // forceDialCode: ignore dial code change (only if prefixed phone was not inserted)
		// if (
		// 	forceDialCode &&
		// 	// dial code has been changed
		// 	!userInput.startsWith(`${prefix}${country.dialCode}`) &&
		// 	// was not inserted with ctrl+v
		// 	!isInserted
		// ) {
		// 	const inputValue = userInput
		// 		? phoneBeforeInput
		// 		: `${prefix}${country.dialCode}${charAfterDialCode}`;

		// 	return {
		// 		inputValue,
		// 		phone: toE164({ phone: inputValue, prefix }),
		// 		cursorPosition: prefix.length + country.dialCode.length + charAfterDialCode.length, // set cursor position after dial code
		// 		country
		// 	};
		// }

		const formattedInput = inputParser(inputValue, {
			allowSpaces: spaces
		});

		const currentLength = node.value.length;
		node.value = formattedInput;
		if (currentLength < formattedInput.length) {
			setCursorPosition(node, formattedInput.length);
		} else {
			setCursorPosition(node, cursorPositionAfterInput);
		}
		node.value = formattedInput;
		handler(formattedInput);
	}
	// const el = e.currentTarget as HTMLInputElement;
	// // https://www.w3.org/TR/input-events-1/#interface-InputEvent-Attributes
	// if (el && el.contains(e.target as HTMLInputElement)) {
	// 	// TODO remove spaces
	// 	console.warn(spaces);

	// 	// console.log('formattedInput', el.value);
	// 	// const formattedInput = inputParser(el.value, {
	// 	// 	allowSpaces: spaces
	// 	// });
	// 	const cursorPositionAfterInput = el.selectionStart || 0;
	// 	// let positionFromEnd = el.value.length - (el.selectionEnd || 0);

	// 	const { formattedNumber, isValid } = handleParsePhoneNumber(el.value as E164Number);
	// 	kaka.set(isValid);
	// 	// if (formattedInput === el.value) return; // prevent unnecessary updates

	// 	// positionFromEnd = el.value.length - positionFromEnd;
	// 	const currentLength = el.value.length;
	// 	el.value = formattedNumber;
	// 	if (currentLength < formattedNumber.length) {
	// 		setCursorPosition(el, formattedNumber.length);
	// 	} else {
	// 		setCursorPosition(el, cursorPositionAfterInput);
	// 	}

	// 	// setCursorPosition(el, positionFromEnd);

	// 	handler(formattedNumber as E164Number);
	// }
};

const onKeyDown = (e: KeyboardEvent) => {
	if (!e.key) return;

	const ctrlPressed = e.ctrlKey;
	const metaPressed = e.metaKey;
	const zPressed = e.key.toLowerCase() === 'z';
	if (!zPressed) return;
	if (isMacOS()) {
		// command+z on macOS
		if (!metaPressed) return;
	} else {
		// ctrl+z on non-macOS
		if (!ctrlPressed) return;
	}

	const el = e.currentTarget as HTMLInputElement;
	const backspacePressed = e.code === 'Backspace';
	const deletePressed = e.code === 'Delete';

	// Skip the ` `(space) separators on deletion before the input being handled.
	if (deletePressed && el.selectionStart && el.value[el.selectionStart] === ' ') {
		const positionFromEnd = el.value.length - (el.value.length - (el.selectionEnd || 0));
		setCursorPosition(el, positionFromEnd + 1);
	}
	if (backspacePressed && el.selectionStart && el.value[el.selectionStart - 1] === ' ') {
		const positionFromEnd = el.value.length - (el.value.length - (el.selectionEnd || 0));
		setCursorPosition(el, positionFromEnd - 1);
	}
};
