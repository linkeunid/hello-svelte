<script lang="ts">
	import AppContainer from '$lib/components/AppContainer.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import ApiConfigPanel from '$lib/components/ApiConfigPanel.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { getCurrentUser } from '$lib/api/users';
	import { signOut } from '@auth/sveltekit/client';
	import { Shield, User, LogOut, RefreshCw, Key } from '@lucide/svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { syncSessionToken } from '$lib/stores/session';

	let isRefreshing = $state(false);

	// Get session from page data
	const session = $derived($page.data.session);

	// Query to get current user (only when session exists)
	const userQuery = $derived.by(() => {
		if (!session?.accessToken) return null;
		
		return createQuery({
			queryKey: ['current-user'],
			queryFn: getCurrentUser,
			enabled: !!session?.accessToken
		});
	});

	async function handleLogout() {
		await signOut({ callbackUrl: '/auth' });
	}

	async function handleRefreshPage() {
		isRefreshing = true;
		
		try {
			// Invalidate all data to refresh the session
			await invalidateAll();
			
			// Force refresh the user query if session exists
			if (session?.accessToken && userQuery) {
				$userQuery?.refetch();
			}
		} finally {
			isRefreshing = false;
		}
	}

	// Sync session token with API client whenever session changes
	$effect(() => {
		syncSessionToken(session);
	});
</script>

<PageTitle 
	title="Authentication Demo" 
	subtitle="SvelteKit Auth session management with automatic authorization headers"
	icon={Shield}
/>

<AppContainer>
	{#snippet children()}
		<div class="zen-spacing space-y-6 md:space-y-8">
			<div class="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
				<!-- Login Form -->
				<div class="space-y-4 md:space-y-6">
					<h2 class="text-xl sm:text-2xl font-semibold">Login</h2>
					<LoginForm onLoginSuccess={handleRefreshPage} />
					
					{#if !session?.user}
						<div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 md:p-4">
							<p class="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
								💡 <strong>Tip:</strong> After logging in, the page will automatically refresh to show your user profile from the <code>/auth/me</code> endpoint.
							</p>
						</div>
					{/if}
					
					<div class="flex flex-wrap gap-1.5 sm:gap-2">
						<Button variant="outline" size="sm" onclick={handleRefreshPage} disabled={isRefreshing} class="text-xs sm:text-sm">
							<RefreshCw class="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 {isRefreshing ? 'animate-spin' : ''}" />
							<span class="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh Page'}</span>
							<span class="sm:hidden">{isRefreshing ? 'Refresh...' : 'Refresh'}</span>
						</Button>
						
						{#if session?.user}
							<Button variant="outline" size="sm" onclick={handleLogout} class="text-xs sm:text-sm">
								<LogOut class="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
								<span class="hidden sm:inline">Logout</span>
								<span class="sm:hidden">Logout</span>
							</Button>
						{/if}
					</div>
				</div>

				<!-- Session Information -->
				<div class="space-y-4 md:space-y-6">
					<h2 class="text-xl sm:text-2xl font-semibold">Session Status</h2>
					
					<Card.Root>
						<Card.Header>
							<Card.Title class="flex items-center gap-2 text-base sm:text-lg">
								<Key class="h-4 w-4 sm:h-5 sm:w-5" />
								Auth Session Information
							</Card.Title>
						</Card.Header>
						<Card.Content class="space-y-3 sm:space-y-4">
							{#if session?.user}
								<div class="space-y-3">
									<div class="flex flex-col sm:flex-row sm:items-center gap-2">
										<Badge variant="default" class="text-xs">Active</Badge>
										<span class="text-xs sm:text-sm text-muted-foreground">Session Status</span>
									</div>
									
									<div class="space-y-2 text-xs sm:text-sm">
										<div class="break-words"><strong>User ID:</strong> {session.user.id}</div>
										<div class="break-words"><strong>Name:</strong> {session.user.name || 'N/A'}</div>
										<div class="break-words"><strong>Email:</strong> {session.user.email || 'N/A'}</div>
									</div>
									
									{#if session?.accessToken}
										<details class="text-xs">
											<summary class="cursor-pointer text-muted-foreground hover:text-foreground">
												View Access Token
											</summary>
											<pre class="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto whitespace-pre-wrap break-all">{session.accessToken}</pre>
										</details>
									{/if}
								</div>
							{:else}
								<div class="text-center py-3 sm:py-4">
									<p class="text-sm sm:text-base text-muted-foreground">No active session</p>
									<p class="text-xs sm:text-sm text-muted-foreground mt-1">Login to create a session</p>
								</div>
							{/if}
						</Card.Content>
					</Card.Root>

					<!-- User Profile -->
					{#if session?.accessToken}
						<Card.Root>
							<Card.Header>
								<Card.Title class="flex items-center gap-2 text-base sm:text-lg">
									<User class="h-4 w-4 sm:h-5 sm:w-5" />
									User Profile (Protected Route)
								</Card.Title>
							</Card.Header>
							<Card.Content>
								{#if $userQuery?.isPending}
									<div class="text-center py-3 sm:py-4">
										<div class="animate-spin h-5 w-5 sm:h-6 sm:w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
										<p class="text-xs sm:text-sm text-muted-foreground mt-2">Loading profile...</p>
									</div>
								{:else if $userQuery?.isError}
									<div class="text-center py-3 sm:py-4">
										<div class="bg-destructive/10 text-destructive rounded-md p-3 text-xs sm:text-sm">
											{$userQuery.error?.message || 'Failed to load profile'}
										</div>
									</div>
								{:else if $userQuery?.data}
									<div class="space-y-3 sm:space-y-4">
										<div class="flex flex-col sm:flex-row sm:items-center gap-3">
											<img 
												src={$userQuery.data.image} 
												alt="Profile" 
												class="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover mx-auto sm:mx-0"
											/>
											<div class="text-center sm:text-left">
												<h3 class="font-semibold text-sm sm:text-base">
													{$userQuery.data.firstName} {$userQuery.data.lastName}
												</h3>
												<p class="text-xs sm:text-sm text-muted-foreground break-words">{$userQuery.data.email}</p>
												<p class="text-xs text-muted-foreground">@{$userQuery.data.username}</p>
											</div>
										</div>
										
										<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
											<div class="break-words">
												<span class="text-muted-foreground">Age:</span> {$userQuery.data.age}
											</div>
											<div class="break-words">
												<span class="text-muted-foreground">Gender:</span> {$userQuery.data.gender}
											</div>
											<div class="sm:col-span-2 break-words">
												<span class="text-muted-foreground">Company:</span> {$userQuery.data.company.name}
											</div>
										</div>
									</div>
								{/if}
							</Card.Content>
						</Card.Root>
					{/if}
				</div>
			</div>

			<!-- API Configuration Panel -->
			<ApiConfigPanel />

			<!-- API Usage Examples -->
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-lg sm:text-xl">How It Works</Card.Title>
				</Card.Header>
				<Card.Content class="space-y-4 sm:space-y-6">
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
						<div class="space-y-2">
							<h4 class="font-semibold text-sm sm:text-base">🔐 Automatic Authorization</h4>
							<p class="text-xs sm:text-sm text-muted-foreground">
								All API requests automatically include the JWT token in the Authorization header when session is active.
							</p>
						</div>
						
						<div class="space-y-2">
							<h4 class="font-semibold text-sm sm:text-base">🔄 Session Management</h4>
							<p class="text-xs sm:text-sm text-muted-foreground">
								Sessions are managed server-side with secure HTTP-only cookies. Automatic session validation and renewal.
							</p>
						</div>
						
						<div class="space-y-2">
							<h4 class="font-semibold text-sm sm:text-base">🚫 Error Handling</h4>
							<p class="text-xs sm:text-sm text-muted-foreground">
								401 responses automatically trigger session cleanup and can redirect to login page.
							</p>
						</div>
						
						<div class="space-y-2">
							<h4 class="font-semibold text-sm sm:text-base">⚙️ Configurable Client</h4>
							<p class="text-xs sm:text-sm text-muted-foreground">
								API client can be reconfigured at runtime for different environments or endpoints.
							</p>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	{/snippet}
</AppContainer>