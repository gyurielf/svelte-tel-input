<a name="readme-top"></a>

[![npm version](https://badge.fury.io/js/svelte-tel-input.svg)](https://badge.fury.io/js/svelte-tel-input)

# Svelte Tel Input

> Lightweight svelte tel/phone input standardizer.

<img src="https://raw.githubusercontent.com/gyurielf/svelte-tel-input/main/static/demo.gif" width="600px" align="center">

🔥 Check it out live [here](https://svelte-tel-input.vercel.app/)

## Installation

Svelte Tel Input is distributed via [npm](https://www.npmjs.com/package/svelte-tel-input).

```bash
npm install --save svelte-tel-input
```

## Features

- Support SSR/SSG.
- Parse and validate phone number.You can store one exact format (`E164`), no matter how users type their phone numbers.
- Format (specified to its country), to make it more readable.
- Prevent non-digits typing into the input, except the leading `+` sign (and `space` optionally).
- Handle copy-pasted phone numbers, it's sanitize non-digit characters except the leading `+` sign (and `space` optionally).
- Automatic placeholder generation for the selected country.
- International or National formatted phone numbers.

## Usage

### Advanced

_Snippet would be too long_ - [Example](https://github.com/gyurielf/svelte-tel-input/blob/main/apps/site/src/lib/components/examples/AdvancedPhoneInput.svelte) - [REPL](https://stackblitz.com/edit/svelte-tel-input-repl-1jfaar?file=README.md) (StackBlitz)

### Basic

[Example](https://github.com/gyurielf/svelte-tel-input/blob/main/apps/site/src/lib/components/examples/BasicPhoneInput.svelte) - [REPL](https://stackblitz.com/edit/svelte-tel-input-repl?file=README.md) (StackBlitz)

```html
<script lang="ts">
	import { TelInput, normalizedCountries } from 'svelte-tel-input';
	import type { DetailedValue, CountryCode, E164Number } from 'svelte-tel-input/types';

	// Any Country Code Alpha-2 (ISO 3166)
	let selectedCountry: CountryCode | null = 'HU';

	// You must use E164 number format. It's guarantee the parsing and storing consistency.
	let value: E164Number | null = '+36301234567';

    // Validity
    let valid = true;

	// Optional - Extended details about the parsed phone number
	let detailedValue: DetailedValue | null = null;
</script>

<div class="wrapper">
	<select
		class="country-select {!valid && 'invalid'}"
		aria-label="Default select example"
		name="Country"
		bind:value={selectedCountry}
	>
		<option value={null} hidden={selectedCountry !== null}>Please select</option>
		{#each normalizedCountries as country (country.id)}
			<option
				value={country.iso2}
				selected={country.iso2 === selectedCountry}
				aria-selected={country.iso2 === selectedCountry}
			>
				{country.iso2} (+{country.dialCode})
			</option>
		{/each}
	</select>
    <TelInput bind:country={selectedCountry} bind:value bind:valid bind:detailedValue class="basic-tel-input {!isValid && 'invalid'}" />
</div>

<style>
  .wrapper :global(.basic-tel-input) {
      height: 32px;
      padding-left: 12px;
      padding-right: 12px;
      border-radius: 6px;
      border: 1px solid;
      outline: none;
  }

  .wrapper :global(.country-select) {
      height: 36px;
      padding-left: 12px;
      padding-right: 12px;
      border-radius: 6px;
      border: 1px solid;
      outline: none;
  }

  .wrapper :global(.invalid) {
    border-color: red;
  }
</style>
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Props

The default export of the library is the main TelInput component. It has the following props:

| Property name | Type                   | Default Value | Usage                                                                                                                                                                                                                                                                                                                |
| ------------- | ---------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| value         | `E164Number \| null`   | `null`        | [E164](https://en.wikipedia.org/wiki/E.164) is the international format of phone.numbers. This is the main entry point to store and/or load an existent phone number.                                                                                                                                                |
| country       | `CountryCode \| null`  | `null`        | It's accept any Country Code Alpha-2 (ISO 3166). You can set manually (e.g: by the user via a select). The parser will inspect the entered phone number and if it detect a valid country calling code, then it's automatically set the country to according to the detected country calling code. E.g: `+36` -> `HU` |
| disabled      | `boolean`              | `false`       | It's block the parser and prevent entering input. You must handle its styling on your own.                                                                                                                                                                                                                           |
| valid         | `boolean`              | `true`        | Indicates whether the entered tel number validity.                                                                                                                                                                                                                                                                   |
| detailedValue | `DetailedValue \|null` | `null`        | All of the formatted results of the tel input.                                                                                                                                                                                                                                                                       |
| class         | `string`               | ``            | You can pass down any classname to the component                                                                                                                                                                                                                                                                     |
| required      | `boolean \| null`      | `null`        | Set the required attribute on the input element                                                                                                                                                                                                                                                                      |
| options       | `TelInputOptions`      | check below   | Allow or disallow spaces in the input field                                                                                                                                                                                                                                                                          |
| id            | `string \| null`       | uid           | HTMLInputElement's attribute                                                                                                                                                                                                                                                                                         |
| name          | `string \| null`       | `null`        | HTMLInputElement's attribute                                                                                                                                                                                                                                                                                         |
| readonly      | `boolean \| null`      | `null`        | HTMLInputElement's attribute                                                                                                                                                                                                                                                                                         |
| size          | `number \| null`       | `null`        | HTMLInputElement's attribute                                                                                                                                                                                                                                                                                         |
| autocomplete  | `string \| null`       | `null`        | HTMLInputElement's attribute                                                                                                                                                                                                                                                                                         |
|  |

Config options:

```javascript
{
    // Generates country specific placeholder for the selected country.
    autoPlaceholder: true,
    // Allow or disallow spaces in the input field
    spaces: true,
    // If you have a parsed phone number and you change country manually from outside, then it's set the `valid` prop to false.
    invalidateOnCountryChange: false,
    // Formatted output `national` | `international`
    format: 'national'
}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Dispatched Events

The default export of the library is the main TelInput component. It has the following props:

| Event name          | Type                   |
| ------------------- | ---------------------- |
| updateValue         | `E164Number \| null`   |
| updateDetailedValue | `DetailedValue \|null` |
| updateCountry       | `CountryCode \| null`  |
| updateValid         | `boolean`              |
| parseError          | `string`               |

## Use case of the event driven behavior

```typescript
<script lang="ts">
	// Imports, etc....
	let value: E164Number | null = null;
	const yourHandler = (e: CustomEvent<E164Number | null>) => {
        value = e.detail //
        // do stuff...
	};
</script>

<TelInput value={cachedValue ?? value} on:updateValue={yourHandler} ... />
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Caveats

- In order to reset `value` and/or `country` from outside (you must pass (or set if you binded) `null` for the property) have some side-effects:

  - Reseting the `value` will set (keep the `country` as is):
    - `detailedValue` to `null`
    - dispatch `updateDetailedValue` event
  - Reseting the `country` will set:
    - `value` to `null`
    - `detailedValue` to `null`
    - `valid` to `true` if `invalidateOnCountryChange` config option is false (_@default false_). Otherwise it will be `false`.
    - and dispatch `updateValid`, `updateValue` `updateDetailedValue` events
  - Reseting both `value` and `country` will set:
    - `valid` to `true`
    - `detailedValue` to `null`;

- Let's assume you pass a `US` `E164` number, which can be a partial `E164`, but long enough to determine the country and you pass `DE` country directly. The country will be updated to `US`, which is determined from the `E164` in this example. If the `E164` is not long enough to determine its country, then the country will stay what you passed to the component (`DE`).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Goals

- Solve the problem that a users can enter the same phone number in different formats.
- Storing a phone number in a standard format, that can be indexable and searchable in any database.
- Should be accessible for the the browser. Eg. for a `<a href="tel+36201234567 />`.
- The stored phone number format can be useable for any SMS gateway(e.g for 2FA) and if somebody can call the number from anywhere, it should work.

## Dependencies

[libphonenumber-js](https://gitlab.com/catamphetamine/libphonenumber-js)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Changelog

| Package                                                                                                        | Changelog                                                                                                  |
| -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [@gyurielf/svelte-tel-input](https://github.com/gyurielf/svelte-tel-input/tree/main/packages/svelte-tel-input) | [Changelog](https://github.com/gyurielf/svelte-tel-input/blob/main/packages/svelte-tel-input/CHANGELOG.md) |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [x] Add Changelog
- [x] Add CI/CD
- [x] Integrate libphonenumber
- [x] Implement parser
- [x] Add basics docs and examples
- [x] Add advanced examples
- [x] Generate placeholders autimatically
- [x] Move to monorepo
- [ ] Improve A11Y

See the [open issues](https://github.com/gyurielf/svelte-tel-input/issues) for a list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Support

<a href="https://www.buymeacoffee.com/gyurielf" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.md` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
