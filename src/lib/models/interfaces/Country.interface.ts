export interface Country {
	name: string;
	iso2: string | number | string[];
	dialCode: string | number | string[];
	priority: string | number | string[];
	areaCodes: string | number | string[] | null;
}
