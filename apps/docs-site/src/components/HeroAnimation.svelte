<script lang="ts">
	import { onDestroy } from 'svelte';

	const verbs = ['Parse', 'Format', 'Validate', 'Normalize', 'Standardize', 'Sanitize'];
	let idx = $state(0);
	const verb = $derived(verbs[idx % verbs.length]);

	const timer = setInterval(() => {
		idx++;
	}, 3000);

	onDestroy(() => clearInterval(timer));

	// Custom 3D cube transitions
	function cubeIn(node: HTMLElement, { duration = 550 }: { duration?: number } = {}) {
		return {
			duration,
			css: (t: number) => `
				transform: translateZ(${-48 + t * 48}px) translateY(${-60 + t * 60}%) rotate3d(1, 0, 0, ${90 - t * 90}deg);
				opacity: ${t};
			`
		};
	}

	function cubeOut(node: HTMLElement, { duration = 550 }: { duration?: number } = {}) {
		return {
			duration,
			css: (t: number) => `
				transform: translateZ(${-48 + t * 48}px) translateY(${(1 - t) * 60}%) rotate3d(1, 0, 0, ${(1 - t) * -90}deg);
				opacity: ${t};
			`
		};
	}
</script>

<div class="hero-animation not-content">
	<div class="hero-headline">
		<span class="verb-container" style="perspective: 400px;">
			{#key verb}
				<span class="verb" in:cubeIn={{ duration: 550 }} out:cubeOut={{ duration: 550 }}>
					{verb}
				</span>
			{/key}
		</span>
		<span class="rest">phone numbers easily.</span>
	</div>

	<p class="hero-sub">
		A lightweight <strong>Svelte 5</strong> component for international phone input.
		<br />Store in <code>E.164</code>, display beautifully, validate instantly.
	</p>

	<div class="hero-actions">
		<a href="/getting-started/installation/" class="btn btn-primary">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg
			>
			Get Started
		</a>
		<a href="/playground/" class="btn btn-secondary">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><path
					d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
				/><path
					d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
				/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path
					d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
				/></svg
			>
			Playground
		</a>
	</div>

	<div class="feature-pills">
		<span class="pill">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline
					points="22 4 12 14.01 9 11.01"
				/></svg
			>
			E.164 Storage
		</span>
		<span class="pill">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg
			>
			Auto-detect Country
		</span>
		<span class="pill">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><path d="M12 20h9" /><path
					d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
				/></svg
			>
			Smart Formatting
		</span>
		<span class="pill">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path
					d="M7 11V7a5 5 0 0 1 10 0v4"
				/></svg
			>
			Validation
		</span>
		<span class="pill">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line
					x1="8"
					y1="21"
					x2="16"
					y2="21"
				/><line x1="12" y1="17" x2="12" y2="21" /></svg
			>
			SSR / SSG
		</span>
		<span class="pill pill-svelte">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="currentColor"
				><path
					d="M18.12 2.29c-2.79-1.83-6.56-1.2-8.6 1.34L7.33 6.63a6.1 6.1 0 0 0-1.1 3.6 5.78 5.78 0 0 0 .63 2.73A5.42 5.42 0 0 0 6 15.15a5.84 5.84 0 0 0 1 4.57c2.79 1.83 6.56 1.2 8.6-1.34l2.19-3a6.1 6.1 0 0 0 1.1-3.6 5.78 5.78 0 0 0-.63-2.73c.5-.73.78-1.6.86-2.48a5.84 5.84 0 0 0-1-4.28zm-9.49 17.35a3.6 3.6 0 0 1-3.83-1.6 3.52 3.52 0 0 1-.5-2.16 3.25 3.25 0 0 1 .12-.76l.08-.23.21.14a6.85 6.85 0 0 0 2.1 1.08l.2.06-.02.2a1.07 1.07 0 0 0 .2.68 1.09 1.09 0 0 0 1.16.48 1 1 0 0 0 .31-.13l2.19-3a1.05 1.05 0 0 0 .18-.58 1.06 1.06 0 0 0-.47-.88 1.09 1.09 0 0 0-1.16-.49 1 1 0 0 0-.31.14l-.84.57a3.58 3.58 0 0 1-1.02.45 3.6 3.6 0 0 1-3.83-1.61 3.52 3.52 0 0 1-.5-2.16 3.48 3.48 0 0 1 .6-1.92l2.19-3A3.59 3.59 0 0 1 9.3 4.35a3.6 3.6 0 0 1 3.83 1.6 3.57 3.57 0 0 1 .38 2.92l-.08.23-.21-.14a6.85 6.85 0 0 0-2.1-1.08l-.2-.06.02-.2a1.07 1.07 0 0 0-.2-.68 1.09 1.09 0 0 0-1.16-.48 1 1 0 0 0-.31.13l-2.19 3A1.05 1.05 0 0 0 6.9 10a1.06 1.06 0 0 0 .47.88 1.09 1.09 0 0 0 1.16.49 1 1 0 0 0 .31-.14l.84-.57a3.58 3.58 0 0 1 1.02-.45 3.6 3.6 0 0 1 3.83 1.61c.46.68.67 1.48.62 2.28a3.48 3.48 0 0 1-.72 1.8l-2.19 3a3.59 3.59 0 0 1-2.61 1.74z"
				/></svg
			>
			Svelte 5 Runes
		</span>
	</div>
</div>

<style>
	.hero-animation {
		text-align: left;
	}

	.hero-headline {
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 800;
		line-height: 1.15;
		letter-spacing: -0.02em;
		margin-bottom: 1.5rem;
	}

	.verb-container {
		position: relative;
		display: block;
		height: 1.2em;
		overflow: hidden;
		margin-bottom: 0.1em;
	}

	.verb {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		color: var(--sl-color-accent);
		will-change: transform, opacity;
		backface-visibility: hidden;
	}

	.rest {
		display: block;
		color: var(--sl-color-white);
	}

	.hero-sub {
		font-size: 1.15rem;
		line-height: 1.7;
		color: var(--sl-color-gray-2);
		max-width: 36rem;
		margin: 0 0 2rem;
	}

	.hero-sub code {
		background: var(--sl-color-gray-6);
		padding: 0.15em 0.4em;
		border-radius: 4px;
		font-size: 0.95em;
		color: var(--sl-color-accent);
	}

	.hero-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-start;
		flex-wrap: wrap;
		margin-bottom: 2.5rem;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.75rem;
		border-radius: 999px;
		font-weight: 600;
		font-size: 1rem;
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.btn-primary {
		background: var(--sl-color-accent);
		color: var(--sl-color-black);
	}

	.btn-primary:hover {
		filter: brightness(1.15);
		transform: translateY(-1px);
		box-shadow: 0 4px 20px color-mix(in srgb, var(--sl-color-accent), transparent 50%);
	}

	.btn-secondary {
		background: var(--sl-color-gray-6);
		color: var(--sl-color-gray-1);
		border: 1px solid var(--sl-color-gray-5);
	}

	.btn-secondary:hover {
		background: var(--sl-color-gray-5);
		transform: translateY(-1px);
	}

	/* Feature pills */
	.feature-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: flex-start;
		margin-bottom: 3rem;
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.35rem 0.85rem;
		border-radius: 999px;
		font-size: 0.8rem;
		font-weight: 500;
		background: var(--sl-color-gray-6);
		color: var(--sl-color-gray-2);
		border: 1px solid var(--sl-color-gray-5);
	}

	.pill-svelte {
		border-color: color-mix(in srgb, var(--sl-color-accent), transparent 50%);
		color: var(--sl-color-accent);
	}

	@media (max-width: 640px) {
		.hero-animation {
			padding: 1rem 0.5rem 2rem;
		}

		.hero-sub br {
			display: none;
		}
	}
</style>
