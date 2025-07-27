<script lang="ts">
	import { Skeleton } from "$lib/components/ui/skeleton";
	import * as Card from "$lib/components/ui/card";
</script>

<div class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
	{#each Array(3) as _}
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
				<Skeleton class="h-3 sm:h-4 w-16 sm:w-20" />
				<Skeleton class="h-3 w-3 sm:h-4 sm:w-4" />
			</Card.Header>
			<Card.Content>
				<Skeleton class="h-6 sm:h-8 w-8 sm:w-12 mb-1" />
				<Skeleton class="h-3 w-16 sm:w-24 hidden sm:block" />
			</Card.Content>
		</Card.Root>
	{/each}
	<Card.Root class="col-span-2 md:col-span-1">
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
			<Skeleton class="h-3 sm:h-4 w-16 sm:w-20" />
		</Card.Header>
		<Card.Content>
			<Skeleton class="h-4 w-16 mb-1" />
			<Skeleton class="h-3 w-20 hidden sm:block" />
		</Card.Content>
	</Card.Root>
</div>