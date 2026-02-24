<script lang="ts">
	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Pathname } from '$app/types';

	interface Props {
		href: Pathname;
		class?: string;
		external?: boolean;
		children?: Snippet;
	}
	const { href, class: classes = '', external = false, children }: Props = $props();

	const normalizeHref = (currentHref: string) => {
		if (currentHref.startsWith('#')) return currentHref;
		if (currentHref === '/') return currentHref;
		if (currentHref.endsWith('/')) return currentHref;
		return currentHref + '/';
	};
	const active = $derived(page.url.pathname === normalizeHref(href));
</script>

{#if external}
	<a href={resolve(href)} class={`${active ? 'underline' : ''} ${classes}`}
		>{@render children?.()}</a
	>
{:else}
	<a
		data-sveltekit-preload-data
		href={resolve(href)}
		class={`${active ? 'underline' : ''} ${classes}`}>{@render children?.()}</a
	>
{/if}
