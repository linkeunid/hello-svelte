import { z } from 'zod';
import { api } from './client';

// User schema based on DummyJSON API
export const userSchema = z.object({
	id: z.number(),
	firstName: z.string(),
	lastName: z.string(),
	maidenName: z.string(),
	age: z.number(),
	gender: z.enum(['male', 'female']),
	email: z.string().email(),
	phone: z.string(),
	username: z.string(),
	password: z.string(),
	birthDate: z.string(),
	image: z.string().url(),
	bloodGroup: z.string(),
	height: z.number(),
	weight: z.number(),
	eyeColor: z.string(),
	hair: z.object({
		color: z.string(),
		type: z.string()
	}),
	ip: z.string(),
	address: z.object({
		address: z.string(),
		city: z.string(),
		state: z.string(),
		stateCode: z.string(),
		postalCode: z.string(),
		coordinates: z.object({
			lat: z.number(),
			lng: z.number()
		}),
		country: z.string()
	}),
	macAddress: z.string(),
	university: z.string(),
	bank: z.object({
		cardExpire: z.string(),
		cardNumber: z.string(),
		cardType: z.string(),
		currency: z.string(),
		iban: z.string()
	}),
	company: z.object({
		department: z.string(),
		name: z.string(),
		title: z.string(),
		address: z.object({
			address: z.string(),
			city: z.string(),
			state: z.string(),
			stateCode: z.string(),
			postalCode: z.string(),
			coordinates: z.object({
				lat: z.number(),
				lng: z.number()
			}),
			country: z.string()
		})
	}),
	ein: z.string(),
	ssn: z.string(),
	userAgent: z.string(),
	crypto: z.object({
		coin: z.string(),
		wallet: z.string(),
		network: z.string()
	}),
	role: z.string()
});

export const usersResponseSchema = z.object({
	users: z.array(userSchema),
	total: z.number(),
	skip: z.number(),
	limit: z.number()
});

export type User = z.infer<typeof userSchema>;
export type UsersResponse = z.infer<typeof usersResponseSchema>;

export async function fetchUsers(
	limit: number = 30,
	skip: number = 0
): Promise<UsersResponse> {
	try {
		const response = await api.get<UsersResponse>(
			`/users?limit=${limit}&skip=${skip}`
		);
		
		return usersResponseSchema.parse(response.data);
	} catch (error) {
		console.error('Error fetching users:', error);
		throw new Error('Failed to fetch users');
	}
}

export async function searchUsers(
	query: string,
	limit: number = 30
): Promise<UsersResponse> {
	try {
		const response = await api.get<UsersResponse>(
			`/users/search?q=${encodeURIComponent(query)}&limit=${limit}`
		);
		
		return usersResponseSchema.parse(response.data);
	} catch (error) {
		console.error('Error searching users:', error);
		throw new Error('Failed to search users');
	}
}

// Auth-related user functions
export async function getUserById(id: number): Promise<User> {
	try {
		const response = await api.get<User>(`/users/${id}`);
		return userSchema.parse(response.data);
	} catch (error) {
		console.error('Error fetching user by ID:', error);
		throw new Error('Failed to fetch user');
	}
}

export async function getCurrentUser(): Promise<User> {
	try {
		const response = await api.get<User>('/auth/me');
		return userSchema.parse(response.data);
	} catch (error) {
		console.error('Error fetching current user:', error);
		throw new Error('Failed to fetch current user');
	}
}

export async function updateUser(id: number, userData: Partial<User>): Promise<User> {
	try {
		const response = await api.put<User>(`/users/${id}`, userData);
		return userSchema.parse(response.data);
	} catch (error) {
		console.error('Error updating user:', error);
		throw new Error('Failed to update user');
	}
}