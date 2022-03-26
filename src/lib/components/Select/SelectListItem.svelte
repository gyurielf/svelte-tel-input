<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    const setSelected = (e?: Event) => {
        dispatch('selectedItem');
    };
</script>

<li on:click={setSelected}>
    <slot />
</li>
