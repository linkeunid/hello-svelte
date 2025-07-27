/**
 * @deprecated These token utilities are deprecated in favor of SvelteKit Auth session management.
 * They are kept for compatibility but should not be used in new code.
 */

import { browser } from '$app/environment';

const TOKEN_KEY = 'auth_token';

export function getToken(): string | null {
	if (!browser) return null;
	return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
	if (!browser) return;
	localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
	if (!browser) return;
	localStorage.removeItem(TOKEN_KEY);
}

export function isTokenValid(token: string | null): boolean {
	if (!token) return false;
	
	try {
		// Basic JWT validation - check if it has 3 parts
		const parts = token.split('.');
		if (parts.length !== 3) return false;
		
		// Decode payload to check expiration
		const payload = JSON.parse(atob(parts[1]));
		const now = Math.floor(Date.now() / 1000);
		
		// Check if token is expired
		if (payload.exp && payload.exp < now) {
			return false;
		}
		
		return true;
	} catch {
		return false;
	}
}

export function getTokenPayload(token: string): any | null {
	try {
		const parts = token.split('.');
		if (parts.length !== 3) return null;
		
		return JSON.parse(atob(parts[1]));
	} catch {
		return null;
	}
}