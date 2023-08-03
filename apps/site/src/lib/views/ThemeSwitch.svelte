<script lang="ts">
	import { theme, toggleTheme } from '$lib/stores/DevExampleStores';

	let classes = '';
	export { classes as class };

	$: isDarkModeEnabled = $theme === 'dark';
</script>

<button
	class={classes +
		`relative flex items-center justify-center border-none margin-0 p-2 text-[1.375rem] rounded-sm min-w-[2.649375rem] min-h-[2.649375rem] 
        ml-[var(--theme-switch-ml,0)] cursor-pointer transition-opacity duration-200 hover:outline-none`}
	role="switch"
	aria-label={$theme}
	aria-checked={isDarkModeEnabled}
	on:click={toggleTheme}
>
	<span
		class="theme-switch__icon light-icon absolute transition-[transform,opacity] ease-out {isDarkModeEnabled
			? 'rotate-45 opacity-0'
			: 'rotate-0 opacity-100'}"
		class:dark={isDarkModeEnabled}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			aria-hidden="true"
			role="img"
			width="1.2em"
			height="1.2em"
			preserveAspectRatio="xMidYMid meet"
			viewBox="0 0 24 24"
		>
			<g fill="none">
				<path
					d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0a4 4 0 0 1 8 0z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</g>
		</svg>
	</span>
	<span
		class="theme-switch__icon dark-icon absolute transition-[transform,opacity] ease-out {isDarkModeEnabled
			? 'rotate-0 opacity-100'
			: '-rotate-45 opacity-0'}"
		class:dark={isDarkModeEnabled}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			aria-hidden="true"
			role="img"
			width="1.2em"
			height="1.2em"
			preserveAspectRatio="xMidYMid meet"
			viewBox="0 0 24 24"
		>
			<g fill="none">
				<path
					d="M20.354 15.354A9 9 0 0 1 8.646 3.646A9.003 9.003 0 0 0 12 21a9.003 9.003 0 0 0 8.354-5.646z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</g>
		</svg>
	</span>
</button>
