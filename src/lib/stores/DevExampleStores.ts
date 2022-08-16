import { writable } from 'svelte/store';
import { localStorage, persist } from '@macfja/svelte-persistent-store';
import type { PersistentStore } from '@macfja/svelte-persistent-store';
import type { NormalizedPhoneNumber } from '$lib/types/interfaces/Phone.interface';

export const exampleDataStore = writable<NormalizedPhoneNumber>();

// Theme
export const theme: PersistentStore<string | null> = persist(
	writable(null),
	localStorage(),
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

	const { classList, ...htmlEl } = document.querySelector('html') as HTMLElement;

	if (preferedTheme !== null) {
		classList.remove(preferedTheme);
		preferedTheme = null;
	} else {
		preferedTheme = 'dark';
		classList.add(preferedTheme);
	}

	theme.update((theme) => (theme = preferedTheme));
};
