export const capitalize = (str: string) => {
	return (str && str[0].toUpperCase() + str.slice(1).toLowerCase()) || '';
};

export const isNumber = (value: number) => {
	return typeof value === 'number' && isFinite(value);
};
