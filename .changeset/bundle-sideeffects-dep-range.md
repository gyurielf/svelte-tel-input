---
'svelte-tel-input': patch
---

chore: improve bundling and dependency posture

- Add `"sideEffects": ["*.css"]` so bundlers can tree-shake modules that
  consumers don't use (e.g. the unicode-flags data) instead of conservatively
  retaining everything the assets barrel touches.
- Loosen the `libphonenumber-js` dependency to `^1.13.7` so consumers can dedupe
  to a single copy and pick up patch fixes, instead of being pinned to an exact
  version.
