<script lang="ts">
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import {
		createSvelteTable,
		FlexRender,
		renderComponent
	} from "$lib/components/ui/data-table/index.js";
	import type {
		ColumnDef,
		ColumnFiltersState,
		PaginationState,
		SortingState,
		VisibilityState
	} from "@tanstack/table-core";
	import {
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel
	} from "@tanstack/table-core";
	import * as Table from "$lib/components/ui/table/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import type { User } from "$lib/api/users";
	import AvatarCell from "$lib/components/users/AvatarCell.svelte";
	import NameCell from "$lib/components/users/NameCell.svelte";
	import EmailCell from "$lib/components/users/EmailCell.svelte";
	import GenderCell from "$lib/components/users/GenderCell.svelte";
	import CompanyCell from "$lib/components/users/CompanyCell.svelte";
	import LocationCell from "$lib/components/users/LocationCell.svelte";

	interface Props {
		users: User[];
		total?: number;
		loading?: boolean;
		currentPage?: number;
		pageSize?: number;
		onPageChange?: (page: number) => void;
		onPageSizeChange?: (pageSize: number) => void;
		onSearch?: (query: string) => void;
	}

	let { users, total = 0, loading = false, currentPage = 0, pageSize = 10, onPageChange, onPageSizeChange, onSearch }: Props = $props();

	const columns: ColumnDef<User>[] = [
		{
			accessorKey: "image",
			header: "Avatar",
			cell: ({ row }) => {
				const user = row.original;
				return renderComponent(AvatarCell, {
					image: row.getValue("image") as string,
					firstName: user.firstName,
					lastName: user.lastName
				});
			},
			enableSorting: false
		},
		{
			accessorKey: "firstName",
			header: "Name",
			cell: ({ row }) => {
				const user = row.original;
				return renderComponent(NameCell, {
					firstName: user.firstName,
					lastName: user.lastName,
					username: user.username
				});
			}
		},
		{
			accessorKey: "email",
			header: "Email",
			cell: ({ row }) =>
				renderComponent(EmailCell, {
					email: row.getValue("email") as string
				})
		},
		{
			accessorKey: "age",
			header: "Age",
			cell: ({ row }) => row.getValue("age") as number
		},
		{
			accessorKey: "gender",
			header: "Gender",
			cell: ({ row }) =>
				renderComponent(GenderCell, {
					gender: row.getValue("gender") as string
				})
		},
		{
			accessorKey: "company",
			header: "Company",
			cell: ({ row }) =>
				renderComponent(CompanyCell, {
					company: row.getValue("company") as any
				})
		},
		{
			accessorKey: "address",
			header: "Location",
			cell: ({ row }) =>
				renderComponent(LocationCell, {
					address: row.getValue("address") as any
				})
		}
	];

	let pagination = $state<PaginationState>({ pageIndex: currentPage, pageSize: pageSize });

	// Sync pagination state with props
	$effect(() => {
		pagination = { pageIndex: currentPage, pageSize: pageSize };
	});
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});
	let searchValue = $state('');

	// Calculate total pages based on total users and page size
	const totalPages = $derived(Math.ceil(total / pagination.pageSize));

	const table = $derived(
		createSvelteTable({
			get data() {
				return users;
			},
			columns,
			manualPagination: true,
			pageCount: totalPages,
			getCoreRowModel: getCoreRowModel(),
			getSortedRowModel: getSortedRowModel(),
			getPaginationRowModel: getPaginationRowModel(),
			state: {
				get pagination() {
					return pagination;
				},
				get sorting() {
					return sorting;
				},
				get columnVisibility() {
					return columnVisibility;
				},
				get columnFilters() {
					return columnFilters;
				}
			},
			onPaginationChange: (updater) => {
				if (typeof updater === "function") {
					pagination = updater(pagination);
				} else {
					pagination = updater;
				}
				onPageChange?.(pagination.pageIndex);
			},
			onSortingChange: (updater) => {
				if (typeof updater === "function") {
					sorting = updater(sorting);
				} else {
					sorting = updater;
				}
			},
			onColumnFiltersChange: (updater) => {
				if (typeof updater === "function") {
					columnFilters = updater(columnFilters);
				} else {
					columnFilters = updater;
				}
			},
			onColumnVisibilityChange: (updater) => {
				if (typeof updater === "function") {
					columnVisibility = updater(columnVisibility);
				} else {
					columnVisibility = updater;
				}
			}
		})
	);

	// Debounced search to avoid too many API calls
	let searchTimeout: ReturnType<typeof setTimeout> | undefined;
	
	const handleSearchChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		searchValue = target.value;
		
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}
		
		searchTimeout = setTimeout(() => {
			onSearch?.(searchValue);
		}, 300); // 300ms debounce
	};
</script>

<div class="w-full space-y-4">
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
		<div class="flex flex-1 items-center space-x-2">
			<Input
				placeholder="Search users..."
				bind:value={searchValue}
				oninput={handleSearchChange}
				class="w-full sm:max-w-sm"
			/>
		</div>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="outline" class="w-full sm:w-auto sm:ml-auto">
						<span class="sm:hidden">Columns</span>
						<span class="hidden sm:inline">Columns</span>
						<ChevronDownIcon class="ml-2 size-4" />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				{#each table
					.getAllColumns()
					.filter((col) => col.getCanHide()) as column (column)}
					<DropdownMenu.CheckboxItem
						class="capitalize"
						bind:checked={
							() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)
						}
					>
						{column.id}
					</DropdownMenu.CheckboxItem>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<div class="rounded-md border overflow-hidden">
		<div class="overflow-x-auto">
			<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head 
								class="cursor-pointer select-none"
								onclick={header.column.getToggleSortingHandler()}
							>
								{#if !header.isPlaceholder}
									<div class="flex items-center gap-2">
										<FlexRender 
											content={header.column.columnDef.header}
											context={header.getContext()}
										/>
										{#if header.column.getIsSorted() === 'asc'}
											🔼
										{:else if header.column.getIsSorted() === 'desc'}
											🔽
										{/if}
									</div>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#if loading}
					{#each Array(10) as _}
						<Table.Row>
							{#each columns as _}
								<Table.Cell>
									<div class="h-4 bg-muted animate-pulse rounded"></div>
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{:else}
					{#each table.getRowModel().rows as row (row.id)}
						<Table.Row>
							{#each row.getVisibleCells() as cell (cell.id)}
								<Table.Cell>
									<FlexRender 
										content={cell.column.columnDef.cell}
										context={cell.getContext()}
									/>
								</Table.Cell>
							{/each}
						</Table.Row>
					{:else}
						<Table.Row>
							<Table.Cell colspan={columns.length} class="h-24 text-center">
								No users found.
							</Table.Cell>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
		</div>
	</div>

	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pt-4">
		<div class="text-muted-foreground text-xs sm:text-sm">
			{users.length} user(s) found of {total} total.
		</div>
		<div class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6">
			<div class="flex items-center justify-between sm:justify-start space-x-2">
				<p class="text-xs sm:text-sm font-medium">Rows per page</p>
				<select
					class="h-8 w-[60px] sm:w-[70px] rounded border border-input bg-background px-1 sm:px-2 text-xs sm:text-sm"
					value={table.getState().pagination.pageSize}
					onchange={(e) => {
						const newSize = Number(e.currentTarget.value);
						table.setPageSize(newSize);
						onPageSizeChange?.(newSize);
					}}
				>
					{#each [10, 20, 30, 40, 50] as pageSize}
						<option value={pageSize}>{pageSize}</option>
					{/each}
				</select>
			</div>
			<div class="flex items-center justify-center text-xs sm:text-sm font-medium">
				Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
			</div>
			<div class="flex items-center justify-center space-x-1 sm:space-x-2">
				<Button
					variant="outline"
					class="hidden h-8 w-8 p-0 lg:flex"
					onclick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					<span class="sr-only">Go to first page</span>
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="m11 17-5-5 5-5"></path>
						<path d="m18 17-5-5 5-5"></path>
					</svg>
				</Button>
				<Button
					variant="outline"
					class="h-7 w-7 sm:h-8 sm:w-8 p-0"
					onclick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<span class="sr-only">Go to previous page</span>
					<svg class="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="m15 18-6-6 6-6"></path>
					</svg>
				</Button>
				<Button
					variant="outline"
					class="h-7 w-7 sm:h-8 sm:w-8 p-0"
					onclick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<span class="sr-only">Go to next page</span>
					<svg class="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="m9 18 6-6-6-6"></path>
					</svg>
				</Button>
				<Button
					variant="outline"
					class="hidden h-8 w-8 p-0 lg:flex"
					onclick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					<span class="sr-only">Go to last page</span>
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="m6 17 5-5-5-5"></path>
						<path d="m13 17 5-5-5-5"></path>
					</svg>
				</Button>
			</div>
		</div>
	</div>
</div>