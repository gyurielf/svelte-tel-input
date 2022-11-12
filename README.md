<a name="readme-top"></a>

[![npm version](https://badge.fury.io/js/svelte-tel-input.svg)](https://badge.fury.io/js/svelte-tel-input)

# Svelte Tel Input

> Lightweight svelte tel/phone input standardizer.

The package is in `BETA` stage, expect bugs.

## Installation

Svelte Tel Input is distributed via [npm](https://www.npmjs.com/package/svelte-tel-input).

```bash
npm install --save svelte-tel-input
```

## Usage

### Basic

[REPL](https://stackblitz.com/edit/svelte-tel-input-repl?file=README.md) (StackBlitz)

```html
<script lang="ts">
	import TelInput from 'svelte-tel-input';
	import type { NormalizedTelNumber, CountryCode } from 'svelte-tel-input/types';

	// Any Country Code Alpha-2 (ISO 3166)
	let country: CountryCode = 'US';

	let parsedTelInput: NormalizedTelNumber | null = null;
</script>

<TelInput {country} bind:parsedTelInput class="any class passed down" />
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## API

The default export of the library is the main TelInput component. It has the following props:

| Props    | Type                 | Default Value | Usage                                                                                    |
| -------- | -------------------- | ------------- | ---------------------------------------------------------------------------------------- |
| disabled | `boolean`            | `false`       | It's either block the parser and entering input                                          |
| value    | `E164Number \| null` | `null`        | [E164](https://en.wikipedia.org/wiki/E.164) is the international format of phone numbers |

## Features

-   Parse and validate phone number.
-   Standardize parsed phone numbers. You can store one exact format, no matter how users type their phone numbers.
-   Mask typed inputs (country specificly), to make it more readable.
-   Automatically set the user's current country using an IP lookup.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Dependencies

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
-   [ ] Default country sould be optional. ( ip | browserLang |off )
-   [ ] Simlify code and types

See the [open issues](https://github.com/gyurielf/svelte-tel-input/issues) for a list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Support

<a href="https://www.buymeacoffee.com/gyurielf" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.md` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
