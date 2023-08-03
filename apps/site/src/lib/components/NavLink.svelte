<script lang="ts">
	import { page } from '$app/stores';
	export let href = '';
	export { classes as class };
	let classes = '';
	export let external = false;

	const normalizeHref = (currentHref: string) => {
		if (currentHref.startsWith('#')) return currentHref;
		if (currentHref === '/') return currentHref;
		if (currentHref.endsWith('/')) return currentHref;
		return currentHref + '/';
	};
	$: active = $page.url.pathname === normalizeHref(href);
</script>

{#if external}
	<a {href} class={`${active ? 'underline' : ''} ${classes}`}><slot /></a>
{:else}
	<a data-sveltekit-preload-data {href} class={`${active ? 'underline' : ''} ${classes}`}
		><slot /></a
	>
{/if}
