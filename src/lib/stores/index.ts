import { writable } from 'svelte/store';

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
export const statefulSwap = (initialState: any) => {
    const transitionState = writable(initialState);
    let nextState = initialState;

    const transitionTo = (newState: any) => {
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
