import type { DynamicSvelteComponent } from '../models/types/DynamicSvelteComponent.type';

export const isDynamicComponent = (item: unknown): item is DynamicSvelteComponent => {
	return (
		typeof item === 'object' &&
		item !== null &&
		Object.prototype.hasOwnProperty.call(item, 'component')
	);
};

export const isStringArray = (items: unknown): items is string[] => {
	return Array.isArray(items) && items.length > 0 && typeof items[0] === 'string';
};

export const isDynamicComponentArray = (items: unknown): items is DynamicSvelteComponent[] => {
	return Array.isArray(items) && items.length > 0 && isDynamicComponent(items[0]);
};
