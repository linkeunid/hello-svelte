<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import { siteConfig } from '$lib/config/site';

	interface Props {
		title: string;
		subtitle?: string;
		icon?: Component;
		actions?: Snippet;
	}

	let { title, subtitle, icon, actions }: Props = $props();

	const pageTitle = `${title} - ${siteConfig.siteName}`;
	const pageDescription = subtitle ?? siteConfig.siteDescription;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:type" content={siteConfig.siteType} />
	<meta property="og:url" content={siteConfig.siteUrl} />
	<meta name="keywords" content={siteConfig.siteKeywords.join(', ')} />
	<meta name="author" content={siteConfig.founder.name} />
	<meta property="og:locale" content={siteConfig.siteLocale} />
	<meta name="theme-color" content={siteConfig.themeColor} />
</svelte:head>

<div class="container mx-auto pt-6 sm:pt-8 lg:pt-10 pb-0 px-3 sm:px-4 md:px-6 lg:px-8">
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div class="min-w-0 flex-1">
			<div class="mb-1 sm:mb-2 flex items-center gap-2">
				{#if icon}
					{@const Component = icon}
					<Component class="h-5 w-5 sm:h-6 sm:w-6" />
				{/if}
				<h1 class="text-2xl sm:text-3xl font-bold tracking-tight truncate">{title}</h1>
			</div>
			{#if subtitle}
				<p class="text-sm sm:text-base text-muted-foreground">{subtitle}</p>
			{/if}
		</div>
		{#if actions}
			<div class="flex-shrink-0">
				{@render actions()}
			</div>
		{/if}
	</div>
</div>