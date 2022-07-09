export const capitalize = (str: string) => {
	return (str && str[0].toUpperCase() + str.slice(1).toLowerCase()) || '';
};

export const getCurrentCountry = async () => {
	const response = await (await fetch('https://ip2c.org/s')).text();
	const result = (response || '').toString();

	if (!result || result[0] !== '1') {
		throw new Error('Unable to fetch the country');
	}

	return result.substring(2, 4);
};
