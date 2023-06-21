# svelte-tel-input

## 3.1.0

### Minor Changes

-   feat: value can be reseted without country reset ([#165](https://github.com/gyurielf/svelte-tel-input/pull/165))

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

## 3.0.1

### Patch Changes

-   chore: update readme with advanced example REPL ([#162](https://github.com/gyurielf/svelte-tel-input/pull/162))

-   fix: auto country update after manual country change ([#162](https://github.com/gyurielf/svelte-tel-input/pull/162))

## 3.0.0

### Major Changes

-   breaking: rename `parsedTelInput` property: ([#156](https://github.com/gyurielf/svelte-tel-input/pull/156))
    `parsedTelInput` is `detailedValue` from now.

    ```diff
    -<TelInput bind:parsedTelInput ... />;
    +<TelInput bind:detailedValue ... />;
    ```

    breaking: rename dispatched events:
    `parseInput` is splitted to two (`updateValue` and `updateDetailedValue` ) event.
    `valid` is `updateValid` from now.

    ```diff
    -<TelInput on:parseInput={...} on:valid={...} ... />;
    +<TelInput on:updateValue={...} on:updateDetailedValue={...} on:updateValid={...} on:updateCountry={...} ... />;
    ```

    breaking: rename `NormalizedTelNumber` type to `DetailedValue`:

    ```diff
    -import type { NormalizedTelNumber } from 'svelte-tel-input/types';
    +import type { DetailedValue } from 'svelte-tel-input/types';
    ```

    feat: new event added: `updateCountry`

    ```html
    <TelInput on:updateCountry="{...}" ... />;
    ```

    feat: now the component is fully supports the event driven behavior. So you don't have to bind properties.

    ```diff
    -<TelInput bind:value ... />;
    +<TelInput value={yourValue} ... />;
    ```

## 2.1.1

### Patch Changes

-   fix: US flag is now more representative ([#154](https://github.com/gyurielf/svelte-tel-input/pull/154))

## 2.1.0

### Minor Changes

-   feat: support event driven behavior ([#150](https://github.com/gyurielf/svelte-tel-input/pull/150))

## 2.0.1

### Patch Changes

-   fix: component export ([#147](https://github.com/gyurielf/svelte-tel-input/pull/147))

## 2.0.0

### Major Changes

-   breaking: switch from default to named export to export TelInput component. Use named import in the future. From now Svelte >= 3.58.0 is required. ([#143](https://github.com/gyurielf/svelte-tel-input/pull/143))

### Minor Changes

-   feat: space config option added, it will enable or disable spaces in the input field. ([#143](https://github.com/gyurielf/svelte-tel-input/pull/143))

-   feat: autoPlaceholder feature added, it generates placeholder for each country. ([#143](https://github.com/gyurielf/svelte-tel-input/pull/143))

### Patch Changes

-   chore: update deps, re-generate package-lock.json ([#143](https://github.com/gyurielf/svelte-tel-input/pull/143))

-   feat: added options panel to example page to be able to try out config opts. ([#143](https://github.com/gyurielf/svelte-tel-input/pull/143))

## 1.3.2

### Patch Changes

-   chore: export ParseError class ([#141](https://github.com/gyurielf/svelte-tel-input/pull/141))

## 1.3.1

### Patch Changes

-   chore: extend method exports ([#139](https://github.com/gyurielf/svelte-tel-input/pull/139))

## 1.3.0

### Minor Changes

-   fix: validation on select all and delete ([#137](https://github.com/gyurielf/svelte-tel-input/pull/137))

## 1.2.0

### Minor Changes

-   fix: improved validation ([#132](https://github.com/gyurielf/svelte-tel-input/pull/132))

## 1.1.3

### Patch Changes

-   fix: make parsedTelInput prop optional ([#129](https://github.com/gyurielf/svelte-tel-input/pull/129))

## 1.1.2

### Patch Changes

-   feat: seo improvement and deps update ([#127](https://github.com/gyurielf/svelte-tel-input/pull/127))

-   fix: prevent commit to the main branch ([#127](https://github.com/gyurielf/svelte-tel-input/pull/127))

## 1.1.1

### Patch Changes

-   fix: advanced input handleSelect method fix ([#125](https://github.com/gyurielf/svelte-tel-input/pull/125))

-   fix: modify style export in package.json and in post-build.js ([#125](https://github.com/gyurielf/svelte-tel-input/pull/125))

-   fix: set flags assets import relative in flags.css ([#125](https://github.com/gyurielf/svelte-tel-input/pull/125))

## 1.1.0

### Minor Changes

-   feat: vitests and e2e (playwright) added ([#123](https://github.com/gyurielf/svelte-tel-input/pull/123))

-   chore: remove unnecessary dependencies ([#123](https://github.com/gyurielf/svelte-tel-input/pull/123))

## 1.0.2

### Patch Changes

-   chore: extend REPL example ([#119](https://github.com/gyurielf/svelte-tel-input/pull/119))

-   chore: polish readme ([#119](https://github.com/gyurielf/svelte-tel-input/pull/119))

-   chore: update dependencies ([#119](https://github.com/gyurielf/svelte-tel-input/pull/119))

## 1.0.1

### Patch Changes

-   fix: remove types field right before packaging ([#116](https://github.com/gyurielf/svelte-tel-input/pull/116))

## 1.0.0

### Major Changes

-   feat: prevent typing non-tel input characters into the input field. ([#108](https://github.com/gyurielf/svelte-tel-input/pull/108))

-   fix: now you can use value prop as a single entry ([#108](https://github.com/gyurielf/svelte-tel-input/pull/108))

-   feat: support monorepos ([#108](https://github.com/gyurielf/svelte-tel-input/pull/108))

-   feat: sanitize pasted E164 number ([#108](https://github.com/gyurielf/svelte-tel-input/pull/108))

-   feat: switch country automatically if the pasted/entered phone number contains a valid country calling code ([#108](https://github.com/gyurielf/svelte-tel-input/pull/108))

-   fix: clear input on manual country change ([#108](https://github.com/gyurielf/svelte-tel-input/pull/108))

### Minor Changes

-   chore: tweak types ([#108](https://github.com/gyurielf/svelte-tel-input/pull/108))

## 0.14.2

### Patch Changes

-   update something ([#105](https://github.com/gyurielf/svelte-tel-input/pull/105))

## 0.14.1

### Patch Changes

-   chore: export tests ([#100](https://github.com/gyurielf/svelte-tel-input/pull/100))

## 0.14.0

### Minor Changes

-   Prevent circular import ([#98](https://github.com/gyurielf/svelte-tel-input/pull/98))

## 0.13.1

### Patch Changes

-   chore: simplify part one ([#94](https://github.com/gyurielf/svelte-tel-input/pull/94))

## 0.13.0

### Minor Changes

-   Simplify structure ([#91](https://github.com/gyurielf/svelte-tel-input/pull/91))

## 0.12.0

### Minor Changes

-   feat: Update exports to make the package as simple to use as possible. ([#85](https://github.com/gyurielf/svelte-tel-input/pull/85))

## 0.11.1

### Patch Changes

-   Update readme and prepare to 1.0 ([#79](https://github.com/gyurielf/svelte-tel-input/pull/79))

## 0.11.0

### Minor Changes

-   feat: dark mode, example page enhancemet ([#76](https://github.com/gyurielf/svelte-tel-input/pull/76))

## 0.10.0

### Minor Changes

-   refactor: components and views ([#74](https://github.com/gyurielf/svelte-tel-input/pull/74))

## 0.9.0

### Minor Changes

-   feat: masking/formatting and parsing extends ([#72](https://github.com/gyurielf/svelte-tel-input/pull/72))

## 0.8.0

### Minor Changes

-   feat: example improvements, extend functionality ([#70](https://github.com/gyurielf/svelte-tel-input/pull/70))

## 0.7.0

### Minor Changes

-   feat: example page payload feature, parsing improvements" ([#68](https://github.com/gyurielf/svelte-tel-input/pull/68))

## 0.6.5

### Patch Changes

-   fix: add changeset ([#61](https://github.com/gyurielf/svelte-tel-input/pull/61))

## 0.6.4

### Patch Changes

-   chore: update to vite 3 ([#58](https://github.com/gyurielf/svelte-tel-input/pull/58))

## 0.6.3

### Patch Changes

-   update dependencies ([#56](https://github.com/gyurielf/svelte-tel-input/pull/56))

## 0.6.2

### Patch Changes

-   Update readme & update packages ([#54](https://github.com/gyurielf/svelte-tel-input/pull/54))

## 0.6.1

### Patch Changes

-   Readme update ([#52](https://github.com/gyurielf/svelte-tel-input/pull/52))

## 0.6.0

### Minor Changes

-   feat: example page preparations & extend functionality (part 1) ([#50](https://github.com/gyurielf/svelte-tel-input/pull/50))

## 0.5.1

### Patch Changes

-   chore: update packages and resolve breaking changes ([#46](https://github.com/gyurielf/svelte-tel-input/pull/46))

## 0.5.0

### Minor Changes

-   feat: prepare github pages deployment ([#43](https://github.com/gyurielf/svelte-tel-input/pull/43))

*   feat: implement selects and input ([#43](https://github.com/gyurielf/svelte-tel-input/pull/43))

-   feat: basic stores created ([#43](https://github.com/gyurielf/svelte-tel-input/pull/43))

## 0.4.2

### Patch Changes

-   fix: fix readme ([#41](https://github.com/gyurielf/svelte-tel-input/pull/41))

## 0.4.1

### Patch Changes

-   fix: readme fix ([#39](https://github.com/gyurielf/svelte-tel-input/pull/39))

## 0.4.0

### Minor Changes

-   fix: rework ci

### Patch Changes

-   fix: minor ci fix ([#34](https://github.com/gyurielf/svelte-tel-input/pull/34))

*   fix: fix ci again ([#35](https://github.com/gyurielf/svelte-tel-input/pull/35))

-   fix: last ci fix for today ([#36](https://github.com/gyurielf/svelte-tel-input/pull/36))

*   fix: ci fixxx ([#33](https://github.com/gyurielf/svelte-tel-input/pull/33))

-   something 1 ([#37](https://github.com/gyurielf/svelte-tel-input/pull/37))

*   fix: ci extend 321 ([#32](https://github.com/gyurielf/svelte-tel-input/pull/32))

## 0.3.2

### Patch Changes

-   feat: add MIT license ([#29](https://github.com/gyurielf/svelte-tel-input/pull/29))

*   fix: fix readme deps ([#29](https://github.com/gyurielf/svelte-tel-input/pull/29))

## 0.3.1

### Patch Changes

-   fix: lets check with different folder structure ([#25](https://github.com/gyurielf/svelte-tel-input/pull/25))

## 0.3.0

### Minor Changes

-   fix: ci modifications ([#22](https://github.com/gyurielf/svelte-tel-input/pull/22))

## 0.2.0

### Minor Changes

-   remove unused packages, cleanup, fix ci ([#19](https://github.com/gyurielf/svelte-tel-input/pull/19))

*   fix: another CI fix ([#20](https://github.com/gyurielf/svelte-tel-input/pull/20))

## 0.1.0

### Minor Changes

-   test_1

### Patch Changes

-   szo

*   test 2

-   test3
