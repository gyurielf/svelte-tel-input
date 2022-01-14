<script lang="ts">
    import { inview } from 'svelte-inview';

    let loadComponent: any;
    export { loadComponent as this };

    let isShowingComponent = false;
    let componentPromise: any;
</script>

{#if !isShowingComponent}
    <div
        use:inview
        on:enter={() => {
            componentPromise = loadComponent();
            isShowingComponent = true;
        }}
    />
{:else}
    {#await componentPromise then { default: Component }}
        <slot name="component" {Component} />
    {/await}
{/if}
