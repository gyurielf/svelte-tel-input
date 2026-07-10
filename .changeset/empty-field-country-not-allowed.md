---
'svelte-tel-input': patch
---

fix: an empty field no longer reports `COUNTRY_NOT_ALLOWED`

`getValidationError` now short-circuits on an empty value before evaluating the
`lockCountry` / `allowedCountries` constraints. Previously, a blank input with a
preselected country outside `allowedCountries` (or conflicting under
`lockCountry`) was flagged `COUNTRY_NOT_ALLOWED`, and a non-required blank field
was marked invalid. An empty field now resolves to `REQUIRED` (when `required`)
or valid.
