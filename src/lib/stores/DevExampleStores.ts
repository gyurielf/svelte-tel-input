import { writable } from 'svelte/store';
import { createLocalStorage, persist } from '@macfja/svelte-persistent-store';
import type { PersistentStore } from '@macfja/svelte-persistent-store';
import type { NormalizedTelNumber } from '$lib/types';

export const exampleDataStore = writable<NormalizedTelNumber>();

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

	theme.update((newTheme) => (newTheme = preferedTheme));
};
