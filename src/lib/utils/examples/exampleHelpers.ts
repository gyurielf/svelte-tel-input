import type { NormalizedTelNumber } from '$lib/types';

export const jsonPrettyParser = (node: HTMLElement, data: NormalizedTelNumber | null) => {
	data !== null && (node.innerHTML = `<code>${JSON.stringify(data, null, 2)}</code>`);
	return {
		destroy: () => {
			node.remove();
		}
	};
};
