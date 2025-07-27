import { error } from '@sveltejs/kit';

export function load() {
	throw error(422, {
		message:
			'Validation failed: The submitted data contains multiple validation errors. Field "email" must be a valid email address. Field "password" must be at least 8 characters long. Field "confirmPassword" must match the password field.'
	});
}
