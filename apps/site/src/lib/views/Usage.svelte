<script lang="ts">
	// import BasicPhoneInput from '$lib/components/examples/BasicPhoneInput.svelte';
	import AdvancedPhoneInput from '$lib/components/examples/AdvancedPhoneInput.svelte';
	import PayloadBlock from '$lib/components/utils/PayloadBlock.svelte';
	import OptionsPanel from './OptionsPanel.svelte';
	// import EventDrivenPhoneInput from '$lib/components/examples/EventDrivenPhoneInput.svelte';
	import type {
		DetailedValue,
		E164Number,
		TelInputOptions,
		CountryCode
	} from 'svelte-tel-input/types';

	interface ExampleProps {
		value: E164Number | null;
		detailedValue: DetailedValue | null;
		valid: boolean;
		country: CountryCode | null;
	}

	/* advanced example */
	const advancedExampleProps = $state({
		value: '+36201234567',
		detailedValue: null,
		valid: true,
		country: null
	} satisfies ExampleProps);
	let advancedExampleOptions = $state({
		autoPlaceholder: true,
		spaces: true,
		invalidateOnCountryChange: true
	} satisfies TelInputOptions);

	// /* basicWithE164 example */
	// const basicExamplePropsWithE164 = $state({
	// 	value: '+14842918723',
	// 	detailedValue: null,
	// 	valid: true,
	// 	country: null
	// } satisfies ExampleProps);
	// let basicExampleWithE164Options = $state({
	// 	autoPlaceholder: true,
	// 	spaces: true,
	// 	invalidateOnCountryChange: false,
	// 	format: 'national'
	// } satisfies TelInputOptions);

	// /* basicWithNull example */
	// const basicExamplePropsWithNull = $state({
	// 	value: null,
	// 	detailedValue: null,
	// 	valid: true,
	// 	country: null
	// } satisfies ExampleProps);
	// let basicExampleWithNullOptions = $state({
	// 	autoPlaceholder: true,
	// 	spaces: true,
	// 	invalidateOnCountryChange: false,
	// 	format: 'national'
	// } satisfies TelInputOptions);

	// /* eventDriven example */
	// const eventDrivenExampleProps = $state({
	// 	value: '+441234567988',
	// 	detailedValue: null,
	// 	valid: true,
	// 	country: null
	// } satisfies ExampleProps);
	// let eventDrivenExampleOptions = $state({
	// 	autoPlaceholder: true,
	// 	spaces: true,
	// 	invalidateOnCountryChange: false,
	// 	format: 'national'
	// } satisfies TelInputOptions);
</script>

<div class="grid gap-y-10">
	<div>
		<div class="flex">
			<h2 class="text-2xl mb-3">Advanced Example</h2>
			<div class="socials ml-2">
				<a
					class="relative flex items-center text-gray-soft hover:text-gray-inverse border-0 rounded-md"
					href="https://github.com/gyurielf/svelte-tel-input/blob/main/apps/site/src/lib/components/examples/AdvancedPhoneInput.svelte"
					target="_blank"
					rel="noreferrer"
				>
					<svg
						preserveAspectRatio="xMidYMid meet"
						viewBox="0 0 24 24"
						width="28"
						height="28"
						class=""
					>
						<path
							fill="currentColor"
							d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.338 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.688c-.1-.25-.45-1.275.1-2.65c0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337c1.912-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.562 4.938c.362.312.675.912.675 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z"
						/>
					</svg>
					<span class="sr-only">GitHub</span>
				</a>
			</div>
		</div>
		{#key advancedExampleOptions}
			<AdvancedPhoneInput
				options={advancedExampleOptions}
				bind:value={advancedExampleProps.value}
				bind:detailedValue={advancedExampleProps.detailedValue}
				bind:valid={advancedExampleProps.valid}
				bind:selectedCountry={advancedExampleProps.country}
			/>
		{/key}
		<OptionsPanel bind:options={advancedExampleOptions} />
		<PayloadBlock
			value={advancedExampleProps.value}
			exampleData={advancedExampleProps.detailedValue}
			valid={advancedExampleProps.valid}
			country={advancedExampleProps.country}
		/>
	</div>
	<!-- <hr class="my-5" />
	<div>
		<div class="flex">
			<h2 class="text-2xl mb-3">Basic Example with init value</h2>
			<div class="socials ml-2">
				<a
					class="relative flex items-center text-gray-soft hover:text-gray-inverse border-0 rounded-md"
					href="https://github.com/gyurielf/svelte-tel-input/blob/main/apps/site/src/lib/components/examples/BasicPhoneInput.svelte"
					target="_blank"
					rel="noreferrer"
				>
					<svg
						preserveAspectRatio="xMidYMid meet"
						viewBox="0 0 24 24"
						width="28"
						height="28"
						class=""
					>
						<path
							fill="currentColor"
							d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.338 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.688c-.1-.25-.45-1.275.1-2.65c0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337c1.912-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.562 4.938c.362.312.675.912.675 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z"
						/>
					</svg>
					<span class="sr-only">GitHub</span>
				</a>
			</div>
		</div>
		{#key basicExampleWithE164Options}
			<BasicPhoneInput
				options={basicExampleWithE164Options}
				bind:value={basicExamplePropsWithE164.value}
				bind:detailedValue={basicExamplePropsWithE164.detailedValue}
				bind:valid={basicExamplePropsWithE164.valid}
				bind:country={basicExamplePropsWithE164.country}
			/>
		{/key}
		<OptionsPanel bind:options={basicExampleWithE164Options} />
		<PayloadBlock
			value={basicExamplePropsWithE164.value}
			exampleData={basicExamplePropsWithE164.detailedValue}
			valid={basicExamplePropsWithE164.valid}
			country={basicExamplePropsWithE164.country}
		/>
	</div>
	<hr class="my-5" />
	<div>
		<div class="flex">
			<h2 class="text-2xl mb-3">Basic Example without init value</h2>
			<div class="socials ml-2">
				<a
					class="relative flex items-center text-gray-soft hover:text-gray-inverse border-0 rounded-md"
					href="https://github.com/gyurielf/svelte-tel-input/blob/main/apps/site/src/lib/components/examples/BasicPhoneInput.svelte"
					target="_blank"
					rel="noreferrer"
				>
					<svg
						preserveAspectRatio="xMidYMid meet"
						viewBox="0 0 24 24"
						width="28"
						height="28"
						class=""
					>
						<path
							fill="currentColor"
							d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.338 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.688c-.1-.25-.45-1.275.1-2.65c0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337c1.912-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.562 4.938c.362.312.675.912.675 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z"
						/>
					</svg>
					<span class="sr-only">GitHub</span>
				</a>
			</div>
		</div>
		{#key basicExampleWithNullOptions}
			<BasicPhoneInput
				options={basicExampleWithNullOptions}
				bind:value={basicExamplePropsWithNull.value}
				bind:detailedValue={basicExamplePropsWithNull.detailedValue}
				bind:valid={basicExamplePropsWithNull.valid}
				bind:country={basicExamplePropsWithNull.country}
			/>
		{/key}
		<OptionsPanel bind:options={basicExampleWithNullOptions} />
		<PayloadBlock
			value={basicExamplePropsWithNull.value}
			exampleData={basicExamplePropsWithNull.detailedValue}
			valid={basicExamplePropsWithNull.valid}
			country={basicExamplePropsWithNull.country}
		/>
	</div>
	<hr class="my-5" />
	<div>
		<div class="flex">
			<h2 class="text-2xl mb-3">Event driven example</h2>
			<div class="socials ml-2">
				<a
					class="relative flex items-center text-gray-soft hover:text-gray-inverse border-0 rounded-md"
					href="https://github.com/gyurielf/svelte-tel-input/blob/main/apps/site/src/lib/components/examples/EventDrivenPhoneInput.svelte"
					target="_blank"
					rel="noreferrer"
				>
					<svg
						preserveAspectRatio="xMidYMid meet"
						viewBox="0 0 24 24"
						width="28"
						height="28"
						class=""
					>
						<path
							fill="currentColor"
							d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.338 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.688c-.1-.25-.45-1.275.1-2.65c0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337c1.912-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.562 4.938c.362.312.675.912.675 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z"
						/>
					</svg>
					<span class="sr-only">GitHub</span>
				</a>
			</div>
		</div>
		{#key eventDrivenExampleOptions}
			<EventDrivenPhoneInput
				options={eventDrivenExampleOptions}
				bind:value={eventDrivenExampleProps.value}
				bind:detailedValue={eventDrivenExampleProps.detailedValue}
				bind:valid={eventDrivenExampleProps.valid}
				bind:country={eventDrivenExampleProps.country}
			/>
		{/key}
		<OptionsPanel bind:options={eventDrivenExampleOptions} />
		<PayloadBlock
			value={eventDrivenExampleProps.value}
			exampleData={eventDrivenExampleProps.detailedValue}
			valid={eventDrivenExampleProps.valid}
			country={eventDrivenExampleProps.country}
		/>
	</div> -->
</div>
