import type { CountryCode } from '$lib/types/interfaces/Phone.interface';
export interface Country {
	id: string;
	label: string;
	name: string;
	iso2: CountryCode;
	dialCode: string | number | string[];
	priority: string | number | string[];
	areaCodes: string | number | string[] | null;
}
