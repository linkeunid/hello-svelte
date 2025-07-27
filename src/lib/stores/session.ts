import { browser } from '$app/environment';
import { setSessionToken } from '$lib/api/client';

// Function to sync session token with API client
export const syncSessionToken = (session: any) => {
	if (browser) {
		const token = session?.accessToken || null;
		setSessionToken(token);
		
		if (token) {
			console.log('Session token synced with API client');
		} else {
			console.log('Session token cleared from API client');
		}
	}
};