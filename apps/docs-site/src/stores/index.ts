import { writable } from 'svelte/store';

// Watch variable changes.
export const watcher = (
	initialValue: string | null,
	watchFunction: (oldVal: string | null, newVal: string | null) => void
) => {
	const { subscribe, update } = writable(initialValue);
	return {
		subscribe,
		set: (value: string | null) => {
			update((oldvalue) => {
				watchFunction(oldvalue, value);
				return value;
			});
		}
	};
};
