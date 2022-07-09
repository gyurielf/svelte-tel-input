<script lang="ts">
	import type { SelectObject } from '$lib/models/interfaces/Select.interface';
	export let typeOption: SelectObject;
</script>

<option class={$$props.class} value={typeOption.value}>{typeOption.label}</option>
