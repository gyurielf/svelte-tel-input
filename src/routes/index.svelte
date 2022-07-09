<script context="module" lang="ts">
</script>

<script lang="ts">
	import allCountry from '$lib/assets/allCountry';

	import TelCountrySelectExample from '$lib/components/examples/TelCountrySelect.test.svelte';
	import TelInputExample from '$lib/components/examples/TelInput.test.svelte';
	import TelTypeSelectExample from '$lib/components/examples/TelTypeSelect.test.svelte';
	import Select from '$lib/components/Select/Select.svelte';
</script>

<svelte:head>
	<title>svelte-tel-input</title>
</svelte:head>

<div class="container mx-auto text-gray-200">
	<div class="grid">
		<div class="grid grid-cols-2">
			<div class="grid gap-4">
				<h1 class="text-2xl my-2">SVELTE-TEL-INPUT</h1>
				<div>
					<p>Country select:</p>
					<TelCountrySelectExample />
				</div>
				<div>
					<p>Type Select:</p>
					<TelTypeSelectExample />
				</div>
				<div>
					<p>Tel input:</p>
					<TelInputExample />
				</div>
			</div>
			<Select items={allCountry} />
		</div>
		<div class="grid grid-cols-2">
			<div
				class="validation-table grid grid-cols-2 mt-5 border rounded-sm border-gray-100 p-3"
			>
				<div class="grid grid-cols-2">
					<div>
						<h3 class="text-lg font-semibold">Key</h3>
						<div>countryCode</div>
						<div>isValid</div>
						<div>phoneNumber</div>
						<div>countryCallingCode</div>
						<div>formattedNumber</div>
						<div>nationalNumber</div>
						<div>type</div>
						<div>formatInternational</div>
						<div>formatNational</div>
						<div>uri</div>
						<div>e164</div>
					</div>
					<div>
						<h3 class="text-lg font-semibold">Value</h3>
						<div>HU</div>
						<div>true</div>
						<div>201231212</div>
						<div>36</div>
						<div>+36201231212</div>
						<div>+201231212</div>
						<div>_</div>
						<div>+36 20 123 1212</div>
						<div>06 20 123 1212</div>
						<div>tel:+36201231212</div>
						<div>+36201231212</div>
					</div>
				</div>
				<div class="grid">
					<h3 class="text-lg font-semibold">Payload</h3>
					<code>
						{`{ "countryCode": "HU", "isValid": true, "phoneNumber": "201231212", "countryCallingCode": "36", "formattedNumber": "+36201231212", "nationalNumber": "201231212", "formatInternational": "+36 20 123 1212", "formatNational": "06 20 123 1212", "uri": "tel:+36201231212", "e164": "+36201231212" }`}
					</code>
				</div>
			</div>
		</div>
	</div>
</div>
