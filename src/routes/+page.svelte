<script>
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import AppContainer from '$lib/components/AppContainer.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { Home, Shield, Zap, Heart } from '@lucide/svelte';
	import { siteConfig } from '$lib/config/site';
</script>

<PageTitle title="Welcome" subtitle={siteConfig.siteDescription} icon={Home} />

<AppContainer>
	{#snippet children()}
		<div class="flex flex-col items-center justify-center h-full zen-spacing">
			<div class="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
				<!-- Hero Section -->
				<div class="text-center space-y-6 sm:space-y-8 mb-12 sm:mb-16">
					<div class="space-y-4 sm:space-y-6">
						<div class="flex justify-center">
							<Badge variant="outline" class="zen-button text-xs sm:text-sm">
								<Heart class="w-3 h-3 mr-1" />
								{siteConfig.tagline}
							</Badge>
						</div>
						<h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-foreground tracking-tight px-2">
							Welcome to {siteConfig.siteName}
						</h1>
						<p class="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground zen-text max-w-4xl mx-auto px-4">
							{siteConfig.siteDescription}
						</p>
					</div>
				</div>

				<!-- Main Content Grid -->
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
					<!-- Primary Auth Card -->
					<div class="lg:col-span-2">
						<Card.Root class="zen-card h-full">
							<Card.Header class="text-center pb-3 sm:pb-4">
								<Card.Title class="text-xl sm:text-2xl lg:text-3xl font-light">{siteConfig.cta.primary}</Card.Title>
								<Card.Description class="text-sm sm:text-base zen-text">
									{siteConfig.brand.philosophy}
								</Card.Description>
							</Card.Header>
							<Card.Content class="space-y-6 sm:space-y-8">
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
									<Button 
										variant="default" 
										size="lg"
										class="zen-button h-12 sm:h-14 text-sm sm:text-base"
										href="/auth"
									>
										<Shield class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
										Auth Demo
									</Button>
									<Button 
										variant="outline" 
										size="lg"
										class="zen-button h-12 sm:h-14 text-sm sm:text-base"
										href="/users"
									>
										<Zap class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
										View Users
									</Button>
								</div>
								<Separator class="my-4 sm:my-6" />
								<div class="text-center space-y-3 sm:space-y-4">
									<p class="text-xs sm:text-sm text-muted-foreground zen-text px-2">
										{siteConfig.brand.toneOfVoice}
									</p>
									<div class="flex flex-wrap justify-center gap-1.5 sm:gap-2">
										{#each siteConfig.services.slice(0, 3) as service}
											<Badge variant="secondary" class="text-xs">{service}</Badge>
										{/each}
									</div>
								</div>
							</Card.Content>
						</Card.Root>
					</div>

					<!-- Feature Cards -->
					<div class="space-y-4 sm:space-y-6">
						<Card.Root class="zen-card">
							<Card.Header class="pb-2 sm:pb-3">
								<Card.Title class="text-base sm:text-lg flex items-center gap-2">
									<Shield class="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
									Security First
								</Card.Title>
							</Card.Header>
							<Card.Content>
								<p class="text-xs sm:text-sm text-muted-foreground zen-text">
									{siteConfig.values[0]}
								</p>
							</Card.Content>
						</Card.Root>

						<Card.Root class="zen-card">
							<Card.Header class="pb-2 sm:pb-3">
								<Card.Title class="text-base sm:text-lg flex items-center gap-2">
									<Zap class="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
									Lightning Fast
								</Card.Title>
							</Card.Header>
							<Card.Content>
								<p class="text-xs sm:text-sm text-muted-foreground zen-text">
									{siteConfig.values[1]}
								</p>
							</Card.Content>
						</Card.Root>

						<Card.Root class="zen-card">
							<Card.Header class="pb-2 sm:pb-3">
								<Card.Title class="text-base sm:text-lg flex items-center gap-2">
									<Heart class="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
									Thoughtful Design
								</Card.Title>
							</Card.Header>
							<Card.Content>
								<p class="text-xs sm:text-sm text-muted-foreground zen-text">
									{siteConfig.values[2]}
								</p>
							</Card.Content>
						</Card.Root>
					</div>
				</div>

				<!-- Footer Section -->
				<div class="text-center">
					<Separator class="mb-6 sm:mb-8" />
					<div class="space-y-3 sm:space-y-4">
						<p class="text-xs sm:text-sm text-muted-foreground/80 zen-text px-4">
							{siteConfig.mission[3]}
						</p>
						<div class="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs text-muted-foreground/60 px-4">
							{#each siteConfig.countries as country, i}
								<span>{country}</span>
								{#if i < siteConfig.countries.length - 1}
									<span>•</span>
								{/if}
							{/each}
							<span>•</span>
							<span>Founded {siteConfig.stats.founded.value}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/snippet}
</AppContainer>
