import { inspectAllowedChars, inputParser } from '../helpers';

export const inputAction = (node: HTMLInputElement, handler: (val: string) => void) => {
	const onInput = (event: Event) => {
		if (node && node.contains(event.target as HTMLInputElement)) {
			handler((event.target as HTMLInputElement).value);
			const value = (event.target as HTMLInputElement).value;
			const formattedInput = inputParser(value, {
				parseCharacter: inspectAllowedChars,
				allowSpaces: true
			});

			node.value = formattedInput;

			handler(formattedInput);
		}
	};
	node.addEventListener('input', onInput, true);
	return {
		destroy() {
			node.removeEventListener('input', onInput, true);
		}
	};
};
