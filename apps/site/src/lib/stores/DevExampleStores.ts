import { writable } from 'svelte/store';
import { createLocalStorage, persist, type PersistentStore } from '@macfja/svelte-persistent-store';
import type { DetailedValue } from 'svelte-tel-input/types';

export const exampleDataStore = writable<DetailedValue>();

// Theme
export const theme: PersistentStore<string | null> = persist(
	writable(null),
	createLocalStorage(),
	'theme'
);

let preferedTheme: string | null = null;

export const initTheme = () => {
	try {
		const unsubscribe = theme.subscribe((theme) => {
			preferedTheme = theme;
		});
		unsubscribe();
	} catch (error) {
		console.error(error);
	}
};

export const toggleTheme = (): void => {
	initTheme();

	const { classList } = document.querySelector('html') as HTMLElement;

	if (preferedTheme !== null) {
		classList.remove(preferedTheme);
		preferedTheme = null;
	} else {
		preferedTheme = 'dark';
		classList.add(preferedTheme);
	}

	theme.update((newTheme) => {
		newTheme = preferedTheme;
		return newTheme;
	});
};
