<script lang="ts">
	import { fetchUsers, searchUsers } from '$lib/api/users';
	import AppContainer from '$lib/components/AppContainer.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import UsersTable from '$lib/components/UsersTable.svelte';
	import UsersTableSkeleton from '$lib/components/skeletons/UsersTableSkeleton.svelte';
	import StatsCardsSkeleton from '$lib/components/skeletons/StatsCardsSkeleton.svelte';
	import { Download, RefreshCw, Users } from '@lucide/svelte';
	import { createQuery } from '@tanstack/svelte-query';

	let currentPage = $state(0);
	let pageSize = $state(10);
	let searchQuery = $state('');

	const usersQuery = $derived.by(() =>
		createQuery({
			queryKey: ['users', currentPage, pageSize, searchQuery],
			queryFn: () => {
				if (searchQuery.trim()) {
					// Use search API when there's a search query
					return searchUsers(searchQuery.trim(), pageSize);
				} else {
					// Use regular fetch when no search
					return fetchUsers(pageSize, currentPage * pageSize);
				}
			}
		})
	);

	const users = $derived($usersQuery.data?.users ?? []);
	const isLoading = $derived($usersQuery.isPending);
	const isError = $derived($usersQuery.isError);
	const error = $derived($usersQuery.error);

	function handleRefresh() {
		$usersQuery.refetch();
	}

	function handlePageChange(page: number) {
		currentPage = page;
	}

	function handlePageSizeChange(newPageSize: number) {
		pageSize = newPageSize;
		currentPage = 0; // Reset to first page when changing page size
	}

	function handleSearch(query: string) {
		searchQuery = query;
		currentPage = 0; // Reset to first page when searching
	}

	function handleExport() {
		if (users.length === 0) return;

		const csvData = users.map((user) => ({
			name: `${user.firstName} ${user.lastName}`,
			email: user.email,
			age: user.age,
			gender: user.gender,
			company: user.company.name,
			location: `${user.address.city}, ${user.address.state}`
		}));

		const csv = [
			Object.keys(csvData[0]).join(','),
			...csvData.map((row) => Object.values(row).join(','))
		].join('\n');

		const blob = new Blob([csv], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'users.csv';
		a.click();
		window.URL.revokeObjectURL(url);
	}
</script>

<PageTitle title="Users" subtitle="Manage and view user data from DummyJSON API" icon={Users}>
	{#snippet actions()}
		<div class="flex items-center gap-1 sm:gap-2">
			<Button variant="outline" size="sm" onclick={handleRefresh} disabled={isLoading}>
				<RefreshCw class="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 {isLoading ? 'animate-spin' : ''}" />
				<span class="hidden sm:inline">Refresh</span>
			</Button>
			<Button variant="outline" size="sm" onclick={handleExport} disabled={users.length === 0}>
				<Download class="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
				<span class="hidden sm:inline">Export</span>
			</Button>
		</div>
	{/snippet}
</PageTitle>

<AppContainer>
	{#snippet children()}
		<div class="zen-spacing space-y-6">
			<!-- Stats Cards -->
			{#if isLoading}
				<StatsCardsSkeleton />
			{:else}
				<div class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
					<Card.Root>
						<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
							<Card.Title class="text-xs sm:text-sm font-medium">Total Users</Card.Title>
							<Users class="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-lg sm:text-2xl font-bold">
								{$usersQuery.data?.total ?? 0}
							</div>
						</Card.Content>
					</Card.Root>

					<Card.Root>
						<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
							<Card.Title class="text-xs sm:text-sm font-medium">Page</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="text-lg sm:text-2xl font-bold">
								{currentPage + 1}
							</div>
							<p class="text-xs text-muted-foreground hidden sm:block">
								Showing {users.length} users
							</p>
						</Card.Content>
					</Card.Root>

					<Card.Root>
						<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
							<Card.Title class="text-xs sm:text-sm font-medium">Status</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="flex items-center">
								{#if isLoading}
									<Badge variant="secondary" class="text-xs">Loading</Badge>
								{:else if isError}
									<Badge variant="destructive" class="text-xs">Error</Badge>
								{:else}
									<Badge variant="default" class="text-xs">Ready</Badge>
								{/if}
							</div>
						</Card.Content>
					</Card.Root>

					<Card.Root class="col-span-2 md:col-span-1">
						<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
							<Card.Title class="text-xs sm:text-sm font-medium">API Source</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="text-sm">
								<Badge variant="outline" class="text-xs">DummyJSON</Badge>
							</div>
							<p class="text-xs text-muted-foreground hidden sm:block">Real-time data</p>
						</Card.Content>
					</Card.Root>
				</div>
			{/if}

			<!-- Error State -->
			{#if isError}
				<Card.Root class="border-destructive">
					<Card.Header>
						<Card.Title class="text-destructive text-lg sm:text-xl">Error Loading Users</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground">
							{error?.message ?? 'An unknown error occurred'}
						</p>
						<Button onclick={handleRefresh} variant="outline" size="sm" class="w-full sm:w-auto">
							<RefreshCw class="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
							Try Again
						</Button>
					</Card.Content>
				</Card.Root>
			{:else if isLoading}
				<!-- Table Skeleton -->
				<Card.Root>
					<Card.Header>
						<Card.Title class="text-lg sm:text-xl">Users Table</Card.Title>
						<Card.Description class="text-xs sm:text-sm">
							Browse, filter, and manage users with advanced table controls
						</Card.Description>
					</Card.Header>
					<Card.Content class="px-3 sm:px-6">
						<UsersTableSkeleton rows={pageSize} />
					</Card.Content>
				</Card.Root>
			{:else}
				<!-- Users Table -->
				<Card.Root>
					<Card.Header>
						<Card.Title class="text-lg sm:text-xl">Users Table</Card.Title>
						<Card.Description class="text-xs sm:text-sm">
							Browse, filter, and manage users with advanced table controls
						</Card.Description>
					</Card.Header>
					<Card.Content class="px-3 sm:px-6">
						<UsersTable 
							{users} 
							total={$usersQuery.data?.total ?? 0} 
							loading={isLoading}
							currentPage={currentPage}
							pageSize={pageSize}
							onPageChange={handlePageChange}
							onPageSizeChange={handlePageSizeChange}
							onSearch={handleSearch}
						/>
					</Card.Content>
				</Card.Root>
			{/if}
		</div>
	{/snippet}
</AppContainer>
