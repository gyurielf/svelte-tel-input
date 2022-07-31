export * from './enums';
export * from './interfaces';
export type { DynamicSvelteComponent } from './DynamicSvelteComponent.type';

export type DispatchSelectEvents<T> = {
	add: { option: T };
	remove: { option: T };
	same: { option: T };
	change: {
		option: T;
	};
	focus: unknown;
	blur: unknown;
};
