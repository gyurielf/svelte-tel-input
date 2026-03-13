# DX Backlog

Tracking DX improvement ideas and their status.

---

## ✅ Done

### 4. `defaultCountry` prop + `reset()` options

- New `defaultCountry?: CountryCode | null` prop — country to restore on reset.
- `api.reset()` — resets value, restores `defaultCountry`.
- `api.reset({ country: true })` — resets value **and** forces country to `null`, ignoring `defaultCountry`.

### 3 / 6. `parse()` + `normalizeToE164()` utilities

- `parse(raw, country?)` — parses any raw input and returns a full `DetailedValue`.
- `normalizeToE164(raw, country?)` — convenience one-liner, returns `string | null`.
- Both exported from the main package.

### `pickCountries()` utility

- `pickCountries(codes)` — returns a filtered `Country[]` subset in the caller's order.
- Pairs with `allowedCountries` for building country-picker dropdowns.
- Exported from the main package.
- 6 unit tests.

---

## ❌ Skipped

### 2. `formatAs` option (`'national' | 'international' | 'e164'`)

Tried in the previous version. Hard to maintain and tricky to parse correctly without a known dial code. Skipped.

### 8. `inputmode` prop

`type="tel"` is fine — all major browsers treat it correctly and it's consistent with other form libraries. Skipped.

### 1. `onValidationError` callback

`onValidityChange` is sufficient. Skipped as a standalone callback.

> **Open question:** User asked about a way to _programmatically set the field back to valid_ (not just observe errors). Needs design — e.g. `api.setValid()` or a `valid` override mechanism?

---

## 🔲 Pending

### 5. `preferredCountries` option

Show a short list of favourite countries at the top of the country picker (e.g. `['US', 'HU', 'GB']`).

- **Scope:** This is UI/UX logic in `AdvancedPhoneInput` (the docs-site example), _not_ in the core `TelInput` component. `TelInput` never renders a dropdown.
- **Plan:** Add a `preferredCountries?: CountryCode[]` prop to `AdvancedPhoneInput.svelte`. The `countries` array exported by the lib can be reordered locally: preferred entries first (with an optional divider), the rest alphabetically.
- **Impact:** No core changes needed; purely a consumer-side pattern — but worth standardising in the example so consumers can copy it.

### 6 / 3. `getCurrentCountry` utility

> Related to `parse()` — already half-done.

Expose a `getCurrentCountry(e164: string): CountryCode | null` helper so consumers can pre-populate `country` server-side without rendering the component.

- **Plan:** Thin wrapper around the internal `guessCountryByPartialNumber` — or simply `parse(e164).countryCode ?? null`.
- Could just be documented as `parse(e164).countryCode` rather than a new export.

### 7. Accessibility attribute passthrough (aria-label / aria-labelledby) ✅

- `aria-invalid` is now auto-set to `true` when `valid` is false; absent when valid.
- Consumer can still override `aria-invalid` explicitly.
- All ARIA attributes (`aria-label`, `aria-labelledby`, `aria-describedby`, etc.) pass through via `...rest` — covered by 6 new unit tests.

### 9. Zod / Valibot / Yup schema helpers ✅

Exported from a separate subpath so consumers who don't use it pay zero bundle cost.

```ts
import { validateTelInput, zodTelInput, valibotTelInput } from 'svelte-tel-input/validators';

// Framework-agnostic core:
const error = validateTelInput('+12154567890', { required: true, allowedCountries: ['US', 'HU'] });
// → null | 'required' | 'invalid' | 'country_not_allowed'

// Zod — use with .superRefine():
const schema = z.object({
	phone: z.string().superRefine(zodTelInput({ required: true, allowedCountries: ['US', 'HU'] }))
});

// Valibot — use with v.check():
const schema = v.object({
	phone: v.pipe(v.string(), v.check(valibotTelInput({ required: true }), 'Invalid phone number'))
});
```

- No new runtime dependencies — adapters use structurally-compatible types, not imports.
- `TelValidatorOptions`: `required?`, `allowedCountries?`, `country?`.
- 20 unit tests covering all adapters and edge cases.

### `allowedCountries` should block country switching (not just validate)

Currently, `allowedCountries` only marks the field invalid with `'country_not_allowed'` **after** the country auto-switches from a typed dial code. The country itself still changes (e.g. typing `+44` into `allowedCountries: ['US', 'HU']` switches to `GB`, then flags invalid).

**Desired behavior:** When `allowedCountries` is set and the detected dial-code country is **not** in the list, the country switch should be **blocked** entirely — the country stays as-is, and the number is parsed in the current country's context. Validation would then report `TOO_SHORT` / `INVALID` etc. instead of `country_not_allowed`.

**Design considerations:**

- Keep `country_not_allowed` for cases where country is set **externally** (prop binding, dropdown) to a non-allowed value?
- Or unify: both typing and external setting are blocked?
- Impact on `lockCountry`: overlapping behavior — `lockCountry` already blocks all switches; this would be a softer version that only blocks switches to non-allowed countries.

## Bindable errors (string or string[]) to show what is the actual error
