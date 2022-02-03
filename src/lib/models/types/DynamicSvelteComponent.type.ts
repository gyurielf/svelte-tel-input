import type { SvelteComponentTyped } from 'svelte';

export type DynamicSvelteComponent = {
    component: typeof SvelteComponentTyped;
    props?: Record<string, any> | string | number | null;
    slot?: SvelteComponentTyped;
    click?: MouseEvent;
    input?: InputEvent;
};
