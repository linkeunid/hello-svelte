import { error } from '@sveltejs/kit';

export function load() {
	throw error(500, {
		message:
			'Custom 500: This is a demonstration of a custom "Internal Server Error" triggered intentionally for testing purposes.'
	});
}
