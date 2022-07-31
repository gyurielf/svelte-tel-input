import type { SvelteComponentTyped } from 'svelte';

export type DynamicSvelteComponent = {
	component: typeof SvelteComponentTyped;
	props?: Record<string, unknown> | string | number | null;
	slot?: SvelteComponentTyped;
	click?: MouseEvent;
	input?: InputEvent;
};
