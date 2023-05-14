---
'svelte-tel-input': major
---

breaking: rename `parsedTelInput` property:
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
<TelInput on:updateCountry={...} ... />;
```

feat: now the component is fully supports the event driven behavior. So you don't have to bind properties.
```diff
-<TelInput bind:value ... />;
+<TelInput value={yourValue} ... />;
```