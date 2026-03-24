import { writable } from 'svelte/store';
import type { DetailedValue } from 'svelte-tel-input/types';

export const exampleDataStore = writable<DetailedValue>();

const getInitialDark = () => {
	try {
		return localStorage.getItem('theme') === 'dark';
	} catch {
		return false;
	}
};

const { subscribe, set } = writable<boolean>(getInitialDark());

export const theme = {
	subscribe,
	toggle(): void {
		const isDark = document.documentElement.classList.contains('dark');
		document.documentElement.classList.toggle('dark', !isDark);
		if (!isDark) {
			localStorage.setItem('theme', 'dark');
		} else {
			localStorage.removeItem('theme');
		}
		set(!isDark);
	}
};
