import { SvelteKitAuth } from '@auth/sveltekit'
import Credentials from '@auth/sveltekit/providers/credentials'
import { z } from 'zod'
import { env } from '$env/dynamic/private'
import { apiClient } from '$lib/api/client'

// Login schema for validation
const loginSchema = z.object({
	username: z.string().min(1),
	password: z.string().min(1)
})

// Auth.js configuration
const authConfig = {
	providers: [
		Credentials({
			name: 'credentials',
			credentials: {
				username: { label: 'Username', type: 'text' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				try {
					console.log('Auth.js authorize called with credentials:', { username: credentials?.username, hasPassword: !!credentials?.password })
					
					// Validate input
					const validatedCredentials = loginSchema.parse(credentials)
					console.log('Credentials validated successfully')
					
					// Call backend API for authentication
					console.log('Making API call to /auth/login...')
					const response = await apiClient.post('/auth/login', {
						username: validatedCredentials.username,
						password: validatedCredentials.password
					})

					console.log('API response status:', response.status)
					console.log('API response data:', response.data)

					// DummyJSON returns user data directly at root level, not nested under 'user'
					if (response.data?.accessToken && response.data?.id) {
						const user = {
							id: response.data.id.toString(),
							email: response.data.email,
							name: `${response.data.firstName} ${response.data.lastName}`,
							image: response.data.image,
							accessToken: response.data.accessToken
						}
						console.log('Returning user object:', user)
						return user
					}

					console.log('No accessToken or user in response, returning null')
					return null
				} catch (error) {
					console.error('Authentication error:', error)
					if (error instanceof Error) {
						console.error('Error message:', error.message)
						console.error('Error stack:', error.stack)
					}
					return null
				}
			}
		})
	],
	
	session: {
		strategy: 'jwt' as const,
		maxAge: 24 * 60 * 60 // 24 hours
	},
	
	callbacks: {
		async jwt({ token, user }: { token: any; user: any }) {
			// Persist the access token to the token
			if (user) {
				token.accessToken = user.accessToken
				token.id = user.id
			}
			return token
		},
		
		async session({ session, token }: { session: any; token: any }) {
			// Send properties to the client
			if (token) {
				session.user.id = token.id as string
				session.accessToken = token.accessToken as string
			}
			return session
		}
	},
	
	pages: {
		signIn: '/auth'
	},
	
	secret: env.AUTH_SECRET,
	trustHost: true
}

export const { handle, signIn, signOut } = SvelteKitAuth(authConfig)