<script lang="ts">
    import { selectedTelTypeStore } from '$lib/stores';
    import type { SelectType } from '$lib/models/types/Select.type';

    export let selectedTelType: SelectType;

    const setSelectedCountry = (value: SelectType) => {
        selectedTelType = value;
        $selectedTelTypeStore = value;
    };
</script>

<select
    name="type_select"
    class={$$props.class}
    on:change={(e) => setSelectedCountry(e.currentTarget.value)}
>
    <slot name="options" />
</select>
