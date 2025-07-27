<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Eye, EyeOff, Loader2, LogIn, CheckCircle } from '@lucide/svelte';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';

	interface Props {
		onLoginSuccess?: () => void;
	}

	let { onLoginSuccess }: Props = $props();

	// Get session from page data to check if user is already logged in
	const session = $derived($page.data.session);

	let credentials = $state({
		username: 'emilys', // Default for DummyJSON testing
		password: 'emilyspass' // Default for DummyJSON testing
	});

	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let success = $state<string | null>(null);
	let showPassword = $state(false);

	async function handleLogin() {
		// Prevent login if user is already authenticated
		if (session?.user) {
			error = 'You are already logged in.';
			return;
		}

		isLoading = true;
		error = null;
		success = null;

		try {
			const result = await signIn('credentials', {
				username: credentials.username,
				password: credentials.password,
				redirect: false
			});

			if (result?.error) {
				error = 'Invalid credentials. Please check your username and password.';
			} else {
				success = 'Successfully signed in! Redirecting...';
				
				// Invalidate all data to refresh the session
				await invalidateAll();

				// Call the callback if provided
				if (onLoginSuccess) {
					onLoginSuccess();
				}
			}
		} catch (err: any) {
			error = err.message || 'Login failed';
			console.error('Login error details:', err);
		} finally {
			isLoading = false;
		}
	}

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}
</script>

<Card.Root class="mx-auto w-full max-w-md">
	<Card.Header class="text-center">
		<Card.Title class="text-2xl font-semibold">
			{session?.user ? 'Already Logged In' : 'Login Demo'}
		</Card.Title>
		<Card.Description>
			{session?.user ? 'You are already authenticated' : 'Test SvelteKit Auth authentication'}
		</Card.Description>
	</Card.Header>

	<Card.Content class="space-y-4">
		{#if session?.user}
			<!-- Show logged-in state -->
			<div class="text-center py-6">
				<CheckCircle class="mx-auto h-16 w-16 text-green-500 mb-4" />
				<h3 class="text-lg font-semibold mb-2">Welcome back, {session.user.name}!</h3>
				<p class="text-sm text-muted-foreground mb-4">You are already signed in.</p>
				<div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
					<p class="text-xs text-green-700 dark:text-green-300">
						💡 <strong>Note:</strong> You cannot login again while already authenticated. This prevents API abuse.
					</p>
				</div>
			</div>
		{:else}
			<!-- Show login form when not logged in -->
		<div class="space-y-2">
			<Label for="username">Username</Label>
			<Input
				id="username"
				type="text"
				bind:value={credentials.username}
				placeholder="Enter username"
				disabled={isLoading}
			/>
		</div>

		<div class="space-y-2">
			<Label for="password">Password</Label>
			<div class="relative">
				<Input
					id="password"
					type={showPassword ? 'text' : 'password'}
					bind:value={credentials.password}
					placeholder="Enter password"
					disabled={isLoading}
					class="pr-10"
				/>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					class="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent hover:text-muted-foreground"
					onclick={togglePasswordVisibility}
					disabled={isLoading}
				>
					{#if showPassword}
						<EyeOff class="h-4 w-4" />
					{:else}
						<Eye class="h-4 w-4" />
					{/if}
				</Button>
			</div>
		</div>

		{#if error}
			<div class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
				{error}
			</div>
		{/if}

		{#if success}
			<div
				class="rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400"
			>
				{success}
			</div>
		{/if}

		<Button
			onclick={handleLogin}
			disabled={isLoading || !credentials.username || !credentials.password || !!session?.user}
			class="w-full"
		>
			{#if isLoading}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				Signing in...
			{:else}
				<LogIn class="mr-2 h-4 w-4" />
				Sign In
			{/if}
		</Button>

		<div class="space-y-1 text-center text-xs text-muted-foreground">
			<p>Demo credentials for DummyJSON API:</p>
			<p><strong>Username:</strong> emilys</p>
			<p><strong>Password:</strong> emilyspass</p>
		</div>
		{/if}
	</Card.Content>
</Card.Root>
