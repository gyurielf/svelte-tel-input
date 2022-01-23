<script lang="ts">
    import TelTypeSelect from '$lib/components/Select/TelTypeSelect/TelTypeSelect.svelte';
    import TelTypeSelectOption from '../Select/TelTypeSelect/TelTypeSelectOption.svelte';
    import { capitalize } from '$lib/utils/helpers';
    import type { SelectType } from '$lib/models/types/Select.type';

    const telTypes = [
        'PREMIUM_RATE',
        'TOLL_FREE',
        'SHARED_COST',
        'VOIP',
        'PERSONAL_NUMBER',
        'PAGER',
        'UAN',
        'VOICEMAIL',
        'FIXED_LINE_OR_MOBILE',
        'FIXED_LINE',
        'MOBILE'
    ].map((el) => {
        return { id: el, value: el, label: capitalize(el.split('_').join(' ')) };
    });

    // TODO >> sort and order option for telTypes.

    let selectedTelType: SelectType;
</script>

<!-- Whis way you can build your own country select component. You can both style and add your own logic. -->
<TelTypeSelect bind:selectedTelType class="text-gray-800">
    <svelte:fragment slot="options">
        <option value="" selected={true} hidden={true}>Choose here</option>
        {#each telTypes as telType (telType.id)}
            <TelTypeSelectOption class="text-red-500" typeOption={telType} />
        {/each}
    </svelte:fragment>
</TelTypeSelect>
