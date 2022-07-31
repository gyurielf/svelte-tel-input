import { writable } from 'svelte/store';
import type { NormalizedPhoneNumber } from '$lib/types/interfaces/Phone.interface';

export const exampleDataStore = writable<NormalizedPhoneNumber>();
