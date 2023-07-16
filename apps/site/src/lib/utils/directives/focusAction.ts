export function focusable_children(node: HTMLElement) {
	const nodes = Array.from(
		node.querySelectorAll(
			'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
		)
	);

	const index = document.activeElement ? nodes.indexOf(document.activeElement) : -1;

	const update = (d: number) => {
		let i = index + d;
		i += nodes.length;
		i %= nodes.length;

		// @ts-expect-error Element is not HTMLElement
		nodes[i].focus();
	};

	return {
		next: (selector: string) => {
			const reordered = [...nodes.slice(index + 1), ...nodes.slice(0, index + 1)];

			for (let i = 0; i < reordered.length; i += 1) {
				if (!selector || reordered[i].matches(selector)) {
					// @ts-expect-error Element is not HTMLElement
					reordered[i].focus();
					return;
				}
			}
		},
		prev: (selector: string) => {
			const reordered = [...nodes.slice(index + 1), ...nodes.slice(0, index + 1)];

			for (let i = reordered.length - 2; i >= 0; i -= 1) {
				if (!selector || reordered[i].matches(selector)) {
					// @ts-expect-error Element is not HTMLElement
					reordered[i].focus();
					return;
				}
			}
		},
		update
	};
}

export function trap(node: HTMLElement) {
	const handle_keydown = (e: KeyboardEvent) => {
		if (e.key === 'Tab') {
			e.preventDefault();

			const group = focusable_children(node);
			if (e.shiftKey) {
				// @ts-expect-error Element is not HTMLElement
				group.prev();
			} else {
				// @ts-expect-error Element is not HTMLElement
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

// Put onto the element, where you want to use the keyboard navigation.
// on:keydown={(e) => {
//     if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
//         e.preventDefault();
//         const group = focusable_children(e.currentTarget);
//         // when using arrow keys (as opposed to tab), don't focus buttons
//         const selector = 'a, input';
//         if (e.key === 'ArrowDown') {
//             group.next(selector);
//         } else {
//             group.prev(selector);
//         }
//     }
// }}
// use:trap
