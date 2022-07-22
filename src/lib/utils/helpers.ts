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

export const normalizePhoneInput = (
	input: PhoneNumber | null
): Record<string, number | boolean | string | null> => {
	if (input && input !== null) {
		return {
			countryCode: input.country || null,
			isValid: input.isValid(),
			phoneNumber: input.number,
			countryCallingCode: input.countryCallingCode,
			formattedNumber: input.formatInternational(),
			nationalNumber: input.nationalNumber,
			formatInternational: input.formatInternational(),
			formatNational: input.formatNational(),
			uri: input.getURI(),
			e164: input.number
		};
	} else {
		throw new Error('No data provided');
	}
};
