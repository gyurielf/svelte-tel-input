import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

// Modal
export const booleanStore = (initial: boolean) => {
	const isOpen = writable<boolean>(initial);
	const { set, update } = isOpen;
	return {
		isOpen,
		open: () => set(true),
		close: () => set(false),
		toggle: () => update((n) => !n)
	};
};

// StatefulSwap (transition)
export const statefulSwap = (initialState: boolean | null) => {
	const transitionState = writable(initialState);
	let nextState = initialState;

	const transitionTo = (newState: boolean | null) => {
		if (nextState === newState) return;
		nextState = newState;
		transitionState.set(null);
	};

	const onOutro = () => {
		transitionState.set(nextState);
	};

	return {
		transitionState,
		transitionTo,
		onOutro
	};
};

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

// SELECTS
export const selectedCountryStore: Writable<string> = writable();

// INPUT
export const enteredTelInputStore: Writable<string> = writable();
