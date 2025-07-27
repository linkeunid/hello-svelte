import { error } from '@sveltejs/kit';

export function load() {
	throw error(503, {
		message:
			'Service temporarily unavailable: The external API service is currently undergoing maintenance. Please try again in a few minutes. Expected restoration time: 15 minutes.'
	});
}
