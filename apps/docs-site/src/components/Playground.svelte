<script lang="ts">
	import { onDestroy } from 'svelte';
	import AdvancedPhoneInput from './examples/AdvancedPhoneInput.svelte';
	import type {
		CountryCode,
		DetailedValue,
		TelInputOptions,
		ValidationError
	} from 'svelte-tel-input/types';

	type Tab = 'usage' | 'validation' | 'events' | 'api';
	type EventName = 'onValueChange' | 'onCountryChange' | 'onValidityChange' | 'onError';
	type EventLogEntry = {
		id: number;
		name: EventName;
		payload: string;
		timestamp: string;
	};

	const tabs: { id: Tab; label: string; purpose: string }[] = [
		{
			id: 'usage',
			label: 'Usage',
			purpose: 'A styled input ready to drop into any form.'
		},
		{
			id: 'validation',
			label: 'Validation',
			purpose: 'Explore how validation modes and error states behave.'
		},
		{
			id: 'events',
			label: 'Events',
			purpose: 'See every callback fire as you type.'
		},
		{
			id: 'api',
			label: 'API',
			purpose: 'Control the component programmatically via bindings and methods.'
		}
	];

	const presets = [
		{ label: '🇺🇸 US', value: '+12015551234' },
		{ label: '🇬🇧 UK', value: '+441234567890' },
		{ label: '🇩🇪 DE', value: '+4915123456789' },
		{ label: '🇫🇷 FR', value: '+33612345678' },
		{ label: '🇧🇷 BR', value: '+5511987654321' },
		{ label: '⚠️ Invalid', value: '+1999' }
	];

	const BIND_VALUE = '+12014560001';
	const BIND_COUNTRY: CountryCode = 'DE';
	const INVALID_VALUE = '+1999';

	let activeTab = $state<Tab>('usage');
	let value = $state('+14155552671');
	let country = $state<CountryCode | null>(null);
	let valid = $state(true);
	let validationError = $state<ValidationError>(null);
	let detailedValue = $state<DetailedValue | null>(null);
	const options: TelInputOptions = $state({
		autoPlaceholder: true,
		allowedCountries: undefined,
		lockCountry: false,
		spaces: true,
		validateOn: 'input'
	});
	let required = $state(false);
	let defaultCountry = $state<CountryCode | null>(null);
	let initialFormat = $state<'international' | 'national'>('international');
	let placeholderFormat = $state<'international' | 'national' | undefined>(undefined);

	let advancedRef = $state<AdvancedPhoneInput | undefined>(undefined);
	let checkResult = $state<{ valid: boolean; error: ValidationError } | null>(null);
	let copied = $state(false);
	let detailsOpen = $state(false);
	let usageSuccessMessage = $state<string | null>(null);
	let eventLog = $state<EventLogEntry[]>([]);
	let eventLogStartedAt = $state(Date.now());

	let eventId = 0;
	let copiedTimer: ReturnType<typeof setTimeout> | null = null;
	let usageSuccessTimer: ReturnType<typeof setTimeout> | null = null;

	const activePurpose = $derived(
		tabs.find((tab) => tab.id === activeTab)?.purpose ?? 'Interact with the component live.'
	);
	const showOptionsBar = $derived(activeTab !== 'usage');
	const inputKey = $derived.by(() =>
		[
			activeTab,
			options.autoPlaceholder ? '1' : '0',
			options.lockCountry ? '1' : '0',
			options.spaces ? '1' : '0',
			options.validateOn ?? 'always',
			required ? '1' : '0',
			defaultCountry ?? '',
			(options.allowedCountries ?? []).join(','),
			activeTab === 'usage' ? 'usage-required' : 'shared-required',
			initialFormat,
			placeholderFormat ?? ''
		].join('|')
	);
	const allowedCountriesLabel = $derived.by(() =>
		options.allowedCountries?.length ? options.allowedCountries.join(', ') : 'All countries'
	);

	const toFlag = (cc: string | null): string =>
		cc
			? [...cc.toUpperCase()]
					.map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
					.join('')
			: '';

	const eventTone = (name: EventName) => {
		switch (name) {
			case 'onValueChange':
				return 'border-[rgba(74,222,128,0.35)] bg-[rgba(74,222,128,0.12)] text-[#166534] dark:text-[#86efac]';
			case 'onCountryChange':
				return 'border-[rgba(96,165,250,0.35)] bg-[rgba(96,165,250,0.12)] text-[#1d4ed8] dark:text-[#93c5fd]';
			case 'onValidityChange':
				return 'border-[rgba(251,191,36,0.35)] bg-[rgba(251,191,36,0.12)] text-[#b45309] dark:text-[#fcd34d]';
			case 'onError':
				return 'border-[rgba(248,113,113,0.35)] bg-[rgba(248,113,113,0.12)] text-[#b91c1c] dark:text-[#fca5a5]';
		}
	};

	const formatValidationMessage = (error: ValidationError): string => {
		if (!error) return 'Enter a valid phone number.';

		switch (error) {
			case 'REQUIRED':
				return 'Phone number is required.';
			case 'TOO_SHORT':
				return 'Phone number is incomplete.';
			case 'COUNTRY_NOT_ALLOWED':
				return 'This number is outside the allowed countries or conflicts with the locked country.';
			default:
				return `Phone number error: ${error.toLowerCase().replace(/_/g, ' ')}.`;
		}
	};

	function clearCopiedState() {
		copied = false;
		if (copiedTimer) {
			clearTimeout(copiedTimer);
			copiedTimer = null;
		}
	}

	function clearUsageSuccess() {
		usageSuccessMessage = null;
		if (usageSuccessTimer) {
			clearTimeout(usageSuccessTimer);
			usageSuccessTimer = null;
		}
	}

	function resetEventLog() {
		eventLog = [];
		eventLogStartedAt = Date.now();
	}

	function serializePayload(payload: unknown): string {
		try {
			if (payload === undefined) return 'undefined';
			return JSON.stringify(payload, null, 2);
		} catch {
			return String(payload);
		}
	}

	function pushEvent(name: EventName, payload: unknown) {
		if (activeTab !== 'events') return;

		const eventTime = Date.now();
		eventId += 1;
		eventLog = [
			{
				id: eventId,
				name,
				payload: serializePayload(payload),
				timestamp: `${((eventTime - eventLogStartedAt) / 1000).toFixed(1)} s`
			},
			...eventLog
		].slice(0, 50);
	}

	function setAllowedCountries(nextValue: CountryCode[] | undefined) {
		options.allowedCountries = nextValue;
		checkResult = null;
	}

	function setTab(tab: Tab) {
		if (activeTab === tab) return;

		activeTab = tab;
		checkResult = null;
		detailsOpen = false;
		clearUsageSuccess();

		if (tab === 'events') {
			resetEventLog();
		}
	}

	function applyPreset(nextValue: string) {
		value = nextValue;
		checkResult = null;
		clearUsageSuccess();
	}

	async function copyE164() {
		try {
			await navigator.clipboard.writeText(value);
			copied = true;
			if (copiedTimer) clearTimeout(copiedTimer);
			copiedTimer = setTimeout(() => {
				copied = false;
				copiedTimer = null;
			}, 2000);
		} catch {
			clearCopiedState();
		}
	}

	function handleUsageSubmit() {
		if (!valid) return;

		clearUsageSuccess();
		usageSuccessMessage = `Saved: ${value}`;
		usageSuccessTimer = setTimeout(() => {
			usageSuccessMessage = null;
			usageSuccessTimer = null;
		}, 3000);
	}

	function handleCountryChange(newCountry: CountryCode | null) {
		clearUsageSuccess();
		pushEvent('onCountryChange', { country: newCountry });
	}

	function handleValueChange(
		newValue: string,
		newDetails: Readonly<Partial<DetailedValue> | null>
	) {
		clearUsageSuccess();
		pushEvent('onValueChange', { value: newValue, detailedValue: newDetails });
	}

	function handleValidityChange(newValidity: boolean, error: ValidationError) {
		if (!newValidity) {
			clearUsageSuccess();
		}

		pushEvent('onValidityChange', { valid: newValidity, error });
	}

	function handleError(error: string) {
		pushEvent('onError', { error });
	}

	onDestroy(() => {
		clearCopiedState();
		clearUsageSuccess();
	});
</script>

<div
	class="not-content overflow-visible rounded-[0.875rem] border border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg-nav)]"
>
	<div
		role="tablist"
		class="flex items-center border-b border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg-sidebar)] px-1 rounded-t-[0.875rem]"
	>
		{#each tabs as tab (tab.id)}
			<button
				role="tab"
				aria-selected={activeTab === tab.id}
				class="-mb-px cursor-pointer bg-transparent px-[1.1rem] py-[0.65rem] text-xs font-medium transition-colors duration-150 {activeTab ===
				tab.id
					? 'text-[#7c3aed]'
					: 'text-[var(--sl-color-gray-3)] hover:text-[var(--sl-color-text)]'}"
				style="border: none; border-bottom: 2px solid {activeTab === tab.id
					? '#7c3aed'
					: 'transparent'};"
				onclick={() => setTab(tab.id)}
			>
				{tab.label}
			</button>
		{/each}
		<div class="flex-1"></div>
		<span class="hidden pr-3 text-[0.7rem] text-[var(--sl-color-gray-4)] sm:block"
			>Interact with the component live</span
		>
	</div>

	<div class="border-b border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg)] px-4 py-3">
		<p
			class="m-0 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--sl-color-gray-4)]"
		>
			Purpose
		</p>
		<p class="mt-1 text-sm text-[var(--sl-color-text)]">{activePurpose}</p>
	</div>

	{#if showOptionsBar}
		<div
			class="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg)] px-4 py-[0.6rem] text-xs"
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
				<input
					id="autoPlaceholder-0"
					type="checkbox"
					bind:checked={options.autoPlaceholder}
				/>
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
			<label class="inline-flex items-center gap-1.5 text-xs text-[var(--sl-color-text)]">
				Validate on
				<select
					id="validateOn-0"
					class="rounded-[0.35rem] border border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg-nav)] px-2 py-[0.2rem] text-[0.78rem] text-[var(--sl-color-text)]"
					value={options.validateOn ?? 'always'}
					onchange={(event) => {
						options.validateOn = (event.currentTarget as HTMLSelectElement).value as
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
			<label class="inline-flex items-center gap-1.5 text-xs text-[var(--sl-color-text)]">
				Initial format
				<select
					id="initialFormat-0"
					class="rounded-[0.35rem] border border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg-nav)] px-2 py-[0.2rem] text-[0.78rem] text-[var(--sl-color-text)]"
					value={initialFormat}
					onchange={(event) => {
						initialFormat = (event.currentTarget as HTMLSelectElement).value as
							| 'international'
							| 'national';
					}}
				>
					<option value="international">international</option>
					<option value="national">national</option>
				</select>
			</label>
			<label class="inline-flex items-center gap-1.5 text-xs text-[var(--sl-color-text)]">
				Placeholder format
				<select
					id="placeholderFormat-0"
					class="rounded-[0.35rem] border border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg-nav)] px-2 py-[0.2rem] text-[0.78rem] text-[var(--sl-color-text)]"
					value={placeholderFormat ?? ''}
					onchange={(event) => {
						const v = (event.currentTarget as HTMLSelectElement).value;
						placeholderFormat =
							v === '' ? undefined : (v as 'international' | 'national');
					}}
				>
					<option value="">auto</option>
					<option value="international">international</option>
					<option value="national">national</option>
				</select>
			</label>
		</div>
	{/if}

	{#if activeTab === 'validation'}
		<div
			class="border-b border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg)] px-4 py-3 text-xs"
		>
			<div class="flex flex-wrap items-center gap-2">
				<span
					class="text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-[var(--sl-color-gray-4)]"
					>Allowed countries:</span
				>
				<button
					data-testid="clear-allowed-btn"
					class="pg-pill {options.allowedCountries?.length ? '' : 'pg-pill-active'}"
					onclick={() => setAllowedCountries(undefined)}
				>
					All countries
				</button>
				<button
					data-testid="set-allowed-us-hu-btn"
					class="pg-pill {allowedCountriesLabel === 'US, HU' ? 'pg-pill-active' : ''}"
					onclick={() => setAllowedCountries(['US', 'HU'])}
				>
					US + HU
				</button>
				<button
					class="pg-pill {allowedCountriesLabel === 'US' ? 'pg-pill-active' : ''}"
					onclick={() => setAllowedCountries(['US'])}
				>
					US only
				</button>
				<button
					class="pg-pill {allowedCountriesLabel === 'GB, HU, US' ? 'pg-pill-active' : ''}"
					onclick={() => setAllowedCountries(['GB', 'HU', 'US'])}
				>
					GB + HU + US
				</button>
			</div>
			<div
				class="mt-2 flex flex-wrap items-center gap-2 text-[0.76rem] text-[var(--sl-color-gray-3)]"
			>
				<span>Current: {allowedCountriesLabel}</span>
				{#if options.lockCountry}
					<span
						class="rounded-full bg-[rgba(124,58,237,0.08)] px-2 py-1 text-[#7c3aed] dark:text-[#c4b5fd]"
						>Try typing +44 — country won't change.</span
					>
				{/if}
			</div>
		</div>
	{/if}

	<div
		class="flex flex-wrap items-center gap-2 border-b border-[var(--sl-color-hairline)] px-4 py-2"
	>
		<span
			class="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[var(--sl-color-gray-4)]"
			>Try:</span
		>
		{#each presets as preset (preset.value)}
			<button
				class="cursor-pointer rounded-full border border-[var(--sl-color-hairline)] bg-transparent px-[0.65rem] py-[0.2rem] text-[0.78rem] text-[var(--sl-color-text)] transition-[background,border-color,color] duration-150 hover:border-[#7c3aed] hover:bg-[rgba(124,58,237,0.08)] hover:text-[#7c3aed]"
				onclick={() => applyPreset(preset.value)}
			>
				{preset.label}
			</button>
		{/each}
	</div>

	{#if activeTab === 'usage'}
		<div class="p-5">
			<div class="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
				<div
					class="rounded-[1rem] border border-[var(--sl-color-hairline)] bg-[linear-gradient(180deg,rgba(124,58,237,0.06),transparent_38%),var(--sl-color-bg)] p-5"
				>
					<p
						class="m-0 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[#7c3aed]"
					>
						Checkout fragment
					</p>
					<h3 class="mt-2 text-xl font-semibold text-[var(--sl-color-text)]">
						Stay in the loop
					</h3>
					<p class="mt-2 text-sm leading-6 text-[var(--sl-color-gray-3)]">
						Add your phone number for delivery updates and account recovery.
					</p>

					<div class="mt-5 flex flex-col gap-3">
						<label
							class="text-sm font-medium text-[var(--sl-color-text)]"
							for="states-button">Phone number</label
						>
						{#key inputKey}
							<AdvancedPhoneInput
								bind:this={advancedRef}
								bind:value
								bind:selectedCountry={country}
								bind:valid
								bind:detailedValue
								bind:validationError
								{defaultCountry}
								options={{
									...options,
									allowedCountries: ['US', 'GB', 'DE', 'FR', 'BR']
								}}
								{initialFormat}
								{placeholderFormat}
								required={true}
								onCountryChange={handleCountryChange}
								onError={handleError}
								onValidityChange={handleValidityChange}
								onValueChange={handleValueChange}
							/>
						{/key}

						{#if !valid}
							<p
								data-testid="usage-error-message"
								class="m-0 rounded-[0.6rem] border border-[rgba(248,113,113,0.25)] bg-[rgba(248,113,113,0.1)] px-3 py-2 text-sm text-[#b91c1c] dark:text-[#fca5a5]"
							>
								{formatValidationMessage(validationError)}
							</p>
						{/if}
						<button
							data-testid="usage-submit-btn"
							class="mt-1 inline-flex items-center justify-center rounded-[0.8rem] bg-[#111827] px-4 py-3 text-sm font-semibold text-white transition-opacity duration-150 enabled:cursor-pointer enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-[#f8fafc] dark:text-[#111827]"
							disabled={!valid}
							onclick={handleUsageSubmit}
						>
							Continue
						</button>

						{#if usageSuccessMessage}
							<div
								data-testid="usage-success-banner"
								class="rounded-[0.8rem] border border-[rgba(74,222,128,0.28)] bg-[rgba(74,222,128,0.14)] px-3 py-2 text-sm font-medium text-[#166534] dark:text-[#86efac]"
							>
								✓ {usageSuccessMessage}
							</div>
						{/if}

						<span data-testid="value-display" style="display:none">{value}</span>
						<span data-testid="country-display" style="display:none"
							>{country ?? ''}</span
						>
						<span data-testid="valid-display" style="display:none">{String(valid)}</span
						>
						<span data-testid="validation-error-display" style="display:none"
							>{validationError ?? ''}</span
						>
					</div>
				</div>

				<div
					class="rounded-[1rem] border border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg)] p-5"
				>
					<p
						class="m-0 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--sl-color-gray-4)]"
					>
						Production feel
					</p>
					<ul
						class="mt-4 flex list-none flex-col gap-3 p-0 text-sm text-[var(--sl-color-gray-3)]"
					>
						<li
							class="rounded-[0.8rem] border border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg-sidebar)] px-3 py-3"
						>
							Country picker and phone input work as one field.
						</li>
						<li
							class="rounded-[0.8rem] border border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg-sidebar)] px-3 py-3"
						>
							Submission is blocked until the value is valid.
						</li>
						<li
							class="rounded-[0.8rem] border border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg-sidebar)] px-3 py-3"
						>
							Saved values stay in E.164, ready for backend storage.
						</li>
					</ul>
				</div>
			</div>
		</div>
	{:else}
		<div class="grid grid-cols-1 {activeTab === 'events' ? '' : 'md:grid-cols-2'}">
			<div
				class="flex flex-col gap-4 border-b border-[var(--sl-color-hairline)] p-5 {activeTab ===
				'events'
					? 'col-span-full'
					: 'md:border-b-0 md:border-r md:border-r-[var(--sl-color-hairline)]'}"
			>
				{#key inputKey}
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
						{initialFormat}
						{placeholderFormat}
						onCountryChange={handleCountryChange}
						onError={handleError}
						onValidityChange={handleValidityChange}
						onValueChange={handleValueChange}
					/>
				{/key}

				{#if activeTab === 'api'}
					<div
						class="flex flex-col gap-3 border-t border-[var(--sl-color-hairline)] pt-3"
					>
						<div class="flex flex-col gap-1.5">
							<p
								class="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.07em] text-[var(--sl-color-gray-4)]"
							>
								defaultCountry
							</p>
							<div class="flex flex-wrap items-center gap-2">
								<label
									class="inline-flex items-center gap-1.5 text-xs text-[var(--sl-color-text)]"
								>
									Reset target
									<select
										data-testid="default-country-select"
										class="rounded-[0.35rem] border border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg-nav)] px-2 py-[0.2rem] text-[0.78rem] text-[var(--sl-color-text)]"
										value={defaultCountry ?? ''}
										onchange={(event) => {
											const nextValue = (
												event.currentTarget as HTMLSelectElement
											).value;
											defaultCountry =
												nextValue === ''
													? null
													: (nextValue as CountryCode);
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
								class="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.07em] text-[var(--sl-color-gray-4)]"
							>
								Bindings
							</p>
							<div class="flex flex-wrap gap-1.5">
								<button
									data-testid="bind-set-value-btn"
									class="rounded-[0.35rem] border border-[rgba(59,130,246,0.25)] bg-[rgba(59,130,246,0.15)] px-3 py-[0.3rem] text-xs text-[#60a5fa] transition-opacity duration-150 hover:opacity-85"
									onclick={() => (value = BIND_VALUE)}
								>
									Set value
								</button>
								<button
									data-testid="bind-set-country-btn"
									class="rounded-[0.35rem] border border-[rgba(59,130,246,0.25)] bg-[rgba(59,130,246,0.15)] px-3 py-[0.3rem] text-xs text-[#60a5fa] transition-opacity duration-150 hover:opacity-85"
									onclick={() => (country = BIND_COUNTRY)}
								>
									Set country (DE)
								</button>
								<button
									data-testid="bind-clear-btn"
									class="rounded-[0.35rem] border border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg-sidebar)] px-3 py-[0.3rem] text-xs text-[var(--sl-color-text)] transition-opacity duration-150 hover:opacity-85"
									onclick={() => (value = '')}
								>
									Clear
								</button>
								<button
									data-testid="bind-set-invalid-btn"
									class="rounded-[0.35rem] border border-[rgba(248,113,113,0.25)] bg-[rgba(248,113,113,0.15)] px-3 py-[0.3rem] text-xs text-[#f87171] transition-opacity duration-150 hover:opacity-85"
									onclick={() => (value = INVALID_VALUE)}
								>
									Set invalid
								</button>
							</div>
						</div>

						<div class="flex flex-col gap-1.5">
							<p
								class="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.07em] text-[var(--sl-color-gray-4)]"
							>
								API methods
							</p>
							<div class="flex flex-wrap gap-1.5">
								<button
									data-testid="api-check-validity-btn"
									class="rounded-[0.35rem] border border-[rgba(74,222,128,0.25)] bg-[rgba(74,222,128,0.15)] px-3 py-[0.3rem] text-xs text-[#4ade80] transition-opacity duration-150 hover:opacity-85"
									onclick={() => {
										const result = advancedRef?.checkValidity();
										if (result !== undefined) checkResult = result;
									}}
								>
									checkValidity()
								</button>
								<button
									data-testid="api-reset-btn"
									class="rounded-[0.35rem] border border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg-sidebar)] px-3 py-[0.3rem] text-xs text-[var(--sl-color-text)] transition-opacity duration-150 hover:opacity-85"
									onclick={() => advancedRef?.reset()}
								>
									reset()
								</button>
								<button
									data-testid="api-reset-clear-country-btn"
									class="rounded-[0.35rem] border border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg-sidebar)] px-3 py-[0.3rem] text-xs text-[var(--sl-color-text)] transition-opacity duration-150 hover:opacity-85"
									onclick={() => advancedRef?.reset({ country: true })}
								>
									reset country
								</button>
							</div>
						</div>
					</div>
				{/if}
			</div>

			{#if activeTab === 'events'}
				<div data-testid="event-log-panel" class="col-span-full px-5 pb-5 pt-0">
					<div
						class="overflow-hidden rounded-[0.6rem] border border-[var(--sl-color-hairline)]"
					>
						<div
							class="flex items-center justify-between gap-3 border-b border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg-sidebar)] px-[0.9rem] py-[0.7rem]"
						>
							<div>
								<p
									class="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-[var(--sl-color-gray-3)]"
								>
									Event log
								</p>
								<p class="mt-1 text-sm text-[var(--sl-color-gray-3)]">
									Newest event first.
								</p>
							</div>
							<button
								data-testid="clear-event-log-btn"
								class="rounded-[0.35rem] border border-[var(--sl-color-hairline)] dark:border-gray-400 bg-transparent px-3 py-[0.3rem] text-xs text-[var(--sl-color-text)] transition-[background,color] duration-150 hover:bg-[var(--sl-color-bg)] enabled:cursor-pointer"
								onclick={resetEventLog}
							>
								Clear log
							</button>
						</div>

						<div class="max-h-[28rem] overflow-y-auto p-3">
							{#if eventLog.length === 0}
								<p
									class="m-0 rounded-[0.7rem] border border-dashed border-[var(--sl-color-hairline)] px-3 py-4 text-sm text-[var(--sl-color-gray-3)]"
								>
									Type into the input to see callbacks appear here.
								</p>
							{:else}
								<div class="flex flex-col gap-3">
									{#each eventLog as entry (entry.id)}
										<div
											data-testid="event-log-entry"
											class="rounded-[0.8rem] border px-3 py-3 {eventTone(
												entry.name
											)}"
										>
											<div class="flex items-center justify-between gap-2">
												<span class="font-mono text-[0.72rem] font-semibold"
													>{entry.name}</span
												>
												<span class="text-[0.72rem] opacity-80"
													>t+{entry.timestamp}</span
												>
											</div>
											<pre
												class="mt-2 overflow-x-auto whitespace-pre-wrap break-words bg-transparent p-0 text-[0.74rem] leading-6">{entry.payload}</pre>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</div>
			{:else}
				<div data-testid="api-test-panel" class="p-5">
					<div
						class="overflow-hidden rounded-[0.6rem] border border-[var(--sl-color-hairline)]"
					>
						<div
							class="flex items-center gap-1.5 border-b border-[var(--sl-color-hairline)] bg-[var(--sl-color-bg-sidebar)] px-[0.9rem] py-[0.55rem] text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-[var(--sl-color-gray-3)]"
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
								<circle cx="12" cy="12" r="10" /><polyline
									points="12 6 12 12 16 14"
								/>
							</svg>
							Live output
						</div>

						<div
							class="flex items-center justify-between gap-3 border-b border-[var(--sl-color-hairline)] px-[0.9rem] py-[0.55rem] text-[0.82rem]"
						>
							<span class="shrink-0 font-mono text-xs text-[var(--sl-color-gray-3)]"
								>value</span
							>
							<div class="flex min-w-0 items-center gap-1.5">
								<code
									class="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[0.8rem] text-[#a6e3a1]"
								>
									{value || '—'}
								</code>
								<span data-testid="value-display" style="display:none">{value}</span
								>
								<button
									class="inline-flex shrink-0 items-center justify-center rounded-[0.3rem] border border-[var(--sl-color-hairline)] bg-transparent px-[0.35rem] py-[0.2rem] text-[var(--sl-color-gray-3)] transition-[background,color] duration-150 hover:bg-[var(--sl-color-bg-sidebar)] hover:text-[var(--sl-color-text)] enabled:cursor-pointer"
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
							class="flex items-center justify-between gap-3 border-b border-[var(--sl-color-hairline)] px-[0.9rem] py-[0.55rem] text-[0.82rem]"
						>
							<span class="shrink-0 font-mono text-xs text-[var(--sl-color-gray-3)]"
								>country</span
							>
							<span
								class="flex items-center gap-[0.35rem] text-[var(--sl-color-text)]"
							>
								{#if country}
									<span class="text-base leading-none">{toFlag(country)}</span
									>{country}
								{:else}
									<span class="text-[var(--sl-color-gray-4)]">—</span>
								{/if}
								<span data-testid="country-display" style="display:none"
									>{country ?? ''}</span
								>
							</span>
						</div>

						<div
							class="flex items-center justify-between gap-3 border-b border-[var(--sl-color-hairline)] px-[0.9rem] py-[0.55rem] text-[0.82rem]"
						>
							<span class="shrink-0 font-mono text-xs text-[var(--sl-color-gray-3)]"
								>valid</span
							>
							<div style="display:flex; align-items:center; gap:0.4rem">
								<span
									class="inline-flex items-center rounded-full border px-[0.45rem] py-[0.1rem] text-[0.72rem] font-semibold {valid
										? 'border-[rgba(134,239,172,0.3)] bg-[rgba(134,239,172,0.15)] text-[#4ade80]'
										: 'border-[rgba(248,113,113,0.3)] bg-[rgba(248,113,113,0.15)] text-[#f87171]'}"
								>
									{valid ? '✓ valid' : '✗ invalid'}
								</span>
								<span data-testid="valid-display" style="display:none"
									>{String(valid)}</span
								>
							</div>
						</div>

						<div
							class="flex items-center justify-between gap-3 border-b border-[var(--sl-color-hairline)] px-[0.9rem] py-[0.55rem] text-[0.82rem]"
						>
							<span class="shrink-0 font-mono text-xs text-[var(--sl-color-gray-3)]"
								>error</span
							>
							<div style="display:flex; align-items:center; gap:0.4rem">
								{#if validationError}
									<span
										class="inline-flex items-center rounded-full border border-[rgba(251,191,36,0.25)] bg-[rgba(251,191,36,0.12)] px-[0.45rem] py-[0.1rem] text-[0.72rem] font-semibold text-[#fbbf24]"
									>
										{validationError}
									</span>
								{:else}
									<span class="text-[var(--sl-color-gray-4)]">—</span>
								{/if}
								<span data-testid="validation-error-display" style="display:none"
									>{validationError ?? ''}</span
								>
							</div>
						</div>

						{#if activeTab === 'api' && checkResult !== null}
							<div
								class="flex items-center justify-between gap-3 border-b border-[var(--sl-color-hairline)] bg-[rgba(124,58,237,0.05)] px-[0.9rem] py-[0.55rem] text-[0.82rem]"
							>
								<span
									class="shrink-0 font-mono text-xs text-[var(--sl-color-gray-3)]"
								>
									checkValidity()
								</span>
								<span
									class="flex items-center gap-[0.35rem] text-[var(--sl-color-text)]"
								>
									<span
										class="inline-flex items-center rounded-full border px-[0.45rem] py-[0.1rem] text-[0.72rem] font-semibold {checkResult.valid
											? 'border-[rgba(134,239,172,0.3)] bg-[rgba(134,239,172,0.15)] text-[#4ade80]'
											: 'border-[rgba(248,113,113,0.3)] bg-[rgba(248,113,113,0.15)] text-[#f87171]'}"
									>
										{checkResult.valid ? '✓ valid' : '✗ invalid'}
									</span>
									<span data-testid="check-validity-result" style="display:none"
										>{String(checkResult.valid)}</span
									>
									<span
										data-testid="check-validity-error-result"
										style="display:none">{checkResult.error ?? ''}</span
									>
									{#if checkResult.error}
										<span
											class="inline-flex items-center rounded-full border border-[rgba(251,191,36,0.25)] bg-[rgba(251,191,36,0.12)] px-[0.45rem] py-[0.1rem] text-[0.72rem] font-semibold text-[#fbbf24]"
										>
											{checkResult.error}
										</span>
									{/if}
								</span>
							</div>
						{/if}

						<div class="px-[0.9rem] py-[0.55rem]">
							<button
								class="inline-flex cursor-pointer items-center gap-[0.3rem] border-none bg-transparent p-0 font-mono text-xs text-[var(--sl-color-gray-3)] transition-colors duration-150 hover:text-[#7c3aed]"
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
			{/if}

			{#if activeTab !== 'events' && detailsOpen}
				<div class="col-span-full p-3">
					<pre
						class="mt-2 max-h-64 overflow-x-auto overflow-y-auto whitespace-pre rounded-[0.4rem] bg-[rgba(0,0,0,0.18)] p-3 font-mono text-[0.72rem] leading-relaxed text-[var(--sl-color-gray-2)]">{JSON.stringify(
							detailedValue,
							null,
							2
						)}</pre>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
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

	.pg-pill {
		border: 1px solid var(--sl-color-hairline);
		border-radius: 999px;
		background: transparent;
		color: var(--sl-color-text);
		cursor: pointer;
		font-size: 0.78rem;
		padding: 0.25rem 0.7rem;
		transition:
			background 0.15s,
			border-color 0.15s,
			color 0.15s;
	}

	.pg-pill:hover,
	.pg-pill-active {
		background: rgba(124, 58, 237, 0.08);
		border-color: #7c3aed;
		color: #7c3aed;
	}
</style>
