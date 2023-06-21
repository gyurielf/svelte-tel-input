---
'svelte-tel-input': minor
---

feat: value can be reseted without country reset

-   In order to reset `value` and/or `country` from outside (you must pass (or set if you binded) `null` for the property) have some side-effects:

    -   Reseting the `value` will set (keep the `country` as is):
        -   `detailedValue` to `null`
        -   dispatch `updateDetailedValue` event
    -   Reseting the `country` will set:
        -   `value` to `null`
        -   `detailedValue` to `null`
        -   `valid` to `true` if `invalidateOnCountryChange` config option is false (_@default false_). Otherwise it will be `false`.
        -   and dispatch `updateValid`, `updateValue` `updateDetailedValue` events
    -   Reseting both `value` and `country` will set:
        -   `valid` to `true`
        -   `detailedValue` to `null`;