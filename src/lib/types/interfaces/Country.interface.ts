import type { CountryCode } from 'libphonenumber-js';

export interface Country {
	name: string;
	iso2: CountryCode;
	dialCode: string | number | string[];
	priority: string | number | string[];
	areaCodes: string | number | string[] | null;
}
