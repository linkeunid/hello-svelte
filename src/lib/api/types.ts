// Common API types and interfaces

export interface ApiError {
	message: string;
	status?: number;
	code?: string;
	details?: any;
}

export interface ApiResponse<T = any> {
	data: T;
	message?: string;
	success: boolean;
}

export interface PaginatedResponse<T = any> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	hasNext: boolean;
	hasPrev: boolean;
}

// Request config extending axios config
export interface RequestConfig {
	timeout?: number;
	retries?: number;
	skipAuth?: boolean;
	baseURL?: string;
}

// HTTP methods enum
export enum HttpMethod {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	PATCH = 'PATCH',
	DELETE = 'DELETE'
}

// Common status codes
export enum StatusCode {
	OK = 200,
	CREATED = 201,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	INTERNAL_SERVER_ERROR = 500
}