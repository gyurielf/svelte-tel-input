<div align="center">

# svelte-tel-input

[![npm version](https://badge.fury.io/js/svelte-tel-input.svg)](https://www.npmjs.com/package/svelte-tel-input)
[![license](https://img.shields.io/npm/l/svelte-tel-input)](LICENSE.md)

A **headless**, fully customizable **Svelte 5** phone input toolkit.
All the ingredients to parse, format, and validate international phone numbers — you build the UI.
Store in [E.164](https://en.wikipedia.org/wiki/E.164). Ship with any CSS framework, design system, or custom markup.

[Documentation](https://svelte-tel-input.vercel.app/) · [Playground](https://svelte-tel-input.vercel.app/playground/) · [Changelog](CHANGELOG.md)

</div>

---

## Features

- **Headless & unstyled** — zero built-in styles; bring Tailwind, CSS Modules, or plain CSS
- **Fully customizable UI** — you own the markup; the library owns the logic
- **E.164 storage** — one canonical format, always searchable and SMS-ready
- **Auto-detect country** from dial code (`+44` → `GB`)
- **Smart formatting** — international display with cursor position preservation
- **Validation** — powered with granular error types
- **Auto placeholder** — country-specific example numbers
- **Allowed countries** — restrict to a subset of country codes
- **Lock country** — prevent country switching via dial codes
- **Schema validation** — Zod / Valibot / Yup helpers via `svelte-tel-input/validators`
- **SSR / SSG** compatible
- **Svelte 5 runes** — `$bindable` props, `$state`, `$derived`
- **Accessible** — `aria-invalid` auto-set, ARIA attribute passthrough, `type="tel"`
- **Unstyled** — bring your own CSS or Tailwind classes

## Install

```bash
npm install svelte-tel-input
# or
pnpm add svelte-tel-input
# or
yarn add svelte-tel-input
```

> Requires **Svelte 5** and **Node.js >= 22**

## Quick start

```svelte
<script lang="ts">
  import { TelInput, countries } from 'svelte-tel-input';
  import type { CountryCode } from 'svelte-tel-input/types';

  let country: CountryCode | null = $state('HU');
  let value = $state('');
  let valid = $state(true);
</script>

<select bind:value={country} aria-label="Country">
  <option value={null}>Select country</option>
  {#each countries as c (c.id)}
    <option value={c.iso2}>{c.name} (+{c.dialCode})</option>
  {/each}
</select>

<TelInput bind:country bind:value bind:valid />

{#if !valid}
  <p role="alert">Invalid phone number</p>
{/if}
```

See the [Quick Start guide](https://svelte-tel-input.vercel.app/getting-started/quick-start/) for a complete walkthrough.

## Documentation

Full API reference, options, events, types, and examples are on the **[documentation site](https://svelte-tel-input.vercel.app/)**:

- [Installation](https://svelte-tel-input.vercel.app/getting-started/installation/)
- [Props](https://svelte-tel-input.vercel.app/reference/props/)
- [Options](https://svelte-tel-input.vercel.app/reference/options/)
- [Events / Callbacks](https://svelte-tel-input.vercel.app/reference/events/)
- [API Methods](https://svelte-tel-input.vercel.app/reference/api/)
- [Types](https://svelte-tel-input.vercel.app/reference/types/)
- [Playground](https://svelte-tel-input.vercel.app/playground/)

## Support

<a href="https://www.buymeacoffee.com/gyurielf" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## License

[MIT](LICENSE.md)

## Acknowledgements

Phone number parsing and validation is powered by [libphonenumber-js](https://gitlab.com/catamphetamine/libphonenumber-js) by [catamphetamine](https://gitlab.com/catamphetamine) and its contributors. This project wouldn't be possible without their work. Thank you for their work.
