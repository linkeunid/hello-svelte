import { PUBLIC_API_BASE_URL } from '$env/static/public';

// API Configuration interface
export interface ApiConfig {
	baseURL: string;
	timeout: number;
	headers: Record<string, string>;
	retryAttempts: number;
	retryDelay: number;
}

// Default configuration
const defaultConfig: ApiConfig = {
	baseURL: 'https://dummyjson.com',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
	retryAttempts: 3,
	retryDelay: 1000,
};

// Client-side environment configuration (public variables only)
const getEnvironmentConfig = (): Partial<ApiConfig> => {
	const config: Partial<ApiConfig> = {};
	
	// Public environment variables (available in browser)
	// For private environment variables, use api.server.ts on the server-side
	if (PUBLIC_API_BASE_URL) {
		config.baseURL = PUBLIC_API_BASE_URL;
	}
	
	return config;
};

// Merge configurations
export const apiConfig: ApiConfig = {
	...defaultConfig,
	...getEnvironmentConfig(),
};

// Configuration for different environments
export const environmentConfigs = {
	development: {
		...defaultConfig,
		baseURL: 'https://dummyjson.com',
		timeout: 15000,
	},
	staging: {
		...defaultConfig,
		baseURL: 'https://staging-api.example.com',
		timeout: 12000,
	},
	production: {
		...defaultConfig,
		baseURL: 'https://api.example.com',
		timeout: 8000,
	},
} as const;

// Get config for specific environment
export const getConfigForEnvironment = (env: keyof typeof environmentConfigs): ApiConfig => {
	return environmentConfigs[env];
};

// Update configuration at runtime
export const updateApiConfig = (newConfig: Partial<ApiConfig>): ApiConfig => {
	Object.assign(apiConfig, newConfig);
	return apiConfig;
};

// Validate configuration
export const validateApiConfig = (config: ApiConfig): boolean => {
	try {
		new URL(config.baseURL);
		return config.timeout > 0 && config.retryAttempts >= 0 && config.retryDelay >= 0;
	} catch {
		return false;
	}
};

// Configuration presets for common APIs
export const apiPresets = {
	dummyjson: {
		baseURL: 'https://dummyjson.com',
		timeout: 10000,
		headers: { 'Content-Type': 'application/json' },
		retryAttempts: 3,
		retryDelay: 1000,
	},
	jsonplaceholder: {
		baseURL: 'https://jsonplaceholder.typicode.com',
		timeout: 8000,
		headers: { 'Content-Type': 'application/json' },
		retryAttempts: 2,
		retryDelay: 500,
	},
	custom: {
		baseURL: 'http://localhost:3001',
		timeout: 15000,
		headers: { 'Content-Type': 'application/json' },
		retryAttempts: 5,
		retryDelay: 2000,
	},
} as const;

// Apply preset configuration
export const applyPreset = (preset: keyof typeof apiPresets): ApiConfig => {
	return updateApiConfig(apiPresets[preset]);
};