---
'svelte-tel-input': major
---

breaking: renamed parsedTelInput property:
`parsedTelInput` is `detailedValue` from now.
```diff
-<TelInput bind:parsedTelInput ... />;
+<TelInput bind:detailedValue ... />;
```

breaking: renamed dispatched events:
`parseInput` is splitted to two (`updateValue` and `updateDetailedValue` ) event.
`valid` is `updateValid` from now.

```diff
-<TelInput on:parseInput={...} on:valid={...} ... />;
+<TelInput on:updateValue={...} on:updateDetailedValue={...} on:updateValid={...} on:updateCountry={...} ... />;
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