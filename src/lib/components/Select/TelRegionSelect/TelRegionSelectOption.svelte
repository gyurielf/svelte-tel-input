<script lang="ts">
	import type { TelSelectObject } from '$lib/types/interfaces/Select.interface';
	export let regionOption: TelSelectObject;
</script>

<option class={$$props.class} value={regionOption.value}>{regionOption.label}</option>
