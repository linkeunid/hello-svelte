import { error } from '@sveltejs/kit';

export function load() {
	throw error(403, {
		message:
			'Custom 403: Access denied! This demonstrates a custom "Forbidden" error with a detailed explanation of why access was denied.'
	});
}
