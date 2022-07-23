import type { PhoneNumberParseError } from '$lib/types/enums';

export interface PhoneNumberError {
	isValid: false;
	error: PhoneNumberParseError;
}
