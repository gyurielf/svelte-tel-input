export const closeOnEscape = (node: HTMLElement, action: () => void) => {
	const handleKey = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && node) action();
	};

	node.addEventListener('keydown', handleKey);

	return {
		destroy() {
			node.removeEventListener('keydown', handleKey);
		}
	};
};
