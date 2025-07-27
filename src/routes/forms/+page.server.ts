import { fail } from '@sveltejs/kit';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types.js';
import { schema } from './schema.js';

export const load: PageServerLoad = async () => {
	// Initialize with explicit default values
	const defaultValues = {
		name: 'ss',
		email: 's',
		age: 18,
		country: 's',
		role: 'student' as const,
		bio: 's',
		terms: false
	};

	return { form: await superValidate(defaultValues, zod4(schema)) };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod4(schema));
		console.log(form.data, 'data');

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// Process form data here
			console.log('Processing form data:', form.data);

			return withFiles({
				form,
				success: true
			});
		} catch (err) {
			console.error('Error processing form:', err);
			return fail(500, { form, error: 'Failed to process form' });
		}
	}
};
