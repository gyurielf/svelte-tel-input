<script lang="ts">
	import { cubeIn, cubeOut } from '$lib/utils/examples/exampleHelpers';
	import Usage from '$lib/views/Usage.svelte';
	import { onDestroy } from 'svelte';

	const headlines = ['Parse', 'Format', 'Standardize', 'Sanitize', 'Normalize'];
	let currentHeadline = 0;
	$: headline = headlines[currentHeadline % headlines.length];

	const headlineTimeout = setInterval(() => {
		currentHeadline++;
	}, 3000);

	onDestroy(() => {
		headlineTimeout && clearInterval(headlineTimeout);
	});
</script>

<svelte:head>
	<title>Svelte Tel Input</title>
</svelte:head>

<div class="container mx-auto md:mt-6 lg:mt-14 mb-14 px-2">
	<div
		class="relative text-center mb-8 xl:mt-0 md:pb-0 md:text-left text-gray-800 dark:text-gray-100"
	>
		<h2
			class="mb-4 text-3xl font-bold tracking-tight xl:mb-8 lg:text-4xl xl:text-5xl 2xl:text-6xl font-display"
		>
			<span class="relative block w-full pt-20 md:pt-10 xl:pt-14">
				{#key headline}
					<span
						class="absolute top-0 left-0 flex flex-col justify-end w-full transition-all md:max-w-md xl:max-w-full h-1/2 text-violet-700"
						in:cubeIn={{ rotateFrom: 90, duration: 600 }}
						out:cubeOut={{ rotateTo: -90, duration: 600 }}>{headline}</span
					>
				{/key}
				<span>phone numbers easily.</span>
			</span>
		</h2>
	</div>
	<Usage />
</div>
