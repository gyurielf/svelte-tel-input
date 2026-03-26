export const capitalize = (str: string) => {
	return (str && str[0].toUpperCase() + str.slice(1).toLowerCase()) || '';
};

export const isNumber = (value: number) => {
	return typeof value === 'number' && isFinite(value);
};

export const isSelected = <T extends { id: string }>(
	itemToSelect: T | string,
	selectedItem: (T | undefined | null) | string
): boolean => {
	if (!selectedItem) return false;
	if (typeof selectedItem === 'object' && typeof itemToSelect === 'object')
		return selectedItem.id === itemToSelect.id;
	return itemToSelect === selectedItem;
};
