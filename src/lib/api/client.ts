import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';
import { browser } from '$app/environment';
import type { ApiError } from './types';
import { apiConfig, type ApiConfig } from '$lib/config/api';

// Create axios instance with configurable settings
const createApiClient = (config: ApiConfig): AxiosInstance => {
	return axios.create({
		baseURL: config.baseURL,
		timeout: config.timeout,
		headers: config.headers,
	});
};

// Initialize with default config
let apiClient: AxiosInstance = createApiClient(apiConfig);

// Store session token for use in interceptors
let sessionToken: string | null = null;

// Function to set session token (called from auth context)
export const setSessionToken = (token: string | null): void => {
	sessionToken = token;
};

// Function to get current session token
export const getSessionToken = (): string | null => {
	return sessionToken;
};

// Function to reconfigure the API client
export const reconfigureApiClient = (newConfig: Partial<ApiConfig>): void => {
	const updatedConfig = { ...apiConfig, ...newConfig };
	apiClient = createApiClient(updatedConfig);
	
	// Re-apply interceptors
	setupInterceptors();
	
	console.log('API client reconfigured:', updatedConfig);
};

// Function to get current configuration
export const getCurrentApiConfig = (): ApiConfig => {
	return { ...apiConfig };
};

// Setup interceptors (extracted to reusable function)
const setupInterceptors = (): void => {
	// Request interceptor to add auth token from session
	apiClient.interceptors.request.use(
		(config) => {
			if (browser && sessionToken) {
				config.headers.Authorization = `Bearer ${sessionToken}`;
				console.log('Added session auth header for request:', config.url);
			} else if (!browser) {
				console.log('Server-side request (no token needed):', config.url);
			} else {
				console.log('No session token for request:', config.url);
			}
			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	// Response interceptor to handle auth errors and format errors
	apiClient.interceptors.response.use(
		(response: AxiosResponse) => {
			return response;
		},
		(error: AxiosError) => {
			const apiError: ApiError = {
				message: 'An error occurred',
				status: error.response?.status
			};

			// Handle different error scenarios
			if (error.response) {
				// Server responded with error status
				apiError.status = error.response.status;
				apiError.message = (error.response.data as any)?.message || error.message;
				apiError.details = error.response.data;

				// Handle 401 Unauthorized
				if (error.response.status === 401) {
					if (browser) {
						// Clear session token
						sessionToken = null;
						// In SvelteKit Auth, session invalidation is handled by the auth library
						console.log('Authentication failed - session may need refresh');
					}
					apiError.message = 'Authentication required';
				}
				
				// Handle 403 Forbidden
				if (error.response.status === 403) {
					apiError.message = 'Access denied';
				}
				
				// Handle 404 Not Found
				if (error.response.status === 404) {
					apiError.message = 'Resource not found';
				}
				
				// Handle 500 Internal Server Error
				if (error.response.status >= 500) {
					apiError.message = 'Server error occurred';
				}
			} else if (error.request) {
				// Network error
				apiError.message = 'Network error - please check your connection';
				console.error('Network error:', error.message);
			} else {
				// Request setup error
				apiError.message = error.message;
			}
			
			return Promise.reject(apiError);
		}
	);
};

// Initialize interceptors
setupInterceptors();

// Generic API methods
export const api = {
	get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
		apiClient.get<T>(url, config),
	
	post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
		apiClient.post<T>(url, data, config),
	
	put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
		apiClient.put<T>(url, data, config),
	
	patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
		apiClient.patch<T>(url, data, config),
	
	delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
		apiClient.delete<T>(url, config),
};

// Export the axios instance for advanced usage
export { apiClient };
export default api;