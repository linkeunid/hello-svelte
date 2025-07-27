<script lang="ts">
	import AppContainer from '$lib/components/AppContainer.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { AlertTriangle, Code2, Globe, Palette, Zap } from '@lucide/svelte';
</script>

<PageTitle
	title="Demo"
	subtitle="Explore interactive demonstrations of key features and capabilities"
	icon={Code2}
/>

<AppContainer>
	{#snippet children()}
		<div class="zen-spacing">
			<div class="zen-section space-y-8">
				<!-- Welcome Section -->
				<div class="mb-12 space-y-4 text-center">
					<Badge variant="outline" class="zen-button">
						<Zap class="mr-1 h-3 w-3" />
						Interactive Demos
					</Badge>
					<h1 class="text-3xl font-light tracking-tight text-foreground sm:text-4xl md:text-5xl">
						Feature Demonstrations
					</h1>
					<p class="zen-text mx-auto max-w-2xl text-lg text-muted-foreground">
						Discover the power and elegance of our implementation through hands-on demonstrations
					</p>
				</div>

				<!-- Demo Cards Grid -->
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<!-- Internationalization Demo -->
					<Card.Root class="zen-card group transition-shadow duration-300 hover:shadow-md">
						<Card.Header class="space-y-2">
							<div class="flex items-center gap-2">
								<Globe class="h-5 w-5 text-primary" />
								<Card.Title class="text-lg font-normal">Paraglide i18n</Card.Title>
							</div>
							<Card.Description class="zen-text">
								Experience seamless internationalization with Paraglide. Switch between languages
								and see how content adapts in real-time.
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="space-y-3">
								<div class="flex gap-2">
									<Badge variant="secondary" class="text-xs">English</Badge>
									<Badge variant="secondary" class="text-xs">Indonesian</Badge>
									<Badge variant="secondary" class="text-xs">Japanese</Badge>
								</div>
								<p class="text-sm text-muted-foreground">
									Type-safe translations with VS Code integration
								</p>
							</div>
						</Card.Content>
						<Card.Footer>
							<Button
								href="/demo/paraglide"
								variant="outline"
								class="zen-button w-full group-hover:bg-primary group-hover:text-primary-foreground"
							>
								Try Paraglide Demo
							</Button>
						</Card.Footer>
					</Card.Root>

					<!-- Error Handling Demo -->
					<Card.Root class="zen-card group transition-shadow duration-300 hover:shadow-md">
						<Card.Header class="space-y-2">
							<div class="flex items-center gap-2">
								<AlertTriangle class="h-5 w-5 text-primary" />
								<Card.Title class="text-lg font-normal">Error Handling</Card.Title>
							</div>
							<Card.Description class="zen-text">
								Demonstrate custom error messages and see how our elegant error page handles
								different error scenarios with helpful user guidance.
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="space-y-3">
								<div class="flex flex-wrap gap-2">
									<Badge variant="secondary" class="text-xs">404 Errors</Badge>
									<Badge variant="secondary" class="text-xs">Custom UI</Badge>
									<Badge variant="secondary" class="text-xs">Examples</Badge>
								</div>
								<p class="text-sm text-muted-foreground">
									Interactive error triggers with detailed examples
								</p>
							</div>
						</Card.Content>
						<Card.Footer>
							<Button
								href="/demo/error"
								variant="outline"
								class="zen-button w-full group-hover:bg-primary group-hover:text-primary-foreground"
							>
								Try Error Demo
							</Button>
						</Card.Footer>
					</Card.Root>

					<!-- Theme Demo Card -->
					<Card.Root class="zen-card group transition-shadow duration-300 hover:shadow-md">
						<Card.Header class="space-y-2">
							<div class="flex items-center gap-2">
								<Palette class="h-5 w-5 text-primary" />
								<Card.Title class="text-lg font-normal">Theme System</Card.Title>
							</div>
							<Card.Description class="zen-text">
								Our zen minimalist design system with light and dark mode support, creating
								harmonious user experiences.
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="space-y-3">
								<div class="flex gap-2">
									<Badge variant="secondary" class="text-xs">Light Mode</Badge>
									<Badge variant="secondary" class="text-xs">Dark Mode</Badge>
								</div>
								<p class="text-sm text-muted-foreground">Toggle themes anywhere in the app</p>
							</div>
						</Card.Content>
						<Card.Footer>
							<Button variant="outline" class="zen-button w-full" disabled>Coming Soon</Button>
						</Card.Footer>
					</Card.Root>

					<!-- More Demos Placeholder -->
					<Card.Root class="zen-card group transition-shadow duration-300 hover:shadow-md">
						<Card.Header class="space-y-2">
							<div class="flex items-center gap-2">
								<Code2 class="h-5 w-5 text-primary" />
								<Card.Title class="text-lg font-normal">More Demos</Card.Title>
							</div>
							<Card.Description class="zen-text">
								Additional demonstrations will be added here as new features are developed and
								refined.
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="space-y-3">
								<div class="flex gap-2">
									<Badge variant="outline" class="text-xs">Forms</Badge>
									<Badge variant="outline" class="text-xs">API</Badge>
									<Badge variant="outline" class="text-xs">UI</Badge>
								</div>
								<p class="text-sm text-muted-foreground">Stay tuned for more interactive demos</p>
							</div>
						</Card.Content>
						<Card.Footer>
							<Button variant="outline" class="zen-button w-full" disabled>Coming Soon</Button>
						</Card.Footer>
					</Card.Root>
				</div>

				<!-- Call to Action -->
				<div class="space-y-4 pt-8 text-center">
					<p class="zen-text text-muted-foreground">
						These demonstrations showcase real implementations you can explore and learn from
					</p>
					<Button href="/" variant="ghost" class="zen-button">← Return to Home</Button>
				</div>
			</div>
		</div>
	{/snippet}
</AppContainer>
