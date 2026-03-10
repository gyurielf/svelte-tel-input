<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	const defaultStyleConfig = {
		backgroundColor: '#1f2937',
		color: '#1f2937',
		darkBackgroundColor: '#ffffff',
		darkColor: '#ffffff'
	};
	interface Props {
		/**
		 * Previous sizes:
		 * @example
		 * sm - 14px
		 * md - 21px
		 * lg - 28px
		 * xl - 42px
		 * xxl - 56px
		 */
		size?: number | string;
		class?: string;
		testid?: string | null;
		innerClass?: string;
		outterClass?: string;
		styleConfig?: { [Property in keyof typeof defaultStyleConfig]?: string };
	}

	const {
		size = 20,
		class: classes = '',
		testid = null,
		innerClass = '',
		outterClass = '',
		styleConfig = defaultStyleConfig
	}: Props = $props();

	const mergedStyleConfig = $derived({ ...defaultStyleConfig, ...styleConfig });
</script>

<svg
	aria-label="loading"
	data-testid={testid}
	width={size}
	height={size}
	class={twMerge('inline-block', classes)}
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
	><path
		d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
		class="loading-spinner-bg {twMerge('opacity-25', outterClass)}"
		style={`--bgColor:${mergedStyleConfig.backgroundColor}; --darkBgColor:${mergedStyleConfig.darkBackgroundColor};`}
	/><path
		d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
		class="loading-spinner {twMerge('animate-spin-fast origin-center', innerClass)}"
		style={`--color:${mergedStyleConfig.color}; --darkColor:${mergedStyleConfig.darkColor};`}
	/></svg
>

<style lang="postcss">
	.loading-spinner-bg {
		@apply fill-[var(--bgColor)] dark:fill-[var(--darkBgColor)];
	}

	.loading-spinner {
		@apply fill-[var(--color)] dark:fill-[var(--darkColor)];
	}
</style>
