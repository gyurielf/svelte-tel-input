import type { NormalizedPhoneNumber } from '$lib/types/interfaces/Phone.interface';
import type { PhoneNumber } from 'libphonenumber-js';

export const capitalize = (str: string) => {
	return (str && str[0].toUpperCase() + str.slice(1).toLowerCase()) || '';
};

export const getCurrentCountry = async () => {
	try {
		const response = await (await fetch('https://ip2c.org/s')).text();
		const result = (response || '').toString();

		if (!result || result[0] !== '1') {
			console.warn('Unable to fetch the country');
			return;
		}

		return result.substring(2, 4);
	} catch (error) {
		console.warn('Unable to fetch the country');
		return;
	}
};

export const isNumber = (value: number) => {
	return typeof value === 'number' && isFinite(value);
};

export const normalizePhoneInput = (input: PhoneNumber) => {
	const filteredResult = Object.fromEntries(
		Object.entries({
			countryCode: input ? input.country : null,
			isValid: input ? input.isValid() : false,
			phoneNumber: input ? input.number : null,
			countryCallingCode: input ? input.countryCallingCode : null,
			formattedNumber: input ? input.formatInternational() : null,
			nationalNumber: input ? input.nationalNumber : null,
			formatInternational: input ? input.formatInternational() : null,
			formatOriginal: input
				? input
						.formatInternational()
						.slice(input.countryCallingCode.length + 1)
						.trim()
				: null,
			formatNational: input ? input.formatNational() : null,
			uri: input ? input.getURI() : null,
			e164: input ? input.number : null
		}).filter(([, value]) => value !== null)
	);
	return filteredResult;
};

export const isSelected = <
	T extends {
		id: string;
	}
>(
	itemToSelect: T,
	selectedItem: T | undefined | null
): boolean => {
	if (!selectedItem || selectedItem === null) {
		return false;
	}
	if (
		typeof selectedItem === 'object' &&
		typeof itemToSelect === 'object' &&
		selectedItem !== null &&
		itemToSelect !== null
	) {
		if (
			typeof selectedItem === 'object' &&
			typeof itemToSelect === 'object' &&
			selectedItem.id === itemToSelect.id
		) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
};

export const jsonPrettyParser = (node: HTMLElement, data: NormalizedPhoneNumber | null) => {
	data !== null && (node.innerHTML = `<code>${JSON.stringify(data, null, 2)}</code>`);
	return {
		destroy: () => {
			node.remove();
		}
	};
};
