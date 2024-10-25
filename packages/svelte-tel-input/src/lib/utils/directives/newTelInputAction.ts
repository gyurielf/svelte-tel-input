// // nmewTelInput

// // import { inspectAllowedChars, inputParser } from '$lib/index.js';
// import type { E164Number } from 'libphonenumber-js';
// import { getValidatedInputElement, isMacOS } from '$lib/utils/helpers.js';
// import { setCursorPosition } from './cursorPosition.js';
// import { handleParsePhoneNumber } from '$lib/components/input/utils.js';
// import { writable } from 'svelte/store';
// const kaka = writable(false);

// const onInput = (
// 	e: Event,
// 	handler: (input: E164Number, val?: E164Number | null) => void,
// 	spaces: boolean
// ) => {
// 	const el = e.currentTarget as HTMLInputElement;
// 	// https://www.w3.org/TR/input-events-1/#interface-InputEvent-Attributes
// 	if (el && el.contains(e.target as HTMLInputElement)) {
// 		// TODO remove spaces
// 		console.warn(spaces);

// 		// console.log('formattedInput', el.value);
// 		// const formattedInput = inputParser(el.value, {
// 		// 	allowSpaces: spaces
// 		// });
// 		const cursorPositionAfterInput = el.selectionStart || 0;
// 		// let positionFromEnd = el.value.length - (el.selectionEnd || 0);

// 		const { formattedNumber, isValid } = handleParsePhoneNumber(el.value as E164Number);
// 		kaka.set(isValid);
// 		// if (formattedInput === el.value) return; // prevent unnecessary updates

// 		// positionFromEnd = el.value.length - positionFromEnd;
// 		const currentLength = el.value.length;
// 		el.value = formattedNumber;
// 		if (currentLength < formattedNumber.length) {
// 			setCursorPosition(el, formattedNumber.length);
// 		} else {
// 			setCursorPosition(el, cursorPositionAfterInput);
// 		}

// 		// setCursorPosition(el, positionFromEnd);

// 		handler(formattedNumber as E164Number);
// 	}
// };

// const onKeyDown = (e: KeyboardEvent) => {
// 	if (!e.key) return;
// 	const ctrlPressed = e.ctrlKey;
// 	const metaPressed = e.metaKey;
// 	const zPressed = e.key.toLowerCase() === 'z';
// 	if (!zPressed) return;
// 	if (isMacOS()) {
// 		// command+z on macOS
// 		if (!metaPressed) return;
// 	} else {
// 		// ctrl+z on non-macOS
// 		if (!ctrlPressed) return;
// 	}

// 	const el = e.currentTarget as HTMLInputElement;
// 	const backspacePressed = e.code === 'Backspace';
// 	const deletePressed = e.code === 'Delete';

// 	// Skip the ` `(space) separators on deletion before the input being handled.
// 	if (deletePressed && el.selectionStart && el.value[el.selectionStart] === ' ') {
// 		const positionFromEnd = el.value.length - (el.value.length - (el.selectionEnd || 0));
// 		setCursorPosition(el, positionFromEnd + 1);
// 	}
// 	if (backspacePressed && el.selectionStart && el.value[el.selectionStart - 1] === ' ') {
// 		const positionFromEnd = el.value.length - (el.value.length - (el.selectionEnd || 0));
// 		setCursorPosition(el, positionFromEnd - 1);
// 	}
// };

// const registerListeners = (
// 	el: HTMLInputElement,
// 	{
// 		handler,
// 		spaces
// 	}: {
// 		handler: (input: E164Number, val?: E164Number | null) => void;
// 		spaces: boolean;
// 	}
// ) => {
// 	el.onkeydown = (e: KeyboardEvent) => {
// 		onKeyDown(e);
// 	};

// 	el.oninput = (e: Event) => {
// 		onInput(e, handler, spaces);
// 	};

// 	// el.onfocus = (e: Event) => {
// 	// 	onFocus(e, opt);
// 	// };
// };

// export const telInputAction = (
// 	node: HTMLInputElement,
// 	{
// 		handler,
// 		spaces
// 	}: {
// 		handler: (input: E164Number, val?: E164Number | null) => void;
// 		spaces: boolean;
// 		value?: E164Number | null;
// 	}
// ) => {
// 	node = getValidatedInputElement(node);
// 	registerListeners(node, { handler, spaces });
// 	// setValue(node, opt, 'directive mounted');

// 	return {
// 		// Handle the config updates reactive.
// 		update(params: {
// 			handler: (val: string) => void;
// 			spaces: boolean;
// 			value?: E164Number | null;
// 		}) {
// 			if (params.value === null || params.value === '') {
// 				node.value = '';
// 			}
// 		},
// 		// Cleaning up after the destroy.
// 		destroy() {
// 			node.onkeydown = null;
// 			node.oninput = null;
// 			node.onfocus = null;
// 		}
// 	};
// };
