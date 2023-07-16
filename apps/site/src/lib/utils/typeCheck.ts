export const isStringArray = (items: unknown): items is string[] => {
	return Array.isArray(items) && items.length > 0 && typeof items[0] === 'string';
};
