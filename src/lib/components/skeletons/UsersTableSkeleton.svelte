<script lang="ts">
	import { Skeleton } from "$lib/components/ui/skeleton";
	import * as Table from "$lib/components/ui/table";

	interface Props {
		rows?: number;
	}

	let { rows = 10 }: Props = $props();
</script>

<div class="w-full space-y-4">
	<!-- Search and controls skeleton -->
	<div class="flex items-center justify-between">
		<div class="flex flex-1 items-center space-x-2">
			<Skeleton class="h-9 w-72" />
		</div>
		<Skeleton class="h-9 w-24" />
	</div>

	<!-- Table skeleton -->
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<!-- Column headers skeleton -->
					<Table.Head><Skeleton class="h-4 w-16" /></Table.Head>
					<Table.Head><Skeleton class="h-4 w-20" /></Table.Head>
					<Table.Head><Skeleton class="h-4 w-32" /></Table.Head>
					<Table.Head><Skeleton class="h-4 w-12" /></Table.Head>
					<Table.Head><Skeleton class="h-4 w-16" /></Table.Head>
					<Table.Head><Skeleton class="h-4 w-20" /></Table.Head>
					<Table.Head><Skeleton class="h-4 w-24" /></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each Array(rows) as _}
					<Table.Row>
						<!-- Avatar cell -->
						<Table.Cell>
							<Skeleton class="h-8 w-8 rounded-full" />
						</Table.Cell>
						<!-- Name cell -->
						<Table.Cell>
							<div class="space-y-1">
								<Skeleton class="h-4 w-24" />
								<Skeleton class="h-3 w-16" />
							</div>
						</Table.Cell>
						<!-- Email cell -->
						<Table.Cell>
							<Skeleton class="h-4 w-32" />
						</Table.Cell>
						<!-- Age cell -->
						<Table.Cell>
							<Skeleton class="h-4 w-8" />
						</Table.Cell>
						<!-- Gender cell -->
						<Table.Cell>
							<Skeleton class="h-5 w-12 rounded-full" />
						</Table.Cell>
						<!-- Company cell -->
						<Table.Cell>
							<div class="space-y-1">
								<Skeleton class="h-4 w-20" />
								<Skeleton class="h-3 w-16" />
							</div>
						</Table.Cell>
						<!-- Location cell -->
						<Table.Cell>
							<div class="space-y-1">
								<Skeleton class="h-4 w-24" />
								<Skeleton class="h-3 w-16" />
							</div>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<!-- Pagination skeleton -->
	<div class="flex items-center justify-between space-x-2 pt-4">
		<div class="text-muted-foreground flex-1 text-sm">
			<Skeleton class="h-4 w-32" />
		</div>
		<div class="flex items-center space-x-6 lg:space-x-8">
			<div class="flex items-center space-x-2">
				<Skeleton class="h-4 w-20" />
				<Skeleton class="h-8 w-16" />
			</div>
			<div class="flex w-[100px] items-center justify-center">
				<Skeleton class="h-4 w-20" />
			</div>
			<div class="flex items-center space-x-2">
				<Skeleton class="h-8 w-8" />
				<Skeleton class="h-8 w-8" />
				<Skeleton class="h-8 w-8" />
				<Skeleton class="h-8 w-8" />
			</div>
		</div>
	</div>
</div>