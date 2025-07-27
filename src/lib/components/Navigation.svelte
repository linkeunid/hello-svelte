<script lang="ts">
	import { Separator } from "$lib/components/ui/separator";
	import * as Drawer from "$lib/components/ui/drawer";
	import { Button } from "$lib/components/ui/button";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";
	import { Home, Users, Menu, FormInput, Shield } from "@lucide/svelte";
	import { page } from "$app/state";
	import type { Component } from "svelte";
	import { siteConfig } from '$lib/config/site';

	interface MenuItem {
		href: string;
		label: string;
		icon: Component;
	}

	const menuItems: MenuItem[] = [
		{ href: "/", label: "Home", icon: Home },
		{ href: "/users", label: "Users", icon: Users },
		{ href: "/forms", label: "Forms", icon: FormInput },
		{ href: "/auth", label: "Auth", icon: Shield }
	];

	let drawerOpen = $state(false);

	function isActive(path: string): boolean {
		return page.url.pathname === path;
	}

	function closeDrawer() {
		drawerOpen = false;
	}
</script>

<nav class="w-full bg-background border-b">
	<!-- Header Section -->
	<div class="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
		<!-- Logo -->
		<div class="flex items-center space-x-1 sm:space-x-2">
			<div class="h-6 w-6 sm:h-8 sm:w-8 bg-primary rounded-md flex items-center justify-center">
				<span class="text-primary-foreground font-bold text-xs sm:text-sm">{siteConfig.siteName.charAt(0)}</span>
			</div>
			<span class="font-semibold text-base sm:text-lg">{siteConfig.siteName}</span>
		</div>

		<!-- Mobile Menu Button & Theme Toggle -->
		<div class="flex items-center space-x-2">
			<ThemeToggle />
			<!-- Mobile Menu Button (only visible on mobile) -->
			<Button
				variant="ghost"
				size="sm"
				class="sm:hidden"
				onclick={() => (drawerOpen = true)}
			>
				<Menu class="h-4 w-4" />
			</Button>
		</div>
	</div>

	<!-- Separator -->
	<Separator />

	<!-- Desktop Navigation Menu (hidden on mobile) -->
	<div class="hidden sm:flex justify-center items-center py-1 sm:py-2 px-3 sm:px-6">
		<div class="w-full max-w-xs md:max-w-sm lg:max-w-md">
			<div class="flex items-center w-full gap-1">
				{#each menuItems as item}
					<a
						href={item.href}
						class="flex-1 flex flex-row items-center justify-center gap-1 px-2 md:px-3 py-1 md:py-1.5 border border-border bg-background rounded-sm text-xs sm:text-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20 text-foreground no-underline {isActive(item.href) ? 'bg-primary text-primary-foreground border-primary' : ''}"
					>
						<item.icon class="h-3 w-3 md:h-4 md:w-4" />
						<span>{item.label}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>

	<!-- Mobile Drawer -->
	<Drawer.Root bind:open={drawerOpen}>
		<Drawer.Content class="max-h-[50vh]">
			<div class="mx-auto w-full max-w-sm">
				<Drawer.Header>
					<Drawer.Title>Navigation</Drawer.Title>
					<Drawer.Description>Choose a page to navigate to</Drawer.Description>
				</Drawer.Header>
				<div class="p-4 pb-0">
					<div class="flex flex-col space-y-2">
						{#each menuItems as item}
							<a
								href={item.href}
								onclick={closeDrawer}
								class="flex items-center space-x-3 p-3 rounded-lg border border-border bg-background transition-all duration-200 hover:bg-accent hover:text-accent-foreground text-foreground no-underline {isActive(item.href) ? 'bg-primary text-primary-foreground border-primary' : ''}"
							>
								<item.icon class="h-5 w-5" />
								<span class="font-medium">{item.label}</span>
							</a>
						{/each}
					</div>
				</div>
				<Drawer.Footer>
					<Button variant="outline" onclick={closeDrawer}>Close</Button>
				</Drawer.Footer>
			</div>
		</Drawer.Content>
	</Drawer.Root>
</nav>