import type { PhoneNumber } from 'libphonenumber-js';

export const capitalize = (str: string) => {
	return (str && str[0].toUpperCase() + str.slice(1).toLowerCase()) || '';
};

export const getCurrentCountry = async () => {
	try {
		const response = await (await fetch('https://ip2c.org/s')).text();
		const result = (response || '').toString();

		if (!result || result[0] !== '1') {
			throw new Error('Unable to fetch the country');
		}

		return result.substring(2, 4);
	} catch (error) {
		throw new Error('Unable to fetch the country');
	}
};

export const normalizePhoneInput = (input: PhoneNumber | null) => {
	const resultObject = {
		countryCode: input ? input.country : null,
		isValid: input ? input.isValid() : false,
		phoneNumber: input ? input.number : null,
		countryCallingCode: input ? input.countryCallingCode : null,
		formattedNumber: input ? input.formatInternational() : null,
		nationalNumber: input ? input.nationalNumber : null,
		formatInternational: input ? input.formatInternational() : null,
		formatNational: input ? input.formatNational() : null,
		uri: input ? input.getURI() : null,
		e164: input ? input.number : null
	};
	const filteredResult = Object.fromEntries(
		Object.entries(resultObject).filter(([key, value]) => value !== null)
	);
	return filteredResult;
};
