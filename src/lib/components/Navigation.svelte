<script lang="ts">
	import { page } from '$app/state';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Separator } from '$lib/components/ui/separator';
	import { siteConfig } from '$lib/config/site';
	import { FormInput, Home, Menu, Shield, SquareCode, Users } from '@lucide/svelte';
	import type { Component } from 'svelte';

	interface MenuItem {
		href: string;
		label: string;
		icon: Component;
	}

	const menuItems: MenuItem[] = [
		{ href: '/', label: 'Home', icon: Home },
		{ href: '/users', label: 'Users', icon: Users },
		{ href: '/forms', label: 'Forms', icon: FormInput },
		{ href: '/demo', label: 'Demo', icon: SquareCode },
		{ href: '/auth', label: 'Auth', icon: Shield }
	];

	let drawerOpen = $state(false);

	function isActive(path: string): boolean {
		return page.url.pathname === path;
	}

	function closeDrawer() {
		drawerOpen = false;
	}
</script>

<nav class="w-full border-b bg-background">
	<!-- Header Section -->
	<div class="flex items-center justify-between px-3 py-3 sm:px-6 sm:py-4">
		<!-- Logo -->
		<a
			href="/"
			class="flex items-center space-x-1 no-underline transition-all duration-200 hover:opacity-80 sm:space-x-2"
		>
			<div class="flex h-6 w-6 items-center justify-center rounded-md bg-primary sm:h-8 sm:w-8">
				<span class="text-xs font-bold text-primary-foreground sm:text-sm"
					>{siteConfig.siteName.charAt(0)}</span
				>
			</div>
			<span class="text-base font-semibold text-foreground sm:text-lg">{siteConfig.siteName}</span>
		</a>

		<!-- Mobile Menu Button & Theme Toggle -->
		<div class="flex items-center space-x-2">
			<ThemeToggle />
			<!-- Mobile Menu Button (only visible on mobile) -->
			<Button variant="ghost" size="sm" class="sm:hidden" onclick={() => (drawerOpen = true)}>
				<Menu class="h-4 w-4" />
			</Button>
		</div>
	</div>

	<!-- Separator -->
	<Separator />

	<!-- Desktop Navigation Menu (hidden on mobile) -->
	<div class="hidden items-center justify-center px-3 py-1 sm:flex sm:px-6 sm:py-2">
		<div class="flex items-center justify-center gap-1">
			{#each menuItems as item}
				<a
					href={item.href}
					class="flex items-center justify-center gap-1 rounded-sm border border-border bg-background px-3 py-1.5 text-xs text-foreground no-underline transition-all duration-200 hover:border-accent-foreground/20 hover:bg-accent hover:text-accent-foreground sm:text-sm md:px-4 md:py-2 {isActive(
						item.href
					)
						? 'border-primary bg-primary text-primary-foreground'
						: ''}"
				>
					<item.icon class="h-3 w-3 md:h-4 md:w-4" />
					<span>{item.label}</span>
				</a>
			{/each}
		</div>
	</div>

	<!-- Mobile Drawer -->
	<Drawer.Root bind:open={drawerOpen}>
		<Drawer.Content class="h-[70vh]">
			<div class="mx-auto flex h-full w-full max-w-sm flex-col">
				<Drawer.Header class="flex-shrink-0">
					<Drawer.Title>Navigation</Drawer.Title>
					<Drawer.Description>Choose a page to navigate to</Drawer.Description>
				</Drawer.Header>
				<div class="min-h-0 flex-1 overflow-y-auto px-4 pb-2">
					<div class="flex flex-col space-y-2">
						{#each menuItems as item}
							<a
								href={item.href}
								onclick={closeDrawer}
								class="flex items-center space-x-3 rounded-lg border border-border bg-background p-3 text-foreground no-underline transition-all duration-200 hover:bg-accent hover:text-accent-foreground {isActive(
									item.href
								)
									? 'border-primary bg-primary text-primary-foreground'
									: ''}"
							>
								<item.icon class="h-5 w-5" />
								<span class="font-medium">{item.label}</span>
							</a>
						{/each}
					</div>
				</div>
				<Drawer.Footer class="flex-shrink-0">
					<div class="w-full px-4 pt-6 pb-4">
						<Button variant="outline" onclick={closeDrawer} class="h-12 w-full text-base">
							Close
						</Button>
					</div>
				</Drawer.Footer>
			</div>
		</Drawer.Content>
	</Drawer.Root>
</nav>
