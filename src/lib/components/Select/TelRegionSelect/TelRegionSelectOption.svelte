<script lang="ts">
	import type { SelectObject } from '$lib/models/interfaces/Select.interface';
	export let regionOption: SelectObject;
</script>

<option class={$$props.class} value={regionOption.value}>{regionOption.label}</option>
