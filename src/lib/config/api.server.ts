import { env } from '$env/dynamic/private';
import type { ApiConfig } from './api';

// Server-side configuration that can safely access private environment variables
export const getServerApiConfig = (): Partial<ApiConfig> => {
	const config: Partial<ApiConfig> = {};
	
	if (env.API_BASE_URL) {
		config.baseURL = env.API_BASE_URL;
	}
	if (env.API_TIMEOUT) {
		config.timeout = Number(env.API_TIMEOUT);
	}
	if (env.API_RETRY_ATTEMPTS) {
		config.retryAttempts = Number(env.API_RETRY_ATTEMPTS);
	}
	if (env.API_RETRY_DELAY) {
		config.retryDelay = Number(env.API_RETRY_DELAY);
	}
	
	return config;
};

// Create server-side API configuration
export const createServerApiConfig = (): ApiConfig => {
	const defaultConfig: ApiConfig = {
		baseURL: 'https://dummyjson.com',
		timeout: 10000,
		headers: {
			'Content-Type': 'application/json',
		},
		retryAttempts: 3,
		retryDelay: 1000,
	};
	
	return {
		...defaultConfig,
		...getServerApiConfig(),
	};
};