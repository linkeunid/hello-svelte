import { error } from '@sveltejs/kit';

export function load() {
	throw error(418, {
		message:
			"Custom 418: I'm a teapot! This is a humorous HTTP status code demonstrating how custom error codes and messages are handled by our error page."
	});
}
