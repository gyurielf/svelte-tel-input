<script lang="ts">
	import AdvancedPhoneInput from './examples/AdvancedPhoneInput.svelte';
	import ApiTestPanel from './examples/ApiTestPanel.svelte';
	import PayloadBlock from './utils/PayloadBlock.svelte';
	import OptionsPanel from './OptionsPanel.svelte';
	import type {
		DetailedValue,
		TelInputOptions,
		CountryCode,
		ValidationError
	} from 'svelte-tel-input/types';

	interface ExampleProps {
		value: string;
		detailedValue: DetailedValue | null;
		valid: boolean;
		country: CountryCode | null;
	}

	const advancedExampleProps = $state({
		value: '+36201234567',
		detailedValue: null,
		valid: true,
		country: null
	} satisfies ExampleProps);

	let advancedExampleOptions: TelInputOptions = $state({
		autoPlaceholder: true,
		spaces: true,
		validateOn: 'input'
	});

	let advancedExampleRequired = $state(true);
	let advancedExampleComponent: AdvancedPhoneInput | undefined = $state();
	let advancedExampleValidationError = $state<ValidationError>(null);
</script>

<div class="not-content">
	<div class="grid gap-y-6">
		{#key advancedExampleOptions}
			<AdvancedPhoneInput
				bind:this={advancedExampleComponent}
				options={advancedExampleOptions}
				required={advancedExampleRequired}
				bind:value={advancedExampleProps.value}
				bind:detailedValue={advancedExampleProps.detailedValue}
				bind:valid={advancedExampleProps.valid}
				bind:validationError={advancedExampleValidationError}
				bind:selectedCountry={advancedExampleProps.country}
			/>
		{/key}
		<OptionsPanel
			bind:options={advancedExampleOptions}
			bind:required={advancedExampleRequired}
		/>
		<ApiTestPanel
			bind:value={advancedExampleProps.value}
			bind:country={advancedExampleProps.country}
			bind:valid={advancedExampleProps.valid}
			validationError={advancedExampleValidationError}
			bind:detailedValue={advancedExampleProps.detailedValue}
			apiRef={advancedExampleComponent}
			onSetAllowedCountries={(countries) => {
				advancedExampleOptions.allowedCountries = countries;
			}}
		/>
		<PayloadBlock
			value={advancedExampleProps.value}
			exampleData={advancedExampleProps.detailedValue}
			valid={advancedExampleProps.valid}
			country={advancedExampleProps.country}
		/>
	</div>
</div>
