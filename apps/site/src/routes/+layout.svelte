<script lang="ts">
	import TheFooter from '$lib/views/TheFooter.svelte';
	import TheHeader from '$lib/views/TheHeader.svelte';
	import '../app.css';
	import '@gyurielf/mono-sti/styles/flags.css';
</script>

<TheHeader />

<main class="mx-auto w-full flex flex-row min-h-full container pt-20 z-20">
	<slot />
</main>

<TheFooter />
