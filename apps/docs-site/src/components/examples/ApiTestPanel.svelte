<script lang="ts">
	import type AdvancedPhoneInput from './AdvancedPhoneInput.svelte';
	import type { DetailedValue, CountryCode, ValidationError } from 'svelte-tel-input/types';

	// Fixed test values — deliberately distinct so tests can assert exact strings
	const BIND_VALUE = '+12014560001'; // US valid number (set via binding)
	const BIND_COUNTRY = 'DE' as CountryCode; // set via binding
	const INVALID_VALUE = '+1999'; // partial / invalid

	interface Props {
		value: string;
		country: CountryCode | null;
		valid: boolean;
		validationError?: ValidationError;
		detailedValue: DetailedValue | null;
		apiRef?: AdvancedPhoneInput;
		onSetAllowedCountries?: (countries: CountryCode[] | undefined) => void;
	}

	let {
		value = $bindable(''),
		country = $bindable<CountryCode | null>(null),
		valid = $bindable(true),
		validationError = $bindable<ValidationError>(null),
		detailedValue = $bindable<DetailedValue | null>(null),
		apiRef,
		onSetAllowedCountries
	}: Props = $props();

	let checkValidityResult = $state<{ valid: boolean; error: ValidationError } | null>(null);
</script>

<div data-testid="api-test-panel" class="flex flex-col gap-4">
	<div class="flex flex-wrap gap-2">
		<p class="w-full text-sm font-semibold text-gray-600 dark:text-gray-400">Binding</p>
		<button
			data-testid="bind-set-value-btn"
			type="button"
			class="px-3 py-1 text-sm rounded bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
			onclick={() => {
				value = BIND_VALUE;
			}}
		>
			Set value (bind)
		</button>
		<button
			data-testid="bind-set-country-btn"
			type="button"
			class="px-3 py-1 text-sm rounded bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
			onclick={() => {
				country = BIND_COUNTRY;
			}}
		>
			Set country (bind)
		</button>
		<button
			data-testid="bind-clear-btn"
			type="button"
			class="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={() => {
				value = '';
			}}
		>
			Clear (bind)
		</button>
		<button
			data-testid="bind-set-invalid-btn"
			type="button"
			class="px-3 py-1 text-sm rounded bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
			onclick={() => {
				value = INVALID_VALUE;
			}}
		>
			Set invalid (bind)
		</button>
	</div>

	<div class="flex flex-wrap gap-2">
		<p class="w-full text-sm font-semibold text-gray-600 dark:text-gray-400">API methods</p>
		<button
			data-testid="api-check-validity-btn"
			type="button"
			class="px-3 py-1 text-sm rounded bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800"
			onclick={() => {
				const result = apiRef?.checkValidity();
				if (result !== undefined) checkValidityResult = result;
			}}
		>
			checkValidity()
		</button>
		<button
			data-testid="api-reset-btn"
			type="button"
			class="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={() => {
				apiRef?.reset();
			}}
		>
			reset()
		</button>
	</div>

	<div class="flex flex-wrap gap-2">
		<p class="w-full text-sm font-semibold text-gray-600 dark:text-gray-400">
			allowedCountries
		</p>
		<button
			data-testid="set-allowed-us-hu-btn"
			type="button"
			class="px-3 py-1 text-sm rounded bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-800"
			onclick={() => onSetAllowedCountries?.(['US', 'HU'] as CountryCode[])}
		>
			Allow US + HU only
		</button>
		<button
			data-testid="clear-allowed-btn"
			type="button"
			class="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={() => onSetAllowedCountries?.(undefined)}
		>
			Clear allowedCountries
		</button>
	</div>

	<div class="flex flex-wrap gap-4 text-sm text-gray-700 dark:text-gray-300">
		<span>value: <span data-testid="value-display">{value}</span></span>
		<span>country: <span data-testid="country-display">{country ?? ''}</span></span>
		<span>valid: <span data-testid="valid-display">{valid}</span></span>
		<span
			>validationError: <span data-testid="validation-error-display"
				>{validationError ?? ''}</span
			></span
		>
		{#if checkValidityResult !== null}
			<span
				>checkValidity: <span data-testid="check-validity-result"
					>{checkValidityResult.valid}</span
				></span
			>
			<span
				>checkValidity error: <span data-testid="check-validity-error-result"
					>{checkValidityResult.error ?? ''}</span
				></span
			>
		{/if}
	</div>
</div>
