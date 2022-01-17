import type { SvelteComponentTyped } from 'svelte';

// TEMPORARY DISABLED
export type DynamicSvelteComponent = {
    component: typeof SvelteComponentTyped;
    props?: Record<string, any>;
    slot?: any;
    click?: any;
    input?: any;
};

// declare const __propDef: {
//     props: {};
//     slots: {};
//     events: {
//         [evt: string]: CustomEvent<any>;
//     };
// };

// export declare type DynamicSvelteComponentProps = typeof __propDef.props;
// export declare type DynamicSvelteComponentEvents = typeof __propDef.events;
// export declare type DynamicSvelteComponentSlots = typeof __propDef.slots;

// export default class DynamicSvelteComponent extends SvelteComponentTyped<
//     DynamicSvelteComponentProps,
//     DynamicSvelteComponentEvents,
//     DynamicSvelteComponentSlots
// > {}
