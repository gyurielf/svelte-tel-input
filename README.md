<a name="readme-top"></a>

[![npm version](https://badge.fury.io/js/svelte-tel-input.svg)](https://badge.fury.io/js/svelte-tel-input)

# Svelte Tel Input

> Lightweight svelte tel/phone input standardizer.

## Under development!

<ins>Do not use it before 1.0, it won't works properly!</ins>

Lightweight phone input standardization.

---

## Installation

Svelte Tel Input is distributed via [npm](https://www.npmjs.com/package/svelte-tel-input).

```bash
npm install --save svelte-tel-input
```

## Usage

```typescript
import { TelInput } from 'svelte-tel-input';
import type {CountryCode} from 'svelte-tel-input'

// Any Country Code Alpha-2 (ISO 3166)
let country: CountryCode = 'US'

let parsedTelInput: NormalizedPhoneNumber | null = null;


<TelInput {country} bind:parsedPhoneInput class="any class passed down" />
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

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
-   [ ] Multi-language Support

See the [open issues](https://github.com/gyurielf/svelte-tel-input/issues) for a list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Support

<a href="https://www.buymeacoffee.com/gyurielf" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.md` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
