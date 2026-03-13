<script lang="ts">
	import AdvancedPhoneInput from './examples/AdvancedPhoneInput.svelte';
	import type {
		DetailedValue,
		CountryCode,
		TelInputOptions,
		ValidationError
	} from 'svelte-tel-input/types';

	// ── Live demo state ──────────────────────────────────────────────────
	let demoValue = $state('+14155552671');
	let demoCountry = $state<CountryCode | null>(null);
	let demoValid = $state(true);
	let demoDetails = $state<DetailedValue | null>(null);
	let demoError = $state<ValidationError>(null);
	const demoOptions: TelInputOptions = $state({
		autoPlaceholder: true,
		spaces: true,
		validateOn: 'input'
	});

	// ── Copy helpers ────────────────────────────────────────────────────
	let copiedE164 = $state(false);
	let copiedInstall = $state(false);
	let activePkg = $state<'pnpm' | 'npm' | 'yarn' | 'bun'>('pnpm');

	const installCmds: Record<string, string> = {
		pnpm: 'pnpm add svelte-tel-input',
		npm: 'npm install svelte-tel-input',
		yarn: 'yarn add svelte-tel-input',
		bun: 'bun add svelte-tel-input'
	};

	async function copy(text: string, signal: (v: boolean) => void) {
		try {
			await navigator.clipboard.writeText(text);
			signal(true);
			setTimeout(() => signal(false), 2000);
		} catch {}
	}

	// ── Demo presets ────────────────────────────────────────────────────
	const presets = [
		{ label: '🇺🇸 US', value: '+12015551234' },
		{ label: '🇬🇧 UK', value: '+447911123456' },
		{ label: '🇩🇪 DE', value: '+4915123456789' },
		{ label: '🇯🇵 JP', value: '+819012345678' },
		{ label: '⚠️ Invalid', value: '+1999' }
	];

	// ── Country flag helper ─────────────────────────────────────────────
	const toFlag = (cc: string | null): string =>
		cc
			? [...cc.toUpperCase()]
					.map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
					.join('')
			: '';

	// ── Features ────────────────────────────────────────────────────────
	const features = [
		{
			title: 'E.164 Storage',
			desc: 'Phone numbers are always stored in E.164 format — the standard your backend and APIs expect.',
			svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>'
		},
		{
			title: 'Auto-detect Country',
			desc: 'Paste any international number and the country is auto-detected from the dial code.',
			svg: '<circle cx="11" cy="11" r="8" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-4.35-4.35"/>'
		},
		{
			title: 'Smart Formatting',
			desc: 'Numbers format as you type — national or international — cursor position preserved.',
			svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>'
		},
		{
			title: 'Built-in Validation',
			desc: 'Catch invalid, too-short, and impossible numbers using libphonenumber-js under the hood.',
			svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>'
		},
		{
			title: 'SSR / SSG Ready',
			desc: 'Works in SvelteKit (SSR) and Astro (SSG) with no window guards or client-only workarounds.',
			svg: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 21h8m-4-4v4"/>'
		},
		{
			title: 'Svelte 5 Runes',
			desc: 'Built with $state, $derived, and $bindable — fully reactive with zero ceremony.',
			svg: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
		}
	];

	const codeSnippet = [
		'<script lang="ts">',
		"  import { TelInput } from 'svelte-tel-input';",
		"  import type { CountryCode } from 'svelte-tel-input/types';",
		'',
		"  let value = $state('');",
		"  let country = $state<CountryCode | null>('US');",
		'  let valid = $state(true);',
		'<' + '/script>',
		'',
		'<TelInput',
		'  bind:value',
		'  bind:country',
		'  bind:valid',
		'  options={{ autoPlaceholder: true, spaces: true }}',
		'/>'
	].join('\n');
</script>

<div class="not-content py-0">
	<!-- ── SECTION 1: LIVE DEMO ──────────────────────────────────────── -->
	<section class="py-16">
		<div
			class="inline-block text-xs font-semibold tracking-[0.1em] uppercase text-[#7c3aed] mb-2"
		>
			Live Demo
		</div>
		<h2
			class="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight text-[var(--sl-color-white)] m-0 mb-3"
		>
			Phone input that just works
		</h2>
		<p class="text-base text-[var(--sl-color-gray-3)] m-0 mb-8 max-w-[56ch]">
			Type any international number — auto-detected, formatted, and stored as E.164.
		</p>

		<div class="grid grid-cols-1 md:grid-cols-2 md:items-start gap-6">
			<!-- Input side -->
			<div>
				{#key demoOptions}
					<AdvancedPhoneInput
						bind:value={demoValue}
						bind:selectedCountry={demoCountry}
						bind:valid={demoValid}
						bind:detailedValue={demoDetails}
						bind:validationError={demoError}
						options={demoOptions}
					/>
				{/key}
				<div class="mt-[0.875rem] flex flex-wrap items-center gap-2">
					<span class="text-xs font-medium text-[var(--sl-color-gray-3)]">Try:</span>
					{#each presets as p (p.value)}
						<button
							class="px-[0.65rem] py-[0.2rem] text-[0.8rem] rounded-full border border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg-nav)] text-[var(--sl-color-text)] cursor-pointer transition-[background,border-color] duration-150 hover:bg-[var(--sl-color-bg-sidebar)] hover:border-[#7c3aed]"
							onclick={() => (demoValue = p.value)}>{p.label}</button
						>
					{/each}
				</div>
			</div>

			<!-- Output side -->
			<div>
				<div
					class="border border-[var(--sl-color-hairline)] rounded-xl overflow-hidden bg-[var(--sl-color-bg-nav)]"
				>
					<div
						class="flex items-center gap-1.5 px-4 py-[0.6rem] text-xs font-semibold tracking-[0.04em] uppercase text-[var(--sl-color-gray-3)] bg-[var(--sl-color-bg-sidebar)] border-b border-[var(--sl-color-hairline)]"
					>
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
						>
							<circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
						</svg>
						Live output
					</div>

					<div
						class="flex items-center justify-between gap-4 px-4 py-[0.65rem] border-b border-[var(--sl-color-hairline)]"
					>
						<span
							class="text-[0.78rem] font-medium text-[var(--sl-color-gray-3)] font-mono shrink-0"
							>value</span
						>
						<div class="flex items-center gap-2 min-w-0">
							<code class="font-mono text-[0.85rem] text-[#a6e3a1] break-all"
								>{demoValue || '—'}</code
							>
							<button
								class="inline-flex items-center justify-center gap-[0.3rem] px-[0.4rem] py-[0.25rem] rounded-[0.35rem] border border-[var(--sl-color-hairline)] bg-transparent text-[var(--sl-color-gray-3)] cursor-pointer text-xs transition-[background,color] duration-150 hover:bg-[var(--sl-color-bg-sidebar)] hover:text-[var(--sl-color-text)] shrink-0"
								aria-label="Copy E.164 value"
								onclick={() => copy(demoValue, (v) => (copiedE164 = v))}
							>
								{#if copiedE164}
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
										><polyline points="20 6 9 17 4 12" /></svg
									>
								{:else}
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
										><rect
											x="9"
											y="9"
											width="13"
											height="13"
											rx="2"
											ry="2"
										/><path
											d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
										/></svg
									>
								{/if}
							</button>
						</div>
					</div>

					<div
						class="flex items-center justify-between gap-4 px-4 py-[0.65rem] border-b border-[var(--sl-color-hairline)]"
					>
						<span
							class="text-[0.78rem] font-medium text-[var(--sl-color-gray-3)] font-mono shrink-0"
							>country</span
						>
						<span class="text-sm text-[var(--sl-color-text)] flex items-center gap-1.5">
							{#if demoCountry}
								<span class="text-[1.1rem] leading-none">{toFlag(demoCountry)}</span
								>
								{demoCountry}
							{:else}
								<span class="text-[var(--sl-color-gray-4)]">—</span>
							{/if}
						</span>
					</div>

					<div
						class="flex items-center justify-between gap-4 px-4 py-[0.65rem] border-b border-[var(--sl-color-hairline)]"
					>
						<span
							class="text-[0.78rem] font-medium text-[var(--sl-color-gray-3)] font-mono shrink-0"
							>valid</span
						>
						<span
							class="inline-flex items-center py-[0.15rem] px-[0.55rem] rounded-full text-xs font-semibold border {demoValid
								? 'bg-[rgba(134,239,172,0.15)] text-[#4ade80] border-[rgba(134,239,172,0.3)]'
								: 'bg-[rgba(248,113,113,0.15)] text-[#f87171] border-[rgba(248,113,113,0.3)]'}"
						>
							{demoValid ? '✓ valid' : '✗ invalid'}
						</span>
					</div>

					{#if demoError}
						<div
							class="flex items-center justify-between gap-4 px-4 py-[0.65rem] border-b border-[var(--sl-color-hairline)]"
						>
							<span
								class="text-[0.78rem] font-medium text-[var(--sl-color-gray-3)] font-mono shrink-0"
								>error</span
							>
							<span
								class="inline-flex items-center py-[0.15rem] px-[0.55rem] rounded-full text-xs font-semibold border bg-[rgba(251,191,36,0.15)] text-[#fbbf24] border-[rgba(251,191,36,0.3)]"
								>{demoError}</span
							>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</section>

	<!-- ── SECTION 2: INSTALL ────────────────────────────────────────── -->
	<section class="py-16 border-t border-[var(--sl-color-hairline)]">
		<div
			class="inline-block text-xs font-semibold tracking-[0.1em] uppercase text-[#7c3aed] mb-2"
		>
			Install
		</div>
		<h2
			class="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight text-[var(--sl-color-white)] m-0 mb-8"
		>
			Up and running in seconds
		</h2>

		<div
			class="max-w-[36rem] border border-[var(--sl-color-hairline)] rounded-xl overflow-hidden bg-[var(--sl-color-bg-nav)]"
		>
			<div role="tablist" class="flex border-b border-[var(--sl-color-hairline)]">
				{#each Object.keys(installCmds) as pkg (pkg)}
					<button
						role="tab"
						aria-selected={activePkg === pkg}
						class="px-[1.1rem] py-[0.55rem] text-[0.8rem] font-medium bg-transparent cursor-pointer transition-colors duration-150 -mb-px {activePkg ===
						pkg
							? 'text-[#7c3aed]'
							: 'text-[var(--sl-color-gray-3)] hover:text-[var(--sl-color-text)]'}"
						style="border: none; border-bottom: 2px solid {activePkg === pkg
							? '#7c3aed'
							: 'transparent'};"
						onclick={() => (activePkg = pkg as typeof activePkg)}
					>
						{pkg}
					</button>
				{/each}
			</div>
			<div class="flex items-center justify-between gap-4 px-[1.1rem] py-[0.85rem]">
				<code class="font-mono text-[0.9rem] text-[var(--sl-color-text)]"
					>{installCmds[activePkg]}</code
				>
				<button
					class="inline-flex items-center justify-center gap-[0.3rem] px-3 py-[0.35rem] rounded-[0.35rem] border border-[var(--sl-color-hairline)] bg-transparent text-[var(--sl-color-gray-3)] cursor-pointer text-xs transition-[background,color] duration-150 hover:bg-[var(--sl-color-bg-sidebar)] hover:text-[var(--sl-color-text)] shrink-0"
					aria-label="Copy install command"
					onclick={() => copy(installCmds[activePkg], (v) => (copiedInstall = v))}
				>
					{#if copiedInstall}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="15"
							height="15"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg
						>
						Copied!
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="15"
							height="15"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path
								d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
							/></svg
						>
						Copy
					{/if}
				</button>
			</div>
		</div>
	</section>

	<!-- ── SECTION 3: FEATURES ──────────────────────────────────────── -->
	<section class="py-16 border-t border-[var(--sl-color-hairline)]">
		<div
			class="inline-block text-xs font-semibold tracking-[0.1em] uppercase text-[#7c3aed] mb-2"
		>
			Features
		</div>
		<h2
			class="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight text-[var(--sl-color-white)] m-0 mb-8"
		>
			Everything you need, nothing you don't
		</h2>

		<div class="grid grid-cols-1 min-[600px]:grid-cols-2 min-[900px]:grid-cols-3 gap-4">
			{#each features as f (f.title)}
				<div
					class="p-5 border border-[var(--sl-color-hairline)] rounded-xl bg-[var(--sl-color-bg-nav)] transition-[border-color,background] duration-200 hover:border-[rgba(124,58,237,0.4)] hover:bg-[var(--sl-color-bg-sidebar)]"
				>
					<div
						class="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[rgba(124,58,237,0.12)] text-[#7c3aed] mb-3"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="22"
							height="22"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html f.svg}
						</svg>
					</div>
					<h3
						class="text-[0.95rem] font-semibold text-[var(--sl-color-white)] m-0 mb-[0.4rem]"
					>
						{f.title}
					</h3>
					<p class="text-[0.85rem] text-[var(--sl-color-gray-3)] leading-relaxed m-0">
						{f.desc}
					</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- ── SECTION 4: CODE SNIPPET ──────────────────────────────────── -->
	<section class="py-16 border-t border-[var(--sl-color-hairline)]">
		<div
			class="inline-block text-xs font-semibold tracking-[0.1em] uppercase text-[#7c3aed] mb-2"
		>
			Quick start
		</div>
		<h2
			class="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight text-[var(--sl-color-white)] m-0 mb-3"
		>
			Three bindings. That's it.
		</h2>
		<p class="text-base text-[var(--sl-color-gray-3)] m-0 mb-8 max-w-[56ch]">
			Minimal setup — bind <code>value</code>, <code>country</code>, and <code>valid</code> and
			you're done.
		</p>

		<div
			class="border border-[var(--sl-color-hairline)] rounded-xl overflow-hidden max-w-[42rem] mb-8"
		>
			<div
				class="flex items-center justify-between px-4 py-[0.6rem] bg-[#2a2a3a] border-b border-[rgba(255,255,255,0.08)]"
			>
				<div class="flex gap-1.5">
					<span
						class="w-[0.7rem] h-[0.7rem] rounded-full bg-[rgba(255,255,255,0.15)] block"
					></span>
					<span
						class="w-[0.7rem] h-[0.7rem] rounded-full bg-[rgba(255,255,255,0.15)] block"
					></span>
					<span
						class="w-[0.7rem] h-[0.7rem] rounded-full bg-[rgba(255,255,255,0.15)] block"
					></span>
				</div>
				<span
					class="text-[0.7rem] font-medium text-[rgba(255,255,255,0.35)] uppercase tracking-[0.05em]"
					>Svelte 5</span
				>
			</div>
			<!-- Svelte auto-escapes < and > in text content, so this is safe for a code block -->
			<pre
				class="m-0 px-6 py-5 bg-[#1e1e2e] text-[#cdd6f4] font-mono text-[0.85rem] leading-[1.65] overflow-x-auto whitespace-pre">{codeSnippet}</pre>
		</div>

		<div class="flex flex-wrap gap-3">
			<a
				href="/getting-started/quick-start/"
				class="inline-flex items-center gap-1.5 px-5 py-[0.6rem] rounded-lg text-[0.9rem] font-medium no-underline transition-[background] duration-150 bg-[#7c3aed] text-white hover:bg-[#6d28d9]"
			>
				Full quick start guide
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg
				>
			</a>
			<a
				href="/reference/props/"
				class="inline-flex items-center gap-1.5 px-5 py-[0.6rem] rounded-lg text-[0.9rem] font-medium no-underline transition-[background,border-color,color] duration-150 border border-[var(--sl-color-hairline)] text-[var(--sl-color-text)] bg-[var(--sl-color-bg-nav)] hover:bg-[var(--sl-color-bg-sidebar)] hover:border-[#7c3aed] hover:text-[#7c3aed]"
			>
				API Reference
			</a>
		</div>
	</section>
</div>
