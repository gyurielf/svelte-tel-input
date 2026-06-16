---
'svelte-tel-input': minor
---

Performance and developer-experience improvements:

- **O(1) country lookups**: country resolution by ISO 3166-1 alpha-2 code now uses a prebuilt `Map` index instead of a linear scan over the full country list. This path runs on every keystroke.
- **New `getCountryByIso2` utility**: a simple, type-safe `getCountryByIso2(iso2)` is now exported from both `svelte-tel-input` and `svelte-tel-input/utils`, replacing the stringly-typed `getCountry({ field, value })` for the common case.
- **New opt-in `validateProps` prop**: runtime prop type-checking is now controlled by the `validateProps` prop (default `false`), so the checks add nothing to production bundles. Enable it (e.g. during development) to get descriptive `TypeError`s on malformed props.
- **Updated `libphonenumber-js`** from `1.12.42` to `1.13.6`, bringing the latest phone-number metadata for several regions.
- **Smaller bundle**: switched to the `libphonenumber-js/max/es6` entry point (added in 1.13.0), trimming roughly 3.8–4.1 KB gzipped from consumer bundles.
