import { inputParser } from '$lib/index.js';
import type { E164Number } from 'libphonenumber-js';
import { getCursorPosition, setCursorPosition } from './cursorPosition.js';
import { tick } from 'svelte';

interface TelInputActionParams {
	handler: (val: string) => void;
	prevValue: E164Number | null;
	spaces: boolean;
	value: E164Number | null;
}

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
			node.oninput = null;
			// node.onfocus = null;
		}
	};
};

const registerListeners = (el: HTMLInputElement, params: TelInputActionParams) => {
	el.onkeydown = (e) => {
		onKeyDown(e);
	};

	el.oninput = (e) => {
		onInput(e, params);
	};

	// el.onfocus = (e: Event) => {
	// 	onFocus(e, opt);
	// };
};
const getDeletionType = (inputType?: string) => {
	const isDeletion = inputType?.toLocaleLowerCase().includes('delete') ?? false;
	if (!isDeletion) return undefined;

	return inputType?.toLocaleLowerCase().includes('forward') ? 'forward' : 'backward';
};
const onInput = async (event: Event, params: TelInputActionParams) => {
	const node = event.currentTarget as HTMLInputElement;
	if (!node?.contains(event.target as HTMLInputElement)) return;

	const cursorPositionAfterInput = node.selectionStart ?? 0;
	const phoneBeforeInput = node.value;
	const userInput = (event.target as HTMLInputElement).value;

	const formattedInput = inputParser(userInput, {
		allowSpaces: params.spaces
	});

	const deletionType = getDeletionType((event as InputEvent).inputType);
	const newPosition = getCursorPosition({
		phoneBeforeInput,
		phoneAfterInput: userInput,
		phoneAfterFormatted: formattedInput,
		cursorPositionAfterInput,
		deletion: deletionType
	});

	node.value = formattedInput;
	// Use requestAnimationFrame to ensure cursor position is set after value update
	// requestAnimationFrame(() => {
	// 	node.setSelectionRange(newPosition, newPosition);
	// });

	if (params.prevValue !== null && formattedInput.length < params.prevValue.length) {
		// On deletion we need to wait a tick to ensure cursor position is set after value update
		await tick();
		node.setSelectionRange(newPosition, newPosition);
	} else {
		node.setSelectionRange(newPosition, newPosition);
	}
	params.handler(formattedInput);
};

const onKeyDown = (e: KeyboardEvent) => {
	if (!e.key) return;

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
