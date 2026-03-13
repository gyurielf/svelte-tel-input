---
'svelte-tel-input': major
---

breaking: refactor

The library has been fully rewritten from scratch using **Svelte 5** and its runes-based reactivity system (`$state`, `$derived`, `$effect`, `$props`, `$bindable`). The Svelte 4 options API is no longer supported.

### Breaking changes

- Requires **Svelte 5** as a peer dependency.
- All event props have been renamed to callbacks (`on:valueChange` → `onValueChange`, etc.) in line with the Svelte 5 event model.
- The component no longer uses `createEventDispatcher`. Bind to the callback props directly.
- Several deprecated types have been removed from the public API: `CountrySelectEvents`, `PhoneNumberError`, `PhoneNumberParseError`, `PhoneType`, and `TelInputValidity`.

### New features

- Full SSR / SSG compatibility with no hydration mismatches.
- `detailedValue` now includes a granular `validationError` field instead of a generic boolean.
- New `validateOn` option (`'input' | 'blur' | 'always'`) to control when validation is triggered.
- New `lockCountry` option to prevent automatic country switching from dial-code detection.
- New `allowedCountries` option to restrict valid countries.
- Imperative `api` object (`bind:this`) with `checkValidity()` and `reset()` methods.
- `defaultCountry` prop for resetting to a specific country.
- Prop type guards throw descriptive `TypeError` messages on incorrect usage.

and more...
