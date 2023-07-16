export const clickOutsideAction = (
	node: HTMLElement,
	handler: () => void,
	skipPrevented = true
): { destroy: () => void } => {
	const handleClick = async (event: MouseEvent) => {
		if (skipPrevented) {
			if (!node.contains(event.target as HTMLElement) && !event.defaultPrevented) handler();
		} else {
			if (!node.contains(event.target as HTMLElement)) handler();
		}
	};

	document.addEventListener('click', handleClick, true);
	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
};
