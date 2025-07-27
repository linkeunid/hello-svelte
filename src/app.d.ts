// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import { DefaultSession } from '@auth/core/types'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth(): Promise<{
				user?: {
					id: string
					email?: string | null
					name?: string | null
					image?: string | null
				} & DefaultSession['user']
				accessToken?: string
			} | null>
		}
		interface PageData {
			session: {
				user?: {
					id: string
					email?: string | null
					name?: string | null
					image?: string | null
				} & DefaultSession['user']
				accessToken?: string
			} | null
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
