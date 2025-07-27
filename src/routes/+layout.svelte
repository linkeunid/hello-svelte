<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { ModeWatcher } from "mode-watcher";
	import { QueryClient } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { PersistQueryClientProvider } from '@tanstack/svelte-query-persist-client';
	import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
	import Navigation from '$lib/components/Navigation.svelte';
	import { siteConfig } from '$lib/config/site';
	
	let { children } = $props();

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				staleTime: 5 * 60 * 1000, // 5 minutes
				refetchOnWindowFocus: false
			},
		},
	});

	const persister = createAsyncStoragePersister({
		storage: browser ? window.localStorage : null,
	});
</script>

<svelte:head>
	<!-- Global Meta Tags -->
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="language" content={siteConfig.siteLanguage} />
	<meta name="robots" content="index, follow" />
	
	<!-- Favicon and Icons -->
	<link rel="icon" href={siteConfig.favicon} />
	<link rel="apple-touch-icon" href={siteConfig.appleTouchIcon} />
	<link rel="manifest" href={siteConfig.manifest} />
	
	<!-- Theme Colors -->
	<meta name="theme-color" content={siteConfig.themeColor} />
	<meta name="msapplication-navbutton-color" content={siteConfig.themeColor} />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	
	<!-- Open Graph Global -->
	<meta property="og:site_name" content={siteConfig.siteName} />
	<meta property="og:locale" content={siteConfig.siteLocale} />
	
	<!-- Company Information -->
	<meta name="author" content={siteConfig.founder.name} />
	<meta name="copyright" content={siteConfig.company.legalName} />
	<meta name="generator" content="SvelteKit" />
</svelte:head>

<ModeWatcher />
<PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
	<div class="min-h-screen bg-background">
		<Navigation />
		<main>
			{@render children?.()}
		</main>
	</div>
	<SvelteQueryDevtools />
</PersistQueryClientProvider>
