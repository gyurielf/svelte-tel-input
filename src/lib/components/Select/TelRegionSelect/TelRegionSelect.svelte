<script lang="ts">
	let selectedTelRegion: string;
</script>

<select
	name="region_select"
	class={$$props.class}
	bind:value={selectedTelRegion}
	on:change={() => console.log(selectedTelRegion)}
>
	<slot name="options" />
</select>
