<script lang="ts">
	import AdvancedPhoneInput from './examples/AdvancedPhoneInput.svelte';
	import BasicPhoneInput from './examples/BasicPhoneInput.svelte';
	import type {
		DetailedValue,
		TelInputOptions,
		CountryCode,
		ValidationError
	} from 'svelte-tel-input/types';

	// ── Tab state ────────────────────────────────────────────────────
	type Tab = 'basic' | 'advanced' | 'api';
	let activeTab = $state<Tab>('advanced');

	// ── Shared bindings ──────────────────────────────────────────────
	let value = $state('+14155552671');
	let country = $state<CountryCode | null>(null);
	let valid = $state(true);
	let validationError = $state<ValidationError>(null);
	let detailedValue = $state<DetailedValue | null>(null);
	const options: TelInputOptions = $state({
		autoPlaceholder: true,
		lockCountry: false,
		spaces: true,
		validateOn: 'input'
	});
	let required = $state(false);
	let defaultCountry = $state<CountryCode | null>(null);

	let advancedRef = $state<AdvancedPhoneInput | undefined>(undefined);
	let checkResult = $state<{ valid: boolean; error: ValidationError } | null>(null);

	// ── Tab setter — resets transient state on each switch ─────────────
	function setTab(tab: Tab) {
		activeTab = tab;
		checkResult = null;
	}

	// ── Copy ─────────────────────────────────────────────────────────
	let copied = $state(false);
	async function copyE164() {
		try {
			await navigator.clipboard.writeText(value);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {}
	}

	// ── Presets ──────────────────────────────────────────────────────
	const presets = [
		{ label: '🇺🇸 US', value: '+12015551234' },
		{ label: '🇬🇧 UK', value: '+447911123456' },
		{ label: '🇩🇪 DE', value: '+4915123456789' },
		{ label: '🇫🇷 FR', value: '+33612345678' },
		{ label: '🇧🇷 BR', value: '+5511987654321' },
		{ label: '⚠️ Invalid', value: '+1999' }
	];

	// ── Helpers ──────────────────────────────────────────────────────
	const toFlag = (cc: string | null): string =>
		cc
			? [...cc.toUpperCase()]
					.map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
					.join('')
			: '';

	// Binding test values (for API tab)
	const BIND_VALUE = '+12014560001';
	const BIND_COUNTRY: CountryCode = 'DE';
	const INVALID_VALUE = '+1999';

	// ── detailedValue collapsed ───────────────────────────────────────
	let detailsOpen = $state(false);
</script>

<div
	class="not-content border border-[var(--sl-color-hairline)] rounded-[0.875rem] overflow-hidden bg-[var(--sl-color-bg-nav)]"
>
	<!-- ── Tabs ─────────────────────────────────────────────────────── -->
	<div
		role="tablist"
		class="flex items-center border-b border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg-sidebar)] px-1"
	>
		{#each [['basic', 'Basic'], ['advanced', 'Advanced'], ['api', 'API Test']] as [tab, label] (tab)}
			<button
				role="tab"
				aria-selected={activeTab === tab}
				class="px-[1.1rem] py-[0.65rem] text-xs font-medium bg-transparent cursor-pointer transition-colors duration-150 -mb-px {activeTab ===
				tab
					? 'text-[#7c3aed]'
					: 'text-[var(--sl-color-gray-3)] hover:text-[var(--sl-color-text)]'}"
				style="border: none; border-bottom: 2px solid {activeTab === tab
					? '#7c3aed'
					: 'transparent'};"
				onclick={() => setTab(tab as Tab)}
			>
				{label}
			</button>
		{/each}
		<div class="flex-1"></div>
		<span class="text-[0.7rem] text-[var(--sl-color-gray-4)] pr-3 hidden sm:block"
			>Interact with the component live</span
		>
	</div>

	<!-- ── Options bar ───────────────────────────────────────────────── -->
	<div
		class="flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-[0.6rem] border-b border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg)] text-xs"
	>
		<span
			class="text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-[var(--sl-color-gray-4)]"
			>Options:</span
		>
		<label class="pg-toggle">
			<input id="spaces-0" type="checkbox" bind:checked={options.spaces} />
			<span class="pg-toggle-knob"></span>
			<span>Spaces</span>
		</label>
		<label class="pg-toggle">
			<input id="autoPlaceholder-0" type="checkbox" bind:checked={options.autoPlaceholder} />
			<span class="pg-toggle-knob"></span>
			<span>Auto-placeholder</span>
		</label>
		<label class="pg-toggle">
			<input id="required-0" type="checkbox" bind:checked={required} />
			<span class="pg-toggle-knob"></span>
			<span>Required</span>
		</label>
		<label class="pg-toggle">
			<input id="lockCountry-0" type="checkbox" bind:checked={options.lockCountry} />
			<span class="pg-toggle-knob"></span>
			<span>Lock country</span>
		</label>
		<label class="inline-flex items-center gap-1.5 text-[var(--sl-color-text)] text-xs">
			Validate on
			<select
				id="validateOn-0"
				class="text-[0.78rem] px-2 py-[0.2rem] rounded-[0.35rem] border border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg-nav)] text-[var(--sl-color-text)]"
				value={options.validateOn ?? 'always'}
				onchange={(e) => {
					options.validateOn = (e.currentTarget as HTMLSelectElement).value as
						| 'input'
						| 'blur'
						| 'always';
				}}
			>
				<option value="always">always</option>
				<option value="input">input</option>
				<option value="blur">blur</option>
			</select>
		</label>
	</div>

	<!-- ── Preset buttons ────────────────────────────────────────────── -->
	<div
		class="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-[var(--sl-color-hairline)]"
	>
		<span
			class="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[var(--sl-color-gray-4)]"
			>Try:</span
		>
		{#each presets as p (p.value)}
			<button
				class="px-[0.65rem] py-[0.2rem] text-[0.78rem] rounded-full border border-[var(--sl-color-hairline)] bg-transparent text-[var(--sl-color-text)] cursor-pointer transition-[background,border-color,color] duration-150 hover:bg-[rgba(124,58,237,0.08)] hover:border-[#7c3aed] hover:text-[#7c3aed]"
				onclick={() => (value = p.value)}>{p.label}</button
			>
		{/each}
	</div>

	<!-- ── Main 2-column grid ────────────────────────────────────────── -->
	<div class="grid grid-cols-1 md:grid-cols-2">
		<!-- LEFT: Input component -->
		<div
			class="p-5 border-b border-[var(--sl-color-hairline)] md:border-b-0 md:border-r md:border-r-[var(--sl-color-hairline)] flex flex-col gap-4"
		>
			{#key options}
				{#if activeTab === 'basic'}
					<BasicPhoneInput
						bind:value
						bind:country
						bind:valid
						bind:detailedValue
						{options}
					/>
				{:else}
					<AdvancedPhoneInput
						bind:this={advancedRef}
						bind:value
						bind:selectedCountry={country}
						bind:valid
						bind:detailedValue
						bind:validationError
						{defaultCountry}
						{options}
						{required}
					/>
				{/if}
			{/key}

			<!-- API Test actions (only on API tab) -->
			{#if activeTab === 'api'}
				<div class="flex flex-col gap-3 pt-3 border-t border-[var(--sl-color-hairline)]">
					<div class="flex flex-col gap-1.5">
						<p
							class="text-[0.7rem] font-semibold uppercase tracking-[0.07em] text-[var(--sl-color-gray-4)] m-0"
						>
							defaultCountry
						</p>
						<div class="flex flex-wrap items-center gap-2">
							<label
								class="inline-flex items-center gap-1.5 text-[var(--sl-color-text)] text-xs"
							>
								Reset target
								<select
									data-testid="default-country-select"
									class="text-[0.78rem] px-2 py-[0.2rem] rounded-[0.35rem] border border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg-nav)] text-[var(--sl-color-text)]"
									value={defaultCountry ?? ''}
									onchange={(e) => {
										const nextValue = (e.currentTarget as HTMLSelectElement)
											.value;
										defaultCountry =
											nextValue === '' ? null : (nextValue as CountryCode);
									}}
								>
									<option value="">none</option>
									<option value="US">US</option>
									<option value="HU">HU</option>
									<option value="DE">DE</option>
									<option value="GB">GB</option>
								</select>
							</label>
							<span
								data-testid="default-country-display"
								class="text-[0.72rem] text-[var(--sl-color-gray-3)]"
							>
								{defaultCountry ?? ''}
							</span>
						</div>
					</div>

					<div class="flex flex-col gap-1.5">
						<p
							class="text-[0.7rem] font-semibold uppercase tracking-[0.07em] text-[var(--sl-color-gray-4)] m-0"
						>
							Bindings
						</p>
						<div class="flex flex-wrap gap-1.5">
							<button
								data-testid="bind-set-value-btn"
								class="px-3 py-[0.3rem] text-xs rounded-[0.35rem] border cursor-pointer hover:opacity-85 transition-opacity duration-150 bg-[rgba(59,130,246,0.15)] text-[#60a5fa] border-[rgba(59,130,246,0.25)]"
								onclick={() => (value = BIND_VALUE)}>Set value</button
							>
							<button
								data-testid="bind-set-country-btn"
								class="px-3 py-[0.3rem] text-xs rounded-[0.35rem] border cursor-pointer hover:opacity-85 transition-opacity duration-150 bg-[rgba(59,130,246,0.15)] text-[#60a5fa] border-[rgba(59,130,246,0.25)]"
								onclick={() => (country = BIND_COUNTRY)}>Set country (DE)</button
							>
							<button
								data-testid="bind-clear-btn"
								class="px-3 py-[0.3rem] text-xs rounded-[0.35rem] border cursor-pointer hover:opacity-85 transition-opacity duration-150 bg-[var(--sl-color-bg-sidebar)] text-[var(--sl-color-text)] border-[var(--sl-color-hairline)]"
								onclick={() => (value = '')}>Clear</button
							>
							<button
								data-testid="bind-set-invalid-btn"
								class="px-3 py-[0.3rem] text-xs rounded-[0.35rem] border cursor-pointer hover:opacity-85 transition-opacity duration-150 bg-[rgba(248,113,113,0.15)] text-[#f87171] border-[rgba(248,113,113,0.25)]"
								onclick={() => (value = INVALID_VALUE)}>Set invalid</button
							>
						</div>
					</div>

					<div class="flex flex-col gap-1.5">
						<p
							class="text-[0.7rem] font-semibold uppercase tracking-[0.07em] text-[var(--sl-color-gray-4)] m-0"
						>
							API methods
						</p>
						<div class="flex flex-wrap gap-1.5">
							<button
								data-testid="api-check-validity-btn"
								class="px-3 py-[0.3rem] text-xs rounded-[0.35rem] border cursor-pointer hover:opacity-85 transition-opacity duration-150 bg-[rgba(74,222,128,0.15)] text-[#4ade80] border-[rgba(74,222,128,0.25)]"
								onclick={() => {
									const r = advancedRef?.checkValidity();
									if (r !== undefined) checkResult = r;
								}}>checkValidity()</button
							>
							<button
								data-testid="api-reset-btn"
								class="px-3 py-[0.3rem] text-xs rounded-[0.35rem] border cursor-pointer hover:opacity-85 transition-opacity duration-150 bg-[var(--sl-color-bg-sidebar)] text-[var(--sl-color-text)] border-[var(--sl-color-hairline)]"
								onclick={() => advancedRef?.reset()}>reset()</button
							>
							<button
								data-testid="api-reset-clear-country-btn"
								class="px-3 py-[0.3rem] text-xs rounded-[0.35rem] border cursor-pointer hover:opacity-85 transition-opacity duration-150 bg-[var(--sl-color-bg-sidebar)] text-[var(--sl-color-text)] border-[var(--sl-color-hairline)]"
								onclick={() => advancedRef?.reset({ country: true })}
								>reset country</button
							>
						</div>
					</div>

					<div class="flex flex-col gap-1.5">
						<p
							class="text-[0.7rem] font-semibold uppercase tracking-[0.07em] text-[var(--sl-color-gray-4)] m-0"
						>
							allowedCountries
						</p>
						<div class="flex flex-wrap gap-1.5">
							<button
								data-testid="set-allowed-us-hu-btn"
								class="px-3 py-[0.3rem] text-xs rounded-[0.35rem] border cursor-pointer hover:opacity-85 transition-opacity duration-150 bg-[rgba(251,191,36,0.15)] text-[#fbbf24] border-[rgba(251,191,36,0.25)]"
								onclick={() =>
									(options.allowedCountries = ['US', 'HU'] as CountryCode[])}
								>Allow US + HU only</button
							>
							<button
								data-testid="clear-allowed-btn"
								class="px-3 py-[0.3rem] text-xs rounded-[0.35rem] border cursor-pointer hover:opacity-85 transition-opacity duration-150 bg-[var(--sl-color-bg-sidebar)] text-[var(--sl-color-text)] border-[var(--sl-color-hairline)]"
								onclick={() => (options.allowedCountries = undefined)}
								>Clear filter</button
							>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- RIGHT: Live output panel -->
		<div data-testid="api-test-panel" class="p-5">
			<div class="border border-[var(--sl-color-hairline)] rounded-[0.6rem] overflow-hidden">
				<div
					class="flex items-center gap-1.5 px-[0.9rem] py-[0.55rem] text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-[var(--sl-color-gray-3)] bg-[var(--sl-color-bg-sidebar)] border-b border-[var(--sl-color-hairline)]"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="13"
						height="13"
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

				<!-- value -->
				<div
					class="flex items-center justify-between gap-3 px-[0.9rem] py-[0.55rem] border-b border-[var(--sl-color-hairline)] text-[0.82rem]"
				>
					<span class="font-mono text-xs text-[var(--sl-color-gray-3)] shrink-0"
						>value</span
					>
					<div class="flex items-center gap-1.5 min-w-0">
						<code
							class="font-mono text-[0.8rem] text-[#a6e3a1] whitespace-nowrap overflow-hidden text-ellipsis"
							>{value || '—'}</code
						>
						<span data-testid="value-display" style="display:none">{value}</span>
						<button
							class="inline-flex items-center justify-center px-[0.35rem] py-[0.2rem] rounded-[0.3rem] border border-[var(--sl-color-hairline)] bg-transparent text-[var(--sl-color-gray-3)] cursor-pointer hover:bg-[var(--sl-color-bg-sidebar)] hover:text-[var(--sl-color-text)] transition-[background,color] duration-150 shrink-0"
							aria-label="Copy E.164 value"
							onclick={copyE164}
						>
							{#if copied}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="13"
									height="13"
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
									width="13"
									height="13"
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
							{/if}
						</button>
					</div>
				</div>

				<!-- country -->
				<div
					class="flex items-center justify-between gap-3 px-[0.9rem] py-[0.55rem] border-b border-[var(--sl-color-hairline)] text-[0.82rem]"
				>
					<span class="font-mono text-xs text-[var(--sl-color-gray-3)] shrink-0"
						>country</span
					>
					<span class="text-[var(--sl-color-text)] flex items-center gap-[0.35rem]">
						{#if country}
							<span class="text-base leading-none">{toFlag(country)}</span>{country}
						{:else}
							<span class="text-[var(--sl-color-gray-4)]">—</span>
						{/if}
						<span data-testid="country-display" style="display:none"
							>{country ?? ''}</span
						>
					</span>
				</div>

				<!-- valid -->
				<div
					class="flex items-center justify-between gap-3 px-[0.9rem] py-[0.55rem] border-b border-[var(--sl-color-hairline)] text-[0.82rem]"
				>
					<span class="font-mono text-xs text-[var(--sl-color-gray-3)] shrink-0"
						>valid</span
					>
					<div style="display:flex; align-items:center; gap:0.4rem">
						<span
							class="inline-flex items-center px-[0.45rem] py-[0.1rem] rounded-full text-[0.72rem] font-semibold border {valid
								? 'bg-[rgba(134,239,172,0.15)] text-[#4ade80] border-[rgba(134,239,172,0.3)]'
								: 'bg-[rgba(248,113,113,0.15)] text-[#f87171] border-[rgba(248,113,113,0.3)]'}"
						>
							{valid ? '✓ valid' : '✗ invalid'}
						</span>
						<span data-testid="valid-display" style="display:none">{String(valid)}</span
						>
					</div>
				</div>

				<!-- validationError -->
				<div
					class="flex items-center justify-between gap-3 px-[0.9rem] py-[0.55rem] border-b border-[var(--sl-color-hairline)] text-[0.82rem]"
				>
					<span class="font-mono text-xs text-[var(--sl-color-gray-3)] shrink-0"
						>error</span
					>
					<div style="display:flex; align-items:center; gap:0.4rem">
						{#if validationError}
							<span
								class="inline-flex items-center px-[0.45rem] py-[0.1rem] rounded-full text-[0.72rem] font-semibold border bg-[rgba(251,191,36,0.12)] text-[#fbbf24] border-[rgba(251,191,36,0.25)]"
								>{validationError}</span
							>
						{:else}
							<span class="text-[var(--sl-color-gray-4)]">—</span>
						{/if}
						<span data-testid="validation-error-display" style="display:none"
							>{validationError ?? ''}</span
						>
					</div>
				</div>

				<!-- checkValidity result (API tab) -->
				{#if checkResult !== null}
					<div
						class="flex items-center justify-between gap-3 px-[0.9rem] py-[0.55rem] border-b border-[var(--sl-color-hairline)] text-[0.82rem] bg-[rgba(124,58,237,0.05)]"
					>
						<span class="font-mono text-xs text-[var(--sl-color-gray-3)] shrink-0"
							>checkValidity()</span
						>
						<span class="text-[var(--sl-color-text)] flex items-center gap-[0.35rem]">
							<span
								class="inline-flex items-center px-[0.45rem] py-[0.1rem] rounded-full text-[0.72rem] font-semibold border {checkResult.valid
									? 'bg-[rgba(134,239,172,0.15)] text-[#4ade80] border-[rgba(134,239,172,0.3)]'
									: 'bg-[rgba(248,113,113,0.15)] text-[#f87171] border-[rgba(248,113,113,0.3)]'}"
							>
								{checkResult.valid ? '✓ valid' : '✗ invalid'}
							</span>
							<span data-testid="check-validity-result" style="display:none"
								>{String(checkResult.valid)}</span
							>
							<span data-testid="check-validity-error-result" style="display:none"
								>{checkResult.error ?? ''}</span
							>
							{#if checkResult.error}
								<span
									class="inline-flex items-center px-[0.45rem] py-[0.1rem] rounded-full text-[0.72rem] font-semibold border bg-[rgba(251,191,36,0.12)] text-[#fbbf24] border-[rgba(251,191,36,0.25)]"
									>{checkResult.error}</span
								>
							{/if}
						</span>
					</div>
				{/if}

				<!-- detailedValue expandable -->
				<div class="px-[0.9rem] py-[0.55rem]">
					<button
						class="inline-flex items-center gap-[0.3rem] font-mono text-xs text-[var(--sl-color-gray-3)] bg-transparent border-none cursor-pointer p-0 hover:text-[#7c3aed] transition-colors duration-150"
						aria-expanded={detailsOpen}
						onclick={() => (detailsOpen = !detailsOpen)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							style="transform: rotate({detailsOpen
								? 90
								: 0}deg); transition: transform 0.2s"
						>
							<path d="m9 18 6-6-6-6" />
						</svg>
						detailedValue
					</button>
				</div>
			</div>
		</div>
		{#if detailsOpen}
			<div class="col-span-full p-3">
				<pre
					class="mt-2 p-3 rounded-[0.4rem] bg-[rgba(0,0,0,0.18)] font-mono text-[0.72rem] text-[var(--sl-color-gray-2)] leading-relaxed overflow-x-auto whitespace-pre max-h-64 overflow-y-auto">{JSON.stringify(
						detailedValue,
						null,
						2
					)}</pre>
			</div>
		{/if}
	</div>
</div>

<style>
	/* Toggle widget — pseudo-element styles cannot be expressed as Tailwind utilities */
	.pg-toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		cursor: pointer;
		color: var(--sl-color-text);
		user-select: none;
	}

	.pg-toggle input[type='checkbox'] {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	.pg-toggle-knob {
		position: relative;
		display: inline-block;
		width: 2rem;
		height: 1.1rem;
		border-radius: 999px;
		background: var(--sl-color-gray-5, #888);
		transition: background 0.2s;
		flex-shrink: 0;
	}

	.pg-toggle-knob::after {
		content: '';
		position: absolute;
		top: 0.15rem;
		left: 0.15rem;
		width: 0.8rem;
		height: 0.8rem;
		border-radius: 50%;
		background: #fff;
		transition: transform 0.2s;
	}

	.pg-toggle input[type='checkbox']:checked + .pg-toggle-knob {
		background: #7c3aed;
	}

	.pg-toggle input[type='checkbox']:checked + .pg-toggle-knob::after {
		transform: translateX(0.9rem);
	}
</style>
