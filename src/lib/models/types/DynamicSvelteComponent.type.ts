import type { SvelteComponent } from 'svelte';

export type DynamicSvelteComponent = {
    component: typeof SvelteComponent;
    props?: Record<string, any>;
    slot?: any;
    click?: any;
    input?: any;
};
