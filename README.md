<a name="readme-top"></a>

[![npm version](https://badge.fury.io/js/svelte-tel-input.svg)](https://badge.fury.io/js/svelte-tel-input)

# Svelte Tel Input

> Lightweight svelte tel/phone input standardizer.

The package is recently bumped to `1.0`. If you experience any problems, please open an issue, to be able to me to fix it.

## Goals

-   Solve the problem that a users can enter the same phone number in different formats.
-   Storing a phone number in a standard format, that can be indexable and searchable in any database.
-   Should be accessible for the the browser. Eg. for a `<a href="tel+36201234567 />`.
-   The stored phone number format can be useable for any SMS gateway(e.g for 2FA) and if somebody can call the number from anywhere, it should work.

## Installation

Svelte Tel Input is distributed via [npm](https://www.npmjs.com/package/svelte-tel-input).

```bash
npm install --save svelte-tel-input
```

## Features

-   Parse and validate phone number.You can store one exact format (`E164`), no matter how users type their phone numbers.
-   Format (specified to its country), to make it more readable.
-   Optionally it can set the user's current country automatically, via IP lookup.
-   Prevent non-digits typing into the input, except the `+` sign (and `space` optionally).
-   Handle copy-pasted phone numbers, it's sanitize non-digit characters except the `+` sign (and `space` optionally).

## Usage

### Basic

[REPL](https://stackblitz.com/edit/svelte-tel-input-repl?file=README.md) (StackBlitz)

```html
<script lang="ts">
	import TelInput, { normalizedCountries } from 'svelte-tel-input';
	import type { NormalizedTelNumber, CountryCode, E164Number } from 'svelte-tel-input/types';

	// Any Country Code Alpha-2 (ISO 3166)
	let country: CountryCode | null = 'HU';

	// You must use E164 number format. It's guarantee the parsing and storing consistency.
	let value: E164Number | null = '+36301234567';

    // Validity
    let valid = true;

	// Optional - Extended details about the parsed phone number
	let parsedTelInput: NormalizedTelNumber | null = null;
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
    <TelInput bind:country bind:value bind:valid bind:parsedTelInput class="basic-tel-input {!isValid && 'invalid'}" />
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

| Props          | Type                        | Default Value | Usage                                                                                                                                                                                                                                                                                                                |
| -------------- | --------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| country        | `CountryCode \| null`       | `null`        | It's accept any Country Code Alpha-2 (ISO 3166). You can set manually (e.g: by the user via a select). The parser will inspect the entered phone number and if it detect a valid country calling code, then it's automatically set the country to according to the detected country calling code. E.g: `+36` -> `HU` |
| disabled       | `boolean`                   | `false`       | It's block the parser and prevent entering input. You must handle its styling on your own.                                                                                                                                                                                                                           |
| valid          | `boolean`                   | `true`        | Indicates whether the entered tel number validity.                                                                                                                                                                                                                                                                   |
| value          | `E164Number \| null`        | `null`        | [E164](https://en.wikipedia.org/wiki/E.164) is the international format of phone.numbers. This is the main entry point to store and/or load an existent phone number.                                                                                                                                                |
| parsedTelInput | `NormalizedTelInput \|null` | `null`        | All of the formatted results of the tel input.                                                                                                                                                                                                                                                                       |
| class          | `string`                    | ``            | You can pass down any classname to the component                                                                                                                                                                                                                                                                     |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Dependencies

[svelte](https://svelte.dev/)

[libphonenumber-js](https://gitlab.com/catamphetamine/libphonenumber-js)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Changelog

| Package                        | Changelog                 |
| ------------------------------ | ------------------------- |
| [@gyurielf/svelte-tel-input]() | [Changelog](CHANGELOG.md) |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

-   [x] Add Changelog
-   [x] Add CI/CD
-   [x] Integrate libphonenumber
-   [x] Implement parser
-   [x] Add basics docs and examples
-   [ ] Add advanced examples
-   [ ] Improve A11Y

See the [open issues](https://github.com/gyurielf/svelte-tel-input/issues) for a list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Support

<a href="https://www.buymeacoffee.com/gyurielf" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.md` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
