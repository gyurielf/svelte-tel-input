---
'svelte-tel-input': patch
---

Fix calling-code leak that dropped a typed digit for single-digit dial-code countries. In a US field (and other NANP / `+7` countries), typing repeated leading digits — e.g. `1`, `1`, `1` — appeared stuck on a single digit because libphonenumber consumed the leading digit (equal to the country calling code) as the code itself. Typed national digits are now preserved in the display for all selected countries.
