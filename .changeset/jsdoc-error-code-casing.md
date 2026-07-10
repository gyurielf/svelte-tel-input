---
'svelte-tel-input': patch
---

docs: correct the JSDoc on `allowedCountries` to reference the real
`validationError` value `'COUNTRY_NOT_ALLOWED'` (was the lowercase
`'country_not_allowed'`, which never matches).
