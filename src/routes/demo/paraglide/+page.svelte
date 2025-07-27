<script lang="ts">
	import { browser } from '$app/environment';
	import AppContainer from '$lib/components/AppContainer.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { m } from '$lib/paraglide/messages.js';
	import { extractLocaleFromCookie, setLocale } from '$lib/paraglide/runtime';
	import { ArrowLeft, Code, ExternalLink, Globe, Languages } from '@lucide/svelte';

	// Detect current language from URL or default to 'en'
	let currentLanguage = $state(extractLocaleFromCookie() || 'en');

	// Update current language when page changes
	$effect(() => {
		if (browser) {
			const detectedLocale = extractLocaleFromCookie() || 'en';
			currentLanguage = detectedLocale;
		}
	});

	function handleSetLocale(locale: 'en' | 'id' | 'jp') {
		setLocale(locale);
		currentLanguage = locale;
	}
</script>

<PageTitle title="Paraglide i18n Demo" subtitle={m.demo_description()} icon={Globe} />

<AppContainer>
	{#snippet children()}
		<div class="zen-spacing">
			<div class="zen-section space-y-8">
				<!-- Demo Introduction -->
				<div class="mb-12 space-y-4 text-center">
					<Badge variant="outline" class="zen-button">
						<Languages class="mr-1 h-3 w-3" />
						{m.welcome()}
					</Badge>
					<h1 class="text-3xl font-light tracking-tight text-foreground sm:text-4xl">
						{m.hello_world({ name: 'SvelteKit User' })}
					</h1>
					<p class="zen-text mx-auto max-w-2xl text-lg text-muted-foreground">
						{m.demo_description()}
					</p>
					<div class="text-sm text-muted-foreground">
						{m.current_language()}
					</div>
				</div>

				<!-- Language Switcher Card -->
				<Card.Root class="zen-card mx-auto max-w-md">
					<Card.Header class="text-center">
						<Card.Title class="flex items-center justify-center gap-2 text-xl font-normal">
							<Languages class="h-5 w-5 text-primary" />
							{m.language_switcher()}
						</Card.Title>
						<Card.Description class="zen-text">
							{m.choose_language()}
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="grid grid-cols-3 gap-3">
							<Button
								onclick={() => handleSetLocale('en')}
								variant={currentLanguage === 'en' ? 'default' : 'outline'}
								class="zen-button flex h-auto flex-col items-center gap-2 py-4"
							>
								<span class="text-2xl">🇺🇸</span>
								<span class="text-sm font-normal">English</span>
							</Button>
							<Button
								onclick={() => handleSetLocale('id')}
								variant={currentLanguage === 'id' ? 'default' : 'outline'}
								class="zen-button flex h-auto flex-col items-center gap-2 py-4"
							>
								<span class="text-2xl">🇮🇩</span>
								<span class="text-sm font-normal">Indonesian</span>
							</Button>
							<Button
								onclick={() => handleSetLocale('jp')}
								variant={currentLanguage === 'jp' ? 'default' : 'outline'}
								class="zen-button flex h-auto flex-col items-center gap-2 py-4"
							>
								<span class="text-2xl">🇯🇵</span>
								<span class="text-sm font-normal">Japanese</span>
							</Button>
						</div>
					</Card.Content>
				</Card.Root>

				<Separator class="my-8" />

				<!-- Features Section -->
				<div class="grid gap-6 md:grid-cols-2">
					<!-- Type Safety -->
					<Card.Root class="zen-card">
						<Card.Header>
							<Card.Title class="flex items-center gap-2 text-lg font-normal">
								<Code class="h-5 w-5 text-primary" />
								{m.type_safety()}
							</Card.Title>
						</Card.Header>
						<Card.Content class="space-y-3">
							<p class="zen-text text-sm">
								{m.type_safety_desc()}
							</p>
							<div class="rounded-lg bg-muted/30 p-3 font-mono text-xs">
								<code>m.hello_world(&#123; name: string &#125;)</code>
							</div>
							<div class="flex gap-2">
								<Badge variant="secondary" class="text-xs">TypeScript</Badge>
								<Badge variant="secondary" class="text-xs">Compile-time</Badge>
								<Badge variant="secondary" class="text-xs">IntelliSense</Badge>
							</div>
						</Card.Content>
					</Card.Root>

					<!-- Developer Experience -->
					<Card.Root class="zen-card">
						<Card.Header>
							<Card.Title class="flex items-center gap-2 text-lg font-normal">
								<ExternalLink class="h-5 w-5 text-primary" />
								{m.vscode_integration()}
							</Card.Title>
						</Card.Header>
						<Card.Content class="space-y-3">
							<p class="zen-text text-sm">
								{m.vscode_integration_desc()}
							</p>
							<a
								href="https://marketplace.visualstudio.com/items?itemName=inlang.vs-code-extension"
								target="_blank"
								class="inline-flex items-center gap-2 text-sm text-primary hover:underline"
							>
								<ExternalLink class="h-4 w-4" />
								{m.install_extension()}
							</a>
							<div class="flex gap-2">
								<Badge variant="secondary" class="text-xs">VS Code</Badge>
								<Badge variant="secondary" class="text-xs">Autocomplete</Badge>
								<Badge variant="secondary" class="text-xs">Validation</Badge>
							</div>
						</Card.Content>
					</Card.Root>
				</div>

				<!-- Technical Details -->
				<Card.Root class="zen-card">
					<Card.Header class="text-center">
						<Card.Title class="text-xl font-normal">{m.how_it_works_title()}</Card.Title>
						<Card.Description class="zen-text">
							{m.how_it_works_subtitle()}
						</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-4">
						<div class="grid gap-4 text-center sm:grid-cols-3">
							<div class="space-y-2 text-center">
								<div
									class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
								>
									<span class="font-semibold text-primary">1</span>
								</div>
								<h4 class="font-medium">{m.step1()}</h4>
								<p class="zen-text text-sm text-muted-foreground">
									{m.step1_desc()}
								</p>
							</div>
							<div class="space-y-2 text-center">
								<div
									class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
								>
									<span class="font-semibold text-primary">2</span>
								</div>
								<h4 class="font-medium">{m.step2()}</h4>
								<p class="zen-text text-sm text-muted-foreground">
									{m.step2_desc()}
								</p>
							</div>
							<div class="space-y-2 text-center">
								<div
									class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
								>
									<span class="font-semibold text-primary">3</span>
								</div>
								<h4 class="font-medium">{m.step3()}</h4>
								<p class="zen-text text-sm text-muted-foreground">
									{m.step3_desc()}
								</p>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Statistics Demo -->
				<Card.Root class="zen-card">
					<Card.Header class="text-center">
						<Card.Title class="text-lg font-normal">Live Translation Statistics</Card.Title>
						<Card.Description class="zen-text">
							Demonstrating parameterized messages and date formatting
						</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-4">
						<div class="grid gap-4 text-center sm:grid-cols-3">
							<div class="space-y-2">
								<div class="text-2xl font-light text-primary">25</div>
								<p class="text-sm text-muted-foreground">
									{m.messages_count({ count: '25' })}
								</p>
							</div>
							<div class="space-y-2">
								<div class="text-2xl font-light text-primary">100%</div>
								<p class="text-sm text-muted-foreground">
									{m.language_coverage({ percentage: '100' })}
								</p>
							</div>
							<div class="space-y-2">
								<div class="text-2xl font-light text-primary">Today</div>
								<p class="text-sm text-muted-foreground">
									{m.last_updated({ date: new Date().toLocaleDateString() })}
								</p>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Navigation -->
				<div class="space-y-4 pt-8 text-center">
					<p class="zen-text text-muted-foreground">
						{m.footer_text()}
					</p>
					<Button href="/demo" variant="ghost" class="zen-button">
						<ArrowLeft class="mr-2 h-4 w-4" />
						{m.back_to_demos()}
					</Button>
				</div>
			</div>
		</div>
	{/snippet}
</AppContainer>
