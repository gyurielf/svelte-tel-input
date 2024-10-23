<script lang="ts">
	import type { CountryCode, E164Number, DetailedValue } from 'svelte-tel-input/types';
	import { jsonPrettyParser } from '$lib/utils/examples/exampleHelpers.js';
	import { slide } from 'svelte/transition';

	interface Props {
		exampleData: DetailedValue | null;
		value: E164Number | null;
		valid: boolean;
		country: CountryCode | null;
	}

	const { exampleData, value, valid, country }: Props = $props();
	let isOpen = $state(true);

	const generateEntries = (data: DetailedValue | null | undefined) => {
		if (data === null) {
			return [['parsedTelInput', `${data}`]];
		} else if (data !== undefined) {
			return Object.entries(data);
		} else {
			return [];
		}
	};

	const exampleDataEntries = $derived(generateEntries(exampleData));
</script>

<div class="validation-table mt-5">
	<button
		class="w-full text-left dark:bg-gray-700 dark:hover:bg-gray-600 transition bg-gray-100 hover:bg-gray-200 p-3 rounded-t cursor-pointer"
		class:rounded-b={!isOpen}
		onclick={() => {
			isOpen = !isOpen;
		}}
	>
		Properties
		<span class="float-right">
			{#if isOpen}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M4.5 15.75l7.5-7.5 7.5 7.5"
					/>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M19.5 8.25l-7.5 7.5-7.5-7.5"
					/>
				</svg>
			{/if}
		</span>
	</button>

	{#if isOpen}
		<div
			transition:slide
			class="grid md:grid-cols-2 gap-y-6 md:gap-y-0 p-3 font-mono border border-gray-400 dark:border-gray-400 rounded-b"
		>
			<!-- value -->
			<div class="grid col-span-full">
				<div class="mb-2 text-lg">
					<span
						class="bg-gray-100 text-gray-800 font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
						>value</span
					>
				</div>
			</div>
			<div class="grid grid-cols-2 break-words gap-x-2 md:gap-x-0">
				<div>
					<h3 class="text-lg font-bold">Key</h3>
					<div>value</div>
				</div>
				<div>
					<h3 class="text-lg font-bold">Value</h3>
					<div>{value}</div>
				</div>
			</div>
			<div class="grid">
				<h3 class="text-lg font-bold">Payload</h3>
				{#key value}
					<pre lang="no-highlight" class="whitespace-pre-wrap">"{value}"</pre>
				{/key}
			</div>
			<!-- detailedValue -->
			<hr class="col-span-full my-6 divider" />
			<div class="grid col-span-full">
				<div class="mb-2 text-lg">
					<span
						class="bg-gray-100 text-gray-800 font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
						>detailedValue</span
					>
				</div>
			</div>
			<div class="grid grid-cols-2 break-words gap-x-2 md:gap-x-0">
				<div>
					<h3 class="text-lg font-bold">Key</h3>
					{#each exampleDataEntries as [key, _]}
						<div>{key}</div>
					{/each}
				</div>
				<div>
					<h3 class="text-lg font-bold">Value</h3>
					{#each exampleDataEntries as [_, val]}
						<div>{val}</div>
					{/each}
				</div>
			</div>
			<div class="grid">
				<h3 class="text-lg font-bold">Payload</h3>
				{#key exampleData}
					{#if exampleData !== null}
						<pre
							lang="no-highlight"
							class="whitespace-pre-wrap"
							use:jsonPrettyParser={exampleData}></pre>
					{:else}
						<pre lang="no-highlight" class="whitespace-pre-wrap">"{exampleData}"</pre>
					{/if}
				{/key}
			</div>
			<!-- valid -->
			<hr class="col-span-full my-6 divider" />
			<div class="grid col-span-full">
				<div class="mb-2 text-lg">
					<span
						class="bg-gray-100 text-gray-800 font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
						>valid</span
					>
				</div>
			</div>
			<div class="grid grid-cols-2 break-words gap-x-2 md:gap-x-0">
				<div>
					<h3 class="text-lg font-bold">Key</h3>
					<div>valid</div>
				</div>
				<div>
					<h3 class="text-lg font-bold">Value</h3>
					<div>{valid}</div>
				</div>
			</div>
			<div class="grid">
				<h3 class="text-lg font-bold">Payload</h3>
				{#key valid}
					<pre lang="no-highlight" class="whitespace-pre-wrap">"{valid}"</pre>
				{/key}
			</div>
			<!-- country -->
			<hr class="col-span-full my-6 divider" />
			<div class="grid col-span-full">
				<div class="mb-2 text-lg">
					<span
						class="bg-gray-100 text-gray-800 font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
						>country</span
					>
				</div>
			</div>
			<div class="grid grid-cols-2 break-words gap-x-2 md:gap-x-0">
				<div>
					<h3 class="text-lg font-bold">Key</h3>
					<div>country</div>
				</div>
				<div>
					<h3 class="text-lg font-bold">Value</h3>
					<div>{country}</div>
				</div>
			</div>
			<div class="grid">
				<h3 class="text-lg font-bold">Payload</h3>
				{#key country}
					<pre lang="no-highlight" class="whitespace-pre-wrap">"{country}"</pre>
				{/key}
			</div>
		</div>
	{/if}
</div>
