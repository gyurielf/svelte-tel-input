<script lang="ts">
    import { parsePhoneNumberFromString } from 'libphonenumber-js';

    let telInputNumber: string;

    // const phoneNumber = parsePhoneNumber(' 8 (800) 555-35-35 ', 'RU');
    // if (phoneNumber) {
    //     phoneNumber.country === 'RU';
    //     phoneNumber.number === '+78005553535';
    //     phoneNumber.isValid() === true;
    //     // Note: `.getType()` requires `/max` metadata: see below for an explanation.
    //     phoneNumber.getType() === 'TOLL_FREE';
    // }

    // const parse = parsePhoneNumber(telInputNumber);

    const handleInput = (event: Event) => {
        let inputVal = (event.target as HTMLInputElement).value;
        console.log(parsePhoneNumberFromString(inputVal));
    };

    $: console.log(telInputNumber);
</script>

<input
    class="px-4 py-1 text-gray-900 rounded-full focus:outline-none"
    type="tel"
    on:input={handleInput}
/>
