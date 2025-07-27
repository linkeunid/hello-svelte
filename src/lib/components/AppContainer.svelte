<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 min-h-screen flex flex-col">
	{@render children()}
</div>