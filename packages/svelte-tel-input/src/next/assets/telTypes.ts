import { capitalize } from '$lib/utils/index.js';
export const telTypes = [
	'PREMIUM_RATE',
	'TOLL_FREE',
	'SHARED_COST',
	'VOIP',
	'PERSONAL_NUMBER',
	'PAGER',
	'UAN',
	'VOICEMAIL',
	'FIXED_LINE_OR_MOBILE',
	'FIXED_LINE',
	'MOBILE'
].map((el) => {
	return { id: el, value: el, label: capitalize(el.split('_').join(' ')) };
});
