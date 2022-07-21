<script lang="ts">
	import type { TelSelectObject } from '$lib/models/interfaces/Select.interface';
	export let typeOption: TelSelectObject;
</script>

<option class={$$props.class} value={typeOption.value}>{typeOption.label}</option>
