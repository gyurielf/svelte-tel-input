import type { CountryCode } from 'libphonenumber-js';

type UnicodeFlag = Record<CountryCode, string>;
export const countryUnicodeFlags: UnicodeFlag = {
	AF: '&#x1F1E6;&#x1F1EB;', // Afghanistan
	AX: '&#x1F1E6;&#x1F1FD;', // Åland Islands
	AL: '&#x1F1E6;&#x1F1F1;', // Albania
	DZ: '&#x1F1E9;&#x1F1FF;', // Algeria
	AS: '&#x1F1E6;&#x1F1F8;', // American Samoa
	AD: '&#x1F1E6;&#x1F1E9;', // Andorra
	AO: '&#x1F1E6;&#x1F1F4;', // Angola
	AI: '&#x1F1E6;&#x1F1EE;', // Anguilla
	// "AQ": "&#127988;", // Antarctica
	AG: '&#x1F1E6;&#x1F1EC;', // Antigua & Barbuda
	AR: '&#x1F1E6;&#x1F1F7;', // Argentina
	AM: '&#x1F1E6;&#x1F1F2;', // Armenia
	AW: '&#x1F1E6;&#x1F1FC;', // Aruba
	AU: '&#x1F1E6;&#x1F1FA;', // Australia
	AT: '&#x1F1E6;&#x1F1F9;', // Austria
	AZ: '&#x1F1E6;&#x1F1FF;', // Azerbaijan
	BS: '&#x1F1E7;&#x1F1F8;', // Bahamas
	BH: '&#x1F1E7;&#x1F1ED;', // Bahrain
	BD: '&#x1F1E7;&#x1F1E9;', // Bangladesh
	BB: '&#x1F1E7;&#x1F1E7;', // Barbados
	BY: '&#x1F1E7;&#x1F1FE;', // Belarus
	BE: '&#x1F1E7;&#x1F1EA;', // Belgium
	BZ: '&#x1F1E7;&#x1F1FF;', // Belize
	BJ: '&#x1F1E7;&#x1F1EF;', // Benin
	BM: '&#x1F1E7;&#x1F1F2;', // Bermuda
	BT: '&#x1F1E7;&#x1F1F9;', // Bhutan
	BO: '&#x1F1E7;&#x1F1F4;', // Bolivia
	BA: '&#x1F1E7;&#x1F1E6;', // Bosnia & Herzegovina
	BW: '&#x1F1E7;&#x1F1FC;', // Botswana
	BR: '&#x1F1E7;&#x1F1F7;', // Brazil
	VG: '&#x1F1FB;&#x1F1EC;', // British Virgin Islands
	BN: '&#x1F1E7;&#x1F1F3;', // Brunei
	BG: '&#x1F1E7;&#x1F1EC;', // Bulgaria
	BF: '&#x1F1E7;&#x1F1EB;', // Burkina Faso
	BI: '&#x1F1E7;&#x1F1EE;', // Burundi
	CV: '&#x1F1E8;&#x1F1FB;', // Cape Verde
	KY: '&#x1F1F0;&#x1F1FE;', // Cayman Islands
	CF: '&#x1F1E8;&#x1F1EB;', // Central African Republic
	TD: '&#x1F1F9;&#x1F1E9;', // Chad
	CL: '&#x1F1E8;&#x1F1F1;', // Chile
	CN: '&#x1F1E8;&#x1F1F3;', // China
	CX: '&#x1F1E8;&#x1F1FD;', // Christmas Island
	CC: '&#x1F1E8;&#x1F1E8;', // Cocos (Keeling) Islands
	CO: '&#x1F1E8;&#x1F1F4;', // Colombia
	KM: '&#x1F1F0;&#x1F1F2;', // Comoros
	CG: '&#x1F1E8;&#x1F1EC;', // Congo - Brazzaville
	CD: '&#x1F1E8;&#x1F1E9;', // Congo - Kinshasa
	CK: '&#x1F1E8;&#x1F1F0;', // Cook Islands
	CR: '&#x1F1E8;&#x1F1F7;', // Costa Rica
	CI: '&#x1F1E8;&#x1F1EE;', // Côte d’Ivoire
	HR: '&#x1F1ED;&#x1F1F7;', // Croatia
	CU: '&#x1F1E8;&#x1F1FA;', // Cuba
	CW: '&#x1F1E8;&#x1F1FC;', // Curaçao
	CY: '&#x1F1E8;&#x1F1FE;', // Cyprus
	CZ: '&#x1F1E8;&#x1F1FF;', // Czechia
	DK: '&#x1F1E9;&#x1F1F0;', // Denmark
	DJ: '&#x1F1E9;&#x1F1EF;', // Djibouti
	DM: '&#x1F1E9;&#x1F1F2;', // Dominica
	DO: '&#x1F1E9;&#x1F1F4;', // Dominican Republic
	EC: '&#x1F1EA;&#x1F1E8;', // Ecuador
	EG: '&#x1F1EA;&#x1F1EC;', // Egypt
	SV: '&#x1F1F8;&#x1F1FB;', // El Salvador
	GQ: '&#x1F1EC;&#x1F1F6;', // Equatorial Guinea
	ER: '&#x1F1EA;&#x1F1F7;', // Eritrea
	EE: '&#x1F1EA;&#x1F1EA;', // Estonia
	SZ: '&#x1F1F8;&#x1F1FF;', // Eswatini
	ET: '&#x1F1EA;&#x1F1F9;', // Ethiopia
	FK: '&#x1F1EB;&#x1F1F0;', // Falkland Islands
	FO: '&#x1F1EB;&#x1F1F4;', // Faroe Islands
	FJ: '&#x1F1EB;&#x1F1EF;', // Fiji
	FI: '&#x1F1EB;&#x1F1EE;', // Finland
	FR: '&#x1F1EB;&#x1F1F7;', // France
	GF: '&#x1F1EC;&#x1F1EB;', // French Guiana
	PF: '&#x1F1F5;&#x1F1EB;', // French Polynesia
	GA: '&#x1F1EC;&#x1F1E6;', // Gabon
	GM: '&#x1F1EC;&#x1F1F2;', // Gambia
	GE: '&#x1F1EC;&#x1F1EA;', // Georgia
	DE: '&#x1F1E9;&#x1F1EA;', // Germany
	GH: '&#x1F1EC;&#x1F1ED;', // Ghana
	GI: '&#x1F1EC;&#x1F1EE;', // Gibraltar
	GR: '&#x1F1EC;&#x1F1F7;', // Greece
	GL: '&#x1F1EC;&#x1F1F1;', // Greenland
	GD: '&#x1F1EC;&#x1F1E9;', // Grenada
	GP: '&#x1F1EC;&#x1F1F5;', // Guadeloupe
	GU: '&#x1F1EC;&#x1F1FA;', // Guam
	GT: '&#x1F1EC;&#x1F1F9;', // Guatemala
	GG: '&#x1F1EC;&#x1F1EC;', // Guernsey
	GN: '&#x1F1EC;&#x1F1F3;', // Guinea
	GW: '&#x1F1EC;&#x1F1FC;', // Guinea-Bissau
	GY: '&#x1F1EC;&#x1F1FE;', // Guyana
	HT: '&#x1F1ED;&#x1F1F9;', // Haiti
	HN: '&#x1F1ED;&#x1F1F3;', // Honduras
	HK: '&#x1F1ED;&#x1F1F0;', // Hong Kong SAR China
	HU: '&#x1F1ED;&#x1F1FA;', // Hungary
	IS: '&#x1F1EE;&#x1F1F8;', // Iceland
	IN: '&#x1F1EE;&#x1F1F3;', // India
	ID: '&#x1F1EE;&#x1F1E9;', // Indonesia
	IR: '&#x1F1EE;&#x1F1F7;', // Iran
	IQ: '&#x1F1EE;&#x1F1F6;', // Iraq
	IE: '&#x1F1EE;&#x1F1EA;', // Ireland
	IM: '&#x1F1EE;&#x1F1F2;', // Isle of Man
	IL: '&#x1F1EE;&#x1F1F1;', // Israel
	IT: '&#x1F1EE;&#x1F1F9;', // Italy
	JM: '&#x1F1EF;&#x1F1F2;', // Jamaica
	JP: '&#x1F1EF;&#x1F1F5;', // Japan
	JE: '&#x1F1EF;&#x1F1EA;', // Jersey
	JO: '&#x1F1EF;&#x1F1F4;', // Jordan
	KZ: '&#x1F1FF;&#x1F1FF;', // Kazakhstan
	KE: '&#x1F1F0;&#x1F1EA;', // Kenya
	KI: '&#x1F1F0;&#x1F1EE;', // Kiribati
	XK: '&#x1F1FD;&#x1F1F0;', // Kosovo
	KW: '&#x1F1F0;&#x1F1FC;', // Kuwait
	KG: '&#x1F1F0;&#x1F1EC;', // Kyrgyzstan
	LA: '&#x1F1F1;&#x1F1E6;', // Laos
	LV: '&#x1F1F1;&#x1F1FB;', // Latvia
	LB: '&#x1F1F1;&#x1F1E7;', // Lebanon
	LS: '&#x1F1F1;&#x1F1F8;', // Lesotho
	LR: '&#x1F1F1;&#x1F1F7;', // Liberia
	LY: '&#x1F1F1;&#x1F1FE;', // Libya
	LI: '&#x1F1F1;&#x1F1EE;', // Liechtenstein
	LT: '&#x1F1F1;&#x1F1F9;', // Lithuania
	LU: '&#x1F1F1;&#x1F1FA;', // Luxembourg
	MO: '&#x1F1F2;&#x1F1F4;', // Macao SAR China
	MG: '&#x1F1F2;&#x1F1EC;', // Madagascar
	MW: '&#x1F1F2;&#x1F1FC;', // Malawi
	MY: '&#x1F1F2;&#x1F1FE;', // Malaysia
	MV: '&#x1F1F2;&#x1F1FB;', // Maldives
	ML: '&#x1F1F2;&#x1F1F1;', // Mali
	MT: '&#x1F1F2;&#x1F1F9;', // Malta
	MH: '&#x1F1F2;&#x1F1ED;', // Marshall Islands
	MQ: '&#x1F1F2;&#x1F1F6;', // Martinique
	MR: '&#x1F1F2;&#x1F1F7;', // Mauritania
	MU: '&#x1F1F2;&#x1F1FA;', // Mauritius
	YT: '&#x1F1FE;&#x1F1F9;', // Mayotte
	MX: '&#x1F1F2;&#x1F1FD;', // Mexico
	FM: '&#x1F1EB;&#x1F1F2;', // Micronesia
	MD: '&#x1F1F2;&#x1F1E9;', // Moldova
	MC: '&#x1F1F2;&#x1F1E8;', // Monaco
	MN: '&#x1F1F2;&#x1F1F3;', // Mongolia
	ME: '&#x1F1F2;&#x1F1EA;', // Montenegro
	MS: '&#x1F1F2;&#x1F1F8;', // Montserrat
	MA: '&#x1F1F2;&#x1F1E6;', // Morocco
	MZ: '&#x1F1F2;&#x1F1FF;', // Mozambique
	MM: '&#x1F1F2;&#x1F1F2;', // Myanmar (Burma)
	NA: '&#x1F1F3;&#x1F1E6;', // Namibia
	NR: '&#x1F1F3;&#x1F1F7;', // Nauru
	NP: '&#x1F1F3;&#x1F1F5;', // Nepal
	NL: '&#x1F1F3;&#x1F1F1;', // Netherlands
	NC: '&#x1F1F3;&#x1F1E8;', // New Caledonia
	NZ: '&#x1F1F3;&#x1F1FF;', // New Zealand
	NI: '&#x1F1F3;&#x1F1EE;', // Nicaragua
	NE: '&#x1F1F3;&#x1F1EA;', // Niger
	NG: '&#x1F1F3;&#x1F1EC;', // Nigeria
	NU: '&#x1F1F3;&#x1F1FA;', // Niue
	NF: '&#x1F1F3;&#x1F1EB;', // Norfolk Island
	KP: '&#x1F1F0;&#x1F1F5;', // North Korea
	MK: '&#x1F1F2;&#x1F1F0;', // North Macedonia
	MP: '&#x1F1F2;&#x1F1F5;', // Northern Mariana Islands
	NO: '&#x1F1F3;&#x1F1F4;', // Norway
	OM: '&#x1F1F4;&#x1F1F2;', // Oman
	PK: '&#x1F1F5;&#x1F1F0;', // Pakistan
	PW: '&#x1F1F5;&#x1F1FC;', // Palau
	PS: '&#x1F1F5;&#x1F1F8;', // Palestinian Territories
	PA: '&#x1F1F5;&#x1F1E6;', // Panama
	PG: '&#x1F1F5;&#x1F1EC;', // Papua New Guinea
	PY: '&#x1F1F5;&#x1F1FE;', // Paraguay
	PE: '&#x1F1F5;&#x1F1EA;', // Peru
	PH: '&#x1F1F5;&#x1F1ED;', // Philippines
	// "PN": "&#x1F1F5;&#x1F1F3;", // Pitcairn Islands
	PL: '&#x1F1F5;&#x1F1F1;', // Poland
	PT: '&#x1F1F5;&#x1F1F9;', // Portugal
	PR: '&#x1F1F5;&#x1F1F7;', // Puerto Rico
	QA: '&#x1F1F6;&#x1F1E6;', // Qatar
	RE: '&#x1F1F7;&#x1F1EA;', // Réunion
	RO: '&#x1F1F7;&#x1F1F4;', // Romania
	RU: '&#x1F1F7;&#x1F1FA;', // Russia
	RW: '&#x1F1F7;&#x1F1FC;', // Rwanda
	WS: '&#x1F1FC;&#x1F1F8;', // Samoa
	SM: '&#x1F1F8;&#x1F1F2;', // San Marino
	ST: '&#x1F1F8;&#x1F1F9;', // São Tomé & Príncipe
	SA: '&#x1F1F8;&#x1F1E6;', // Saudi Arabia
	SN: '&#x1F1F8;&#x1F1F3;', // Senegal
	RS: '&#x1F1F7;&#x1F1F8;', // Serbia
	SC: '&#x1F1F8;&#x1F1E8;', // Seychelles
	SL: '&#x1F1F8;&#x1F1F1;', // Sierra Leone
	SG: '&#x1F1F8;&#x1F1EC;', // Singapore
	SX: '&#x1F1F8;&#x1F1FD;', // Sint Maarten
	SK: '&#x1F1F8;&#x1F1F0;', // Slovakia
	SI: '&#x1F1F8;&#x1F1EE;', // Slovenia
	SB: '&#x1F1F8;&#x1F1E7;', // Solomon Islands
	SO: '&#x1F1F8;&#x1F1F4;', // Somalia
	ZA: '&#x1F1FF;&#x1F1E6;', // South Africa
	// "GS": "&#x1F1EC;&#x1F1F8;", // South Georgia & South Sandwich Islands
	KR: '&#x1F1F0;&#x1F1F7;', // South Korea
	SS: '&#x1F1F8;&#x1F1F8;', // South Sudan
	ES: '&#x1F1EA;&#x1F1F8;', // Spain
	LK: '&#x1F1F1;&#x1F1F0;', // Sri Lanka
	BL: '&#x1F1E7;&#x1F1F1;', // St. Barthélemy
	SH: '&#x1F1F8;&#x1F1ED;', // St. Helena
	KN: '&#x1F1F0;&#x1F1F3;', // St. Kitts & Nevis
	LC: '&#x1F1F1;&#x1F1E8;', // St. Lucia
	MF: '&#x1F1F2;&#x1F1EB;', // St. Martin
	PM: '&#x1F1F5;&#x1F1F2;', // St. Pierre & Miquelon
	VC: '&#x1F1FB;&#x1F1E8;', // St. Vincent & Grenadines
	SD: '&#x1F1F8;&#x1F1E9;', // Sudan
	SR: '&#x1F1F8;&#x1F1F7;', // Suriname
	SJ: '&#x1F1F8;&#x1F1EF;', // Svalbard & Jan Mayen
	SE: '&#x1F1F8;&#x1F1EA;', // Sweden
	CH: '&#x1F1E8;&#x1F1ED;', // Switzerland
	SY: '&#x1F1F8;&#x1F1FE;', // Syria
	TW: '&#x1F1F9;&#x1F1FC;', // Taiwan
	TJ: '&#x1F1F9;&#x1F1EF;', // Tajikistan
	TZ: '&#x1F1F9;&#x1F1FF;', // Tanzania
	TH: '&#x1F1F9;&#x1F1ED;', // Thailand
	TL: '&#x1F1F9;&#x1F1F1;', // Timor-Leste
	TG: '&#x1F1F9;&#x1F1EC;', // Togo
	TK: '&#x1F1F9;&#x1F1F0;', // Tokelau
	TO: '&#x1F1F9;&#x1F1F4;', // Tonga
	TT: '&#x1F1F9;&#x1F1F9;', // Trinidad & Tobago
	TN: '&#x1F1F9;&#x1F1F3;', // Tunisia
	TR: '&#x1F1F9;&#x1F1F7;', // Turkey
	TM: '&#x1F1F9;&#x1F1F2;', // Turkmenistan
	TC: '&#x1F1F9;&#x1F1E8;', // Turks & Caicos Islands
	TV: '&#x1F1F9;&#x1F1FB;', // Tuvalu
	// "UM": "&#x1F1FA;&#x1F1F2;", // U.S. Outlying Islands
	VI: '&#x1F1FB;&#x1F1EE;', // U.S. Virgin Islands
	UG: '&#x1F1FA;&#x1F1EC;', // Uganda
	UA: '&#x1F1FA;&#x1F1E6;', // Ukraine
	AE: '&#x1F1E6;&#x1F1EA;', // United Arab Emirates
	GB: '&#x1F1EC;&#x1F1E7;', // United Kingdom
	US: '&#x1F1FA;&#x1F1F8;', // United States
	UY: '&#x1F1FA;&#x1F1FE;', // Uruguay
	UZ: '&#x1F1FA;&#x1F1FF;', // Uzbekistan
	VU: '&#x1F1FB;&#x1F1FA;', // Vanuatu
	VA: '&#x1F1FB;&#x1F1E6;', // Vatican City
	VE: '&#x1F1FB;&#x1F1EA;', // Venezuela
	VN: '&#x1F1FB;&#x1F1F3;', // Vietnam
	WF: '&#x1F1FC;&#x1F1EB;', // Wallis & Futuna
	EH: '&#x1F1EA;&#x1F1ED;', // Western Sahara
	YE: '&#x1F1FE;&#x1F1EA;', // Yemen
	ZM: '&#x1F1FF;&#x1F1F2;', // Zambia
	ZW: '&#x1F1FF;&#x1F1FC;', // Zimbabwe,
	AC: '&#127988;', // Ascension Island (no specific Unicode flag, using a placeholder)
	BQ: '&#127988;', // Caribbean Netherlands (no specific Unicode flag, using a placeholder)
	CA: '&#127988;', // Canada (seems to be using a placeholder instead of the actual flag)
	CM: '&#127988;', // Cameroon (seems to be using a placeholder instead of the actual flag)
	IO: '&#127988;', // British Indian Ocean Territory (no specific Unicode flag, using a placeholder)
	KH: '&#127988;', // Cambodia (seems to be using a placeholder instead of the actual flag)
	TA: '&#127988;' // Tristan da Cunha (no specific Unicode flag, using a placeholder)
} as const;
