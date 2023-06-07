export function focusableChildren(node: HTMLElement, infiniteStep = false) {
	const nodes = Array.from(
		node.querySelectorAll<HTMLElement>(
			'li, button, a[href], input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
		)
	);

	const activeElement =
		document.activeElement instanceof HTMLElement ? document.activeElement : null;
	const index = activeElement ? nodes.indexOf(activeElement) : -1;

	const focusNode = (node: HTMLElement | null) => {
		if (node instanceof HTMLElement) {
			node.focus();
		}
	};

	const next = (selector?: string) => {
		if (index === nodes.length - 1) {
			// If infinite stepping is enabled, it jumps to the first element from the last.
			if (infiniteStep) {
				focusNode(nodes[0]);
			}
			// Stay on the last element
			return;
		}

		let i = index + 1;
		const matchedNodes = selector ? nodes.filter((node) => node.matches(selector)) : nodes;

		while (i < nodes.length) {
			const node = nodes[i];
			if (matchedNodes.includes(node)) {
				focusNode(node);
				return;
			}
			i++;
		}
	};

	const prev = (selector?: string) => {
		if (index === 0) {
			// If infinite stepping is enabled, it jumps to the last element from the first.
			if (infiniteStep) {
				focusNode(nodes[nodes.length - 1]);
			}
			// Stay on the first element
			return;
		}

		let i = index - 1;
		const matchedNodes = selector ? nodes.filter((node) => node.matches(selector)) : nodes;

		while (i >= 0) {
			const node = nodes[i];
			if (matchedNodes.includes(node)) {
				focusNode(node);
				return;
			}
			i--;
		}
	};

	const update = (d: number) => {
		let i = index + d;
		i = Math.max(0, Math.min(i, nodes.length - 1));
		const node = nodes[i];
		focusNode(node);
	};

	return {
		next,
		prev,
		update
	};
}

export function tabulatorFocusTrap(node: HTMLElement) {
	const handle_keydown = (e: KeyboardEvent) => {
		if (e.key === 'Tab') {
			e.preventDefault();

			const group = focusableChildren(node);
			if (e.shiftKey) {
				group.prev();
			} else {
				group.next();
			}
		}
	};

	node.addEventListener('keydown', handle_keydown);

	return {
		destroy: () => {
			node.removeEventListener('keydown', handle_keydown);
		}
	};
}

// Put it to the wrapper element, where you want to use the keyboard navigation.
// on:keydown={(e) => {
//     if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
//         e.preventDefault();
//         const group = focusableChildren(e.currentTarget);
//         // when using arrow keys (as opposed to tab), don't focus buttons
//         const selector = 'a, input';
//         if (e.key === 'ArrowDown') {
//             group.next(selector);
//         } else {
//             group.prev(selector);
//         }
//     }
// }}
// use:tabulatorFocusTrap
