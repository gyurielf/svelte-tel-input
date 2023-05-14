import type { DetailedValue } from '$lib/types';

export const jsonPrettyParser = (node: HTMLElement, data: DetailedValue | null) => {
	data !== null && (node.innerHTML = `<code>${JSON.stringify(data, null, 2)}</code>`);
	return {
		destroy: () => {
			node.remove();
		}
	};
};

export const cubeIn = (
	node: HTMLElement,
	{ rotateFrom, duration }: { rotateFrom: number; duration: number }
) => ({
	duration,
	css: (t: number) => {
		const o = +getComputedStyle(node).opacity;

		return `
transform: translateZ(${-64 + t * 64}px) translateY(${-64 + t * 64}%) rotate3d(1, 0, 0, ${
			rotateFrom - t * 90
		}deg);
opacity: ${0.25 + t * o}
`;
	}
});

export const cubeOut = (
	node: HTMLElement,
	{ rotateTo, duration }: { rotateTo: number; duration: number }
) => ({
	duration,
	css: (t: number) => {
		const o = +getComputedStyle(node).opacity;

		return `
transform: translateZ(${-64 + t * 64}px) translateY(${(1 - t) * 64}%) rotate3d(1, 0, 0, ${
			(1 - t) * rotateTo
		}deg);
opacity: ${0.25 + t * o}
`;
	}
});
