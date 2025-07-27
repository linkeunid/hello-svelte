<script lang="ts">
	import { page } from '$app/stores';
	import AppContainer from '$lib/components/AppContainer.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { AlertTriangle, ArrowLeft, Home, RefreshCw, Search } from '@lucide/svelte';

	const error = $derived($page.error);
	const status = $derived($page.status);

	const is404 = $derived(status === 404);
	const isServerError = $derived(status >= 500);

	const errorTitle = $derived(
		is404 ? 'Page Not Found' : isServerError ? 'Server Error' : 'Something Went Wrong'
	);

	const errorMessage = $derived(
		is404
			? "The page you're looking for doesn't exist or has been moved."
			: isServerError
				? 'Our servers are experiencing issues. Please try again later.'
				: 'An unexpected error occurred. Please try refreshing the page.'
	);

	function goBack() {
		if (typeof window !== 'undefined') {
			window.history.back();
		}
	}

	function refreshPage() {
		if (typeof window !== 'undefined') {
			window.location.reload();
		}
	}
</script>

<PageTitle title={errorTitle} subtitle={`Error ${status} - ${errorMessage}`} icon={AlertTriangle} />

<AppContainer>
	{#snippet children()}
		<div class="zen-spacing">
			<div class="zen-section space-y-6 sm:space-y-8">
				<!-- Error Display -->
				<div class="mb-8 space-y-4 px-4 text-center sm:mb-12 sm:space-y-6">
					<div class="flex justify-center">
						<div class="rounded-full bg-destructive/10 p-3 sm:p-4">
							<AlertTriangle class="h-12 w-12 text-destructive sm:h-14 sm:w-14 md:h-16 md:w-16" />
						</div>
					</div>

					<div class="space-y-2 sm:space-y-3">
						<Badge
							variant="outline"
							class="zen-button border-destructive/20 text-xs text-destructive sm:text-sm"
						>
							Error {status}
						</Badge>
						<h1
							class="px-2 text-2xl font-light tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
						>
							{errorTitle}
						</h1>
						<p
							class="zen-text mx-auto max-w-xl px-2 text-base text-muted-foreground sm:max-w-2xl sm:text-lg"
						>
							{errorMessage}
						</p>
					</div>
				</div>

				<!-- Error Details Card -->
				{#if error?.message}
					<Card.Root class="zen-card mx-auto max-w-full sm:max-w-xl lg:max-w-2xl">
						<Card.Header>
							<Card.Title class="text-base font-normal text-destructive sm:text-lg"
								>Error Details</Card.Title
							>
							<Card.Description class="zen-text text-sm">
								Additional error information
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<div
								class="overflow-x-auto rounded-lg bg-muted/30 p-3 font-mono text-xs sm:p-4 sm:text-sm"
							>
								<code class="break-words text-destructive">{error.message}</code>
							</div>
						</Card.Content>
					</Card.Root>
				{/if}

				<!-- Actions -->
				<div class="mx-auto max-w-full sm:max-w-md lg:max-w-lg">
					<Card.Root class="zen-card">
						<Card.Header class="text-center">
							<Card.Title class="text-lg font-normal sm:text-xl"
								>What would you like to do?</Card.Title
							>
							<Card.Description class="zen-text text-sm">
								Choose one of the options below to continue
							</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-3 sm:space-y-4">
							<div class="grid gap-2 sm:gap-3">
								<Button
									href="/"
									class="zen-button h-12 w-full justify-start text-sm sm:h-auto sm:text-base"
									variant="default"
								>
									<Home class="mr-2 h-4 w-4 flex-shrink-0" />
									<span>Go to Homepage</span>
								</Button>

								<Button
									onclick={goBack}
									class="zen-button h-12 w-full justify-start text-sm sm:h-auto sm:text-base"
									variant="outline"
								>
									<ArrowLeft class="mr-2 h-4 w-4 flex-shrink-0" />
									<span>Go Back</span>
								</Button>

								{#if is404}
									<Button
										href="/demo"
										class="zen-button h-12 w-full justify-start text-sm sm:h-auto sm:text-base"
										variant="outline"
									>
										<Search class="mr-2 h-4 w-4 flex-shrink-0" />
										<span>Explore Demos</span>
									</Button>
								{:else}
									<Button
										onclick={refreshPage}
										class="zen-button h-12 w-full justify-start text-sm sm:h-auto sm:text-base"
										variant="outline"
									>
										<RefreshCw class="mr-2 h-4 w-4 flex-shrink-0" />
										<span>Refresh Page</span>
									</Button>
								{/if}
							</div>
						</Card.Content>
					</Card.Root>
				</div>

				<!-- Helpful Links -->
				<div class="space-y-3 px-4 pt-6 text-center sm:space-y-4 sm:pt-8">
					<p class="zen-text text-sm text-muted-foreground sm:text-base">
						{#if is404}
							Looking for something specific? Check out our main sections:
						{:else}
							Need help? Contact our support team:
						{/if}
					</p>
					<div class="flex flex-col flex-wrap justify-center gap-2 sm:flex-row sm:gap-3 lg:gap-4">
						{#if is404}
							<Button href="/users" variant="ghost" class="zen-button w-full text-sm sm:w-auto">
								User Management
							</Button>
							<Button href="/forms" variant="ghost" class="zen-button w-full text-sm sm:w-auto">
								Form Examples
							</Button>
							<Button href="/auth" variant="ghost" class="zen-button w-full text-sm sm:w-auto">
								Authentication
							</Button>
						{:else}
							<Button
								href="mailto:hello@linkeun.com"
								variant="ghost"
								class="zen-button w-full text-sm sm:w-auto"
							>
								Email Support
							</Button>
							<Button
								href="https://github.com/linkeunid/hello-svelte/issues"
								variant="ghost"
								class="zen-button w-full text-sm sm:w-auto"
								target="_blank"
							>
								GitHub Issues
							</Button>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/snippet}
</AppContainer>
