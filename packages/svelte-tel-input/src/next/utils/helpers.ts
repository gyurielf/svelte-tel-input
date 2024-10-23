// Use carefully, it can be rate limited.
export const getCurrentCountry = async () => {
	try {
		const response = await (await fetch('https://ip2c.org/s')).text();
		const result = (response || '').toString();

		if (!result || result[0] !== '1') {
			console.warn('Unable to fetch the country');
			return;
		}

		return result.substring(2, 4);
	} catch {
		console.warn('Unable to fetch the country');
		return;
	}
};
