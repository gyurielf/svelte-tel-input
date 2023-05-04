---
'svelte-tel-input': major
---

breaking: rename property and emit events on input

```diff
-<TelInput bind:parsedTelInput ... />;
+<TelInput bind:detailedValue ... />;
```