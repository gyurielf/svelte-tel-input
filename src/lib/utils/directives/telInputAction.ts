import { inspectAllowedChars, inputParser } from '$lib';
import type { E164Number } from 'libphonenumber-js';
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
	const onInput = (event: Event) => {
		if (node && node.contains(event.target as HTMLInputElement)) {
			const currentValue = (event.target as HTMLInputElement).value;
			const formattedInput = inputParser(currentValue, {
				parseCharacter: inspectAllowedChars,
				allowSpaces: spaces
			});
			node.value = formattedInput;
			handler(formattedInput);
		}
	};
	node.addEventListener('input', onInput, true);
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
			node.removeEventListener('input', onInput, true);
		}
	};
};
