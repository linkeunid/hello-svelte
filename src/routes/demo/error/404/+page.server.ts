import { error } from '@sveltejs/kit';

export function load() {
	throw error(404, {
		message:
			'Custom 404: This is a demonstration of a custom "Page Not Found" error message from the demo page.'
	});
}
