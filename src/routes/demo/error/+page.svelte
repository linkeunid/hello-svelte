<script lang="ts">
	import AppContainer from '$lib/components/AppContainer.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { AlertTriangle, ArrowLeft, Bug, ExternalLink, Zap } from '@lucide/svelte';
</script>

<PageTitle
	title="Error Handling Demo"
	subtitle="Demonstrate custom error messages and error page functionality"
	icon={AlertTriangle}
/>

<AppContainer>
	{#snippet children()}
		<div class="zen-spacing">
			<div class="zen-section space-y-6 sm:space-y-8">
				<!-- Welcome Section -->
				<div class="mb-8 space-y-4 px-4 text-center sm:mb-12 sm:space-y-6">
					<Badge variant="outline" class="zen-button">
						<Bug class="mr-1 h-3 w-3" />
						Error Testing
					</Badge>
					<h1 class="text-3xl font-light tracking-tight text-foreground sm:text-4xl md:text-5xl">
						Custom Error Messages
					</h1>
					<p class="zen-text mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
						Test different error scenarios and see how our custom error page handles them with
						appropriate messages and user guidance.
					</p>
				</div>

				<!-- Error Types Grid -->
				<div class="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
					<!-- 404 Error -->
					<Card.Root class="zen-card group transition-shadow duration-300 hover:shadow-md">
						<Card.Header class="space-y-2">
							<div class="flex items-center gap-2">
								<div class="rounded-lg bg-orange-500/10 p-2">
									<AlertTriangle class="h-4 w-4 text-orange-500" />
								</div>
								<Card.Title class="text-lg font-normal">404 Not Found</Card.Title>
							</div>
							<Card.Description class="zen-text text-sm">
								Demonstrates a custom "Page Not Found" error with helpful navigation options.
							</Card.Description>
						</Card.Header>
						<Card.Footer>
							<Button href="/demo/error/404" variant="outline" class="zen-button w-full">
								Trigger 404 Error
							</Button>
						</Card.Footer>
					</Card.Root>

					<!-- 500 Error -->
					<Card.Root class="zen-card group transition-shadow duration-300 hover:shadow-md">
						<Card.Header class="space-y-2">
							<div class="flex items-center gap-2">
								<div class="rounded-lg bg-red-500/10 p-2">
									<AlertTriangle class="h-4 w-4 text-red-500" />
								</div>
								<Card.Title class="text-lg font-normal">500 Server Error</Card.Title>
							</div>
							<Card.Description class="zen-text text-sm">
								Shows how server errors are handled with appropriate user messaging and support
								options.
							</Card.Description>
						</Card.Header>
						<Card.Footer>
							<Button href="/demo/error/500" variant="outline" class="zen-button w-full">
								Trigger 500 Error
							</Button>
						</Card.Footer>
					</Card.Root>

					<!-- 403 Error -->
					<Card.Root class="zen-card group transition-shadow duration-300 hover:shadow-md">
						<Card.Header class="space-y-2">
							<div class="flex items-center gap-2">
								<div class="rounded-lg bg-yellow-500/10 p-2">
									<AlertTriangle class="h-4 w-4 text-yellow-600" />
								</div>
								<Card.Title class="text-lg font-normal">403 Forbidden</Card.Title>
							</div>
							<Card.Description class="zen-text text-sm">
								Demonstrates access control errors with clear explanations and next steps.
							</Card.Description>
						</Card.Header>
						<Card.Footer>
							<Button href="/demo/error/403" variant="outline" class="zen-button w-full">
								Trigger 403 Error
							</Button>
						</Card.Footer>
					</Card.Root>

					<!-- Custom 418 Error -->
					<Card.Root class="zen-card group transition-shadow duration-300 hover:shadow-md">
						<Card.Header class="space-y-2">
							<div class="flex items-center gap-2">
								<div class="rounded-lg bg-purple-500/10 p-2">
									<Zap class="h-4 w-4 text-purple-500" />
								</div>
								<Card.Title class="text-lg font-normal">418 I'm a Teapot</Card.Title>
							</div>
							<Card.Description class="zen-text text-sm">
								A humorous HTTP status code to show how custom error codes are handled.
							</Card.Description>
						</Card.Header>
						<Card.Footer>
							<Button href="/demo/error/418" variant="outline" class="zen-button w-full">
								Trigger Custom Error
							</Button>
						</Card.Footer>
					</Card.Root>

					<!-- Validation Error -->
					<Card.Root class="zen-card group transition-shadow duration-300 hover:shadow-md">
						<Card.Header class="space-y-2">
							<div class="flex items-center gap-2">
								<div class="rounded-lg bg-blue-500/10 p-2">
									<ExternalLink class="h-4 w-4 text-blue-500" />
								</div>
								<Card.Title class="text-lg font-normal">422 Validation Error</Card.Title>
							</div>
							<Card.Description class="zen-text text-sm">
								Shows how complex validation errors with multiple fields are displayed.
							</Card.Description>
						</Card.Header>
						<Card.Footer>
							<Button href="/demo/error/422" variant="outline" class="zen-button w-full">
								Trigger Validation Error
							</Button>
						</Card.Footer>
					</Card.Root>

					<!-- Network Error -->
					<Card.Root class="zen-card group transition-shadow duration-300 hover:shadow-md">
						<Card.Header class="space-y-2">
							<div class="flex items-center gap-2">
								<div class="rounded-lg bg-gray-500/10 p-2">
									<AlertTriangle class="h-4 w-4 text-gray-600" />
								</div>
								<Card.Title class="text-lg font-normal">503 Service Unavailable</Card.Title>
							</div>
							<Card.Description class="zen-text text-sm">
								Demonstrates service outage errors with helpful timing information.
							</Card.Description>
						</Card.Header>
						<Card.Footer>
							<Button href="/demo/error/503" variant="outline" class="zen-button w-full">
								Trigger Network Error
							</Button>
						</Card.Footer>
					</Card.Root>
				</div>

				<!-- How It Works -->
				<Card.Root class="zen-card">
					<Card.Header class="text-center">
						<Card.Title class="text-xl font-normal">How Custom Error Messages Work</Card.Title>
						<Card.Description class="zen-text">
							Understanding the error handling flow in our application
						</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-4">
						<div class="grid gap-4 sm:grid-cols-3">
							<div class="space-y-2 text-center">
								<div
									class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
								>
									<span class="font-semibold text-primary">1</span>
								</div>
								<h4 class="text-sm font-medium">Navigate to Route</h4>
								<p class="zen-text text-xs text-muted-foreground">
									Click button to navigate to a route with a server load function
								</p>
							</div>
							<div class="space-y-2 text-center">
								<div
									class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
								>
									<span class="font-semibold text-primary">2</span>
								</div>
								<h4 class="text-sm font-medium">Server Throws Error</h4>
								<p class="zen-text text-xs text-muted-foreground">
									Server load function throws error() with custom status and message
								</p>
							</div>
							<div class="space-y-2 text-center">
								<div
									class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
								>
									<span class="font-semibold text-primary">3</span>
								</div>
								<h4 class="text-sm font-medium">Show Error Page</h4>
								<p class="zen-text text-xs text-muted-foreground">
									SvelteKit renders +error.svelte with custom message and actions
								</p>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Code Example -->
				<Card.Root class="zen-card">
					<Card.Header>
						<Card.Title class="text-lg font-normal">Code Example</Card.Title>
						<Card.Description class="zen-text">
							How to trigger custom errors in your SvelteKit application
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="overflow-x-auto rounded-lg bg-muted/30 p-4 font-mono text-sm">
							<code class="text-foreground">
								{`// In +page.server.ts
import { error } from '@sveltejs/kit';

export function load() {
  throw error(404, {
    message: 'Custom error message with helpful details for the user.'
  });
}`}
							</code>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Navigation -->
				<div class="space-y-4 pt-6 text-center sm:pt-8">
					<p class="zen-text text-sm text-muted-foreground">
						Try the error triggers above to see our custom error page in action
					</p>
					<Button href="/demo" variant="ghost" class="zen-button">
						<ArrowLeft class="mr-2 h-4 w-4" />
						Back to Demos
					</Button>
				</div>
			</div>
		</div>
	{/snippet}
</AppContainer>
