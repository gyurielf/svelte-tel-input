<script lang="ts">
	import type { TelInputOptions } from '$lib/types';
	import { slide } from 'svelte/transition';
	export let options: TelInputOptions;
	let isOpen = false;
</script>

<div class="validation-table mt-5 rounded-t">
	<button
		class="w-full text-left dark:bg-gray-700 dark:hover:bg-gray-600 transition bg-gray-100 hover:bg-gray-200 p-3 rounded-t cursor-pointer"
		class:rounded-b={!isOpen}
		on:click={() => {
			isOpen = !isOpen;
		}}
	>
		Options
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
			class="p-3 font-mono border border-gray-400 dark:border-gray-400 rounded-b"
		>
			<label
				for="spaces"
				class="relative inline-flex items-center align-middle cursor-pointer"
			>
				<input
					id="spaces"
					type="checkbox"
					value={options.spaces}
					class="sr-only peer"
					checked={options.spaces}
					on:change={(e) => {
						options.spaces = !options.spaces;
					}}
				/>
				<div
					class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
				/>
				<span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Spaces</span
				>
			</label>
			<label
				for="autoPlaceholder"
				class="relative inline-flex items-center align-middle cursor-pointer"
			>
				<input
					id="autoPlaceholder"
					type="checkbox"
					value={options.autoPlaceholder}
					class="sr-only peer"
					checked={options.autoPlaceholder}
					on:change={(e) => {
						options.autoPlaceholder = !options.autoPlaceholder;
					}}
				/>
				<div
					class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
				/>
				<span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
					>Auto Placeholder</span
				>
			</label>
			<div class="inline-flex">
				<select
					disabled
					id="countries"
					class="opacity-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				>
					<option selected>Choose format (soon)</option>
					<option value="formatOriginal">Original</option>
					<option value="formatInternational">International</option>
					<option value="formatNational">National</option>
				</select>
			</div>
		</div>
	{/if}
</div>
