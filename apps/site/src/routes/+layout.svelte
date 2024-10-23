<script lang="ts">
	import TheFooter from '$lib/views/TheFooter.svelte';
	import TheHeader from '$lib/views/TheHeader.svelte';
	import '../app.css';
	import 'svelte-tel-input/styles/flags.css';
	interface Props {
		children?: import('svelte').Snippet;
	}

	const { children }: Props = $props();
</script>

<TheHeader />

<main class="mx-auto w-full flex flex-row min-h-full container pt-20 z-20">
	{@render children?.()}
</main>

<TheFooter />
