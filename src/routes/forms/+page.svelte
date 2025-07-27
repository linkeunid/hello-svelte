<script lang="ts">
	import AppContainer from '$lib/components/AppContainer.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { FormInput } from '@lucide/svelte';
	import FormsComponent from './forms-component.svelte';
</script>

<PageTitle
	title="Forms"
	subtitle="Advanced form components with validation using Superforms and Zod"
	icon={FormInput}
/>

<AppContainer>
	{#snippet children()}
		<div class="zen-spacing mx-auto max-w-4xl px-3 sm:px-4">
			<div class="rounded-lg border bg-card p-4 sm:p-6 text-card-foreground shadow-sm">
				<div class="mb-4 sm:mb-6 space-y-1.5">
					<h3 class="text-xl sm:text-2xl leading-none font-semibold tracking-tight">User Registration Form</h3>
					<p class="text-xs sm:text-sm text-muted-foreground">
						Complete the form below with all required information. All fields are validated on both
						client and server side.
					</p>
				</div>
				<FormsComponent />
			</div>
		</div>
	{/snippet}
</AppContainer>
