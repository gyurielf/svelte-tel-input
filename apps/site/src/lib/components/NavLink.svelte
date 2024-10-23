<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';

	interface Props {
		href?: string;
		class?: string;
		external?: boolean;
		children?: Snippet;
	}

	const { href = '', class: classes = '', external = false, children }: Props = $props();

	const normalizeHref = (currentHref: string) => {
		if (currentHref.startsWith('#')) return currentHref;
		if (currentHref === '/') return currentHref;
		if (currentHref.endsWith('/')) return currentHref;
		return currentHref + '/';
	};
	const active = $derived($page.url.pathname === normalizeHref(href));
</script>

{#if external}
	<a {href} class={`${active ? 'underline' : ''} ${classes}`}>{@render children?.()}</a>
{:else}
	<a data-sveltekit-preload-data {href} class={`${active ? 'underline' : ''} ${classes}`}
		>{@render children?.()}</a
	>
{/if}
