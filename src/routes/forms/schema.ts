import { z } from 'zod';

export const schema = z.object({
	// Basic fields
	name: z.string().min(2, 'Name must be at least 2 characters'),
	email: z.string().email('Please enter a valid email address'),
	age: z.coerce.number().min(18, 'Must be at least 18 years old'),
	country: z.string().min(1, 'Please select a country'),
	role: z.enum(['student', 'professional', 'freelancer', 'other']).default('student'),
	bio: z.string().min(10, 'Bio must be at least 10 characters'),

	// Date picker
	birthDate: z.string().min(1, 'Please select your birth date'),

	// Date range picker
	projectDuration: z
		.object({
			start: z.string().min(1, 'Please select start date'),
			end: z.string().min(1, 'Please select end date')
		})
		.optional(),

	// Switch
	newsletter: z.boolean(),

	// Additional checkboxes
	interests: z.array(z.string()).min(1, 'Please select at least one interest'),

	// Terms checkbox
	terms: z.boolean().refine((val) => val === true, {
		message: 'You must accept the terms and conditions'
	})
});

export type FormSchema = z.infer<typeof schema>;
