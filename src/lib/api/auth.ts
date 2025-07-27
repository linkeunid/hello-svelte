import { removeToken, setToken } from '$lib/utils/token';
import { z } from 'zod';
import { api } from './client';
import { userSchema, type User } from './users';

// Auth schemas
export const loginCredentialsSchema = z.object({
	username: z.string().min(1, 'Username is required'),
	password: z.string().min(1, 'Password is required'),
	expiresInMins: z.number().optional().default(30)
});

export const loginResponseSchema = z.object({
	id: z.number(),
	username: z.string(),
	email: z.string().email(),
	firstName: z.string(),
	lastName: z.string(),
	gender: z.enum(['male', 'female']),
	image: z.string().url(),
	accessToken: z.string(),
	refreshToken: z.string()
});

export const refreshTokenSchema = z.object({
	refreshToken: z.string(),
	expiresInMins: z.number().optional().default(30)
});

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>;

// Authentication functions
/**
 * @deprecated Use SvelteKit Auth instead. This function is kept for compatibility but should not be used in new code.
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
	try {
		console.log('Login credentials:', credentials);
		const validatedCredentials = loginCredentialsSchema.parse(credentials);

		const response = await api.post<LoginResponse>('/auth/login', validatedCredentials);
		console.log('Login response:', response.data);
		const loginData = loginResponseSchema.parse(response.data);

		// Store the token
		setToken(loginData.accessToken);

		return loginData;
	} catch (error) {
		console.error('Login error:', error);
		throw new Error('Login failed');
	}
}

/**
 * @deprecated Use SvelteKit Auth instead. This function is kept for compatibility but should not be used in new code.
 */
export async function refreshToken(
	refreshTokenRequest: RefreshTokenRequest
): Promise<LoginResponse> {
	try {
		const validatedRequest = refreshTokenSchema.parse(refreshTokenRequest);

		const response = await api.post<LoginResponse>('/auth/refresh', validatedRequest);
		const refreshData = loginResponseSchema.parse(response.data);

		// Update the stored token
		setToken(refreshData.accessToken);

		return refreshData;
	} catch (error) {
		console.error('Token refresh error:', error);
		throw new Error('Token refresh failed');
	}
}

/**
 * @deprecated Use SvelteKit Auth signOut instead. This function is kept for compatibility but should not be used in new code.
 */
export async function logout(): Promise<void> {
	try {
		// Call logout endpoint if your API has one
		// await api.post('/auth/logout');

		// Remove token from storage
		removeToken();
	} catch (error) {
		console.error('Logout error:', error);
		// Still remove token even if API call fails
		removeToken();
	}
}

export async function getProfile(): Promise<User> {
	try {
		const response = await api.get<User>('/auth/me');
		return userSchema.parse(response.data);
	} catch (error) {
		console.error('Get profile error:', error);
		throw new Error('Failed to fetch user profile');
	}
}

// Register function (if your API supports it)
export const registerSchema = z.object({
	username: z.string().min(3, 'Username must be at least 3 characters'),
	email: z.string().email('Valid email is required'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	age: z.number().min(18, 'Must be at least 18 years old'),
	gender: z.enum(['male', 'female']).optional()
});

export type RegisterData = z.infer<typeof registerSchema>;

export async function register(userData: RegisterData): Promise<LoginResponse> {
	try {
		const validatedData = registerSchema.parse(userData);

		const response = await api.post<LoginResponse>('/auth/register', validatedData);
		const registerData = loginResponseSchema.parse(response.data);

		// Store the token
		setToken(registerData.accessToken);

		return registerData;
	} catch (error) {
		console.error('Registration error:', error);
		throw new Error('Registration failed');
	}
}
