<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { cn } from '$lib/utils.js';
	import {
		CalendarDate,
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		type DateValue
	} from '@internationalized/date';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import type { DateRange } from 'bits-ui';
	import { tick } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { schema, type FormSchema } from './schema';

	// Date formatter for birth date
	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	// Date formatter for date range
	const rangeDf = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});

	const defaultValues = {
		name: '',
		email: '',
		age: 0,
		country: '',
		role: 'student' as const,
		bio: '',
		birthDate: '',
		projectDuration: { start: '', end: '' },
		newsletter: false,
		interests: [] as string[],
		terms: false
	} satisfies FormSchema;

	const form = superForm(defaultValues, {
		validators: zod4(schema),
		dataType: 'json',
		resetForm: false,
		validationMethod: 'onblur',
		onSubmit: ({ formData }) => {
			console.log(formData, 'formData');
			invalidateAll();
		}
	});

	const { form: formData, enhance, errors, submitting, message } = form;

	// Calendar state for birth date
	let birthDateValue = $state<DateValue | undefined>();
	let birthDateContentRef = $state<HTMLElement | null>(null);

	// Year and month selection for easy navigation
	let selectedYear = $state<string>('');
	let selectedMonth = $state<string>('');

	// Generate year options (from 1924 to current year)
	const currentYear = new Date().getFullYear();
	const yearOptions = Array.from({ length: 100 }, (_, i) => {
		const year = currentYear - i;
		return { value: year.toString(), label: year.toString() };
	});

	// Month options
	const monthOptions = [
		{ value: '1', label: 'January' },
		{ value: '2', label: 'February' },
		{ value: '3', label: 'March' },
		{ value: '4', label: 'April' },
		{ value: '5', label: 'May' },
		{ value: '6', label: 'June' },
		{ value: '7', label: 'July' },
		{ value: '8', label: 'August' },
		{ value: '9', label: 'September' },
		{ value: '10', label: 'October' },
		{ value: '11', label: 'November' },
		{ value: '12', label: 'December' }
	];

	// Update calendar when year/month selection changes
	$effect(() => {
		if (selectedYear && selectedMonth) {
			try {
				// Create a date with selected year and month (day 1)
				const newDate = parseDate(`${selectedYear}-${selectedMonth.padStart(2, '0')}-01`);
				birthDateValue = newDate;
			} catch {
				// Invalid date, ignore
			}
		}
	});

	// Sync calendar value with form data
	$effect(() => {
		if (birthDateValue) {
			$formData.birthDate = birthDateValue.toString();
		}
	});

	// Parse initial date if exists and update year/month selectors
	$effect(() => {
		if ($formData.birthDate && !birthDateValue) {
			try {
				birthDateValue = parseDate($formData.birthDate);
			} catch {
				// Invalid date format, ignore
			}
		}

		// Update year/month selectors based on current date value
		if (birthDateValue) {
			selectedYear = birthDateValue.year.toString();
			selectedMonth = birthDateValue.month.toString();
		}
	});

	// Date range picker state
	let dateRangeValue = $state<DateRange>({
		start: undefined,
		end: undefined
	});
	let dateRangeStartValue = $state<DateValue | undefined>(undefined);

	// Calculate min date (3 months ago)
	const today = new Date();
	const threeMonthsAgo = new Date();
	threeMonthsAgo.setMonth(today.getMonth() - 3);
	const minDate = new CalendarDate(
		threeMonthsAgo.getFullYear(),
		threeMonthsAgo.getMonth() + 1,
		threeMonthsAgo.getDate()
	);

	// Sync date range with form data
	$effect(() => {
		if (dateRangeValue?.start && dateRangeValue?.end) {
			$formData.projectDuration = {
				start: dateRangeValue.start.toString(),
				end: dateRangeValue.end.toString()
			};
		}
	});

	const countries = [
		{ value: 'us', label: 'United States' },
		{ value: 'ca', label: 'Canada' },
		{ value: 'uk', label: 'United Kingdom' },
		{ value: 'de', label: 'Germany' },
		{ value: 'fr', label: 'France' },
		{ value: 'jp', label: 'Japan' },
		{ value: 'au', label: 'Australia' }
	];

	const interestOptions = [
		'Technology',
		'Sports',
		'Music',
		'Travel',
		'Reading',
		'Gaming',
		'Art',
		'Cooking'
	];

	function handleInterestChange(interest: string, checked: boolean) {
		if (checked) {
			$formData.interests = [...($formData.interests || []), interest];
		} else {
			$formData.interests = ($formData.interests || []).filter((i: string) => i !== interest);
		}
	}

	// Combobox state for country selection
	let countryOpen = $state(false);
	let countryTriggerRef = $state<HTMLButtonElement>(null!);

	const selectedCountryLabel = $derived(
		countries.find((c) => c.value === $formData.country)?.label
	);

	function closeCountryAndFocusTrigger() {
		countryOpen = false;
		tick().then(() => {
			countryTriggerRef.focus();
		});
	}
</script>

<form method="POST" use:enhance class="mx-auto max-w-2xl space-y-4 sm:space-y-6">
	<!-- Name -->
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="text-sm sm:text-base">Full Name</Form.Label>
				<Input {...props} bind:value={$formData.name} placeholder="Enter your full name" class="text-sm sm:text-base" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<!-- Email -->
	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="text-sm sm:text-base">Email Address</Form.Label>
				<Input {...props} type="email" bind:value={$formData.email} placeholder="your@email.com" class="text-sm sm:text-base" />
			{/snippet}
		</Form.Control>
		<Form.Description class="text-xs sm:text-sm">We'll never share your email with anyone else.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<div class="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
		<!-- Age -->
		<Form.Field {form} name="age">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label class="text-sm sm:text-base">Age</Form.Label>
					<Input {...props} type="number" bind:value={$formData.age} min="18" max="120" class="text-sm sm:text-base" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<!-- Country Combobox -->
		<Form.Field {form} name="country">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label class="text-sm sm:text-base">Country</Form.Label>
					<Popover.Root bind:open={countryOpen}>
						<Popover.Trigger bind:ref={countryTriggerRef}>
							{#snippet child({ props: triggerProps })}
								<Button
									variant="outline"
									class="w-full justify-between text-sm sm:text-base"
									{...triggerProps}
									{...props}
									role="combobox"
									aria-expanded={countryOpen}
								>
									{selectedCountryLabel || 'Select a country...'}
									<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="w-full p-0">
							<Command.Root>
								<Command.Input placeholder="Search country..." class="text-sm" />
								<Command.List>
									<Command.Empty>No country found.</Command.Empty>
									<Command.Group>
										{#each countries as country}
											<Command.Item
												value={country.value}
												onSelect={() => {
													$formData.country = country.value;
													closeCountryAndFocusTrigger();
												}}
											>
												<CheckIcon
													class={cn(
														'mr-2 size-4',
														$formData.country !== country.value && 'text-transparent'
													)}
												/>
												{country.label}
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.List>
							</Command.Root>
						</Popover.Content>
					</Popover.Root>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<!-- Role Radio Group -->
	<Form.Field {form} name="role">
		<Form.Control>
			{#snippet children()}
				<Form.Label class="text-sm sm:text-base">Role</Form.Label>
				<RadioGroup.Root bind:value={$formData.role} class="flex flex-wrap gap-3 sm:gap-4">
					<label class="flex cursor-pointer items-center space-x-2">
						<RadioGroup.Item value="student" id="student" />
						<span class="text-xs sm:text-sm font-medium">Student</span>
					</label>
					<label class="flex cursor-pointer items-center space-x-2">
						<RadioGroup.Item value="professional" id="professional" />
						<span class="text-xs sm:text-sm font-medium">Professional</span>
					</label>
					<label class="flex cursor-pointer items-center space-x-2">
						<RadioGroup.Item value="freelancer" id="freelancer" />
						<span class="text-xs sm:text-sm font-medium">Freelancer</span>
					</label>
					<label class="flex cursor-pointer items-center space-x-2">
						<RadioGroup.Item value="other" id="other" />
						<span class="text-xs sm:text-sm font-medium">Other</span>
					</label>
				</RadioGroup.Root>
			{/snippet}
		</Form.Control>
		<Form.Description class="text-xs sm:text-sm">Select your current professional status.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<!-- Bio Textarea -->
	<Form.Field {form} name="bio">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="text-sm sm:text-base">Bio</Form.Label>
				<Textarea
					{...props}
					bind:value={$formData.bio}
					placeholder="Tell us about yourself..."
					class="min-h-[80px] text-sm sm:text-base"
				/>
			{/snippet}
		</Form.Control>
		<Form.Description class="text-xs sm:text-sm">Write a short bio about yourself (minimum 10 characters).</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<!-- Birth Date Calendar Picker -->
	<Form.Field {form} name="birthDate">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="text-sm sm:text-base">Birth Date</Form.Label>
				<Popover.Root>
					<Popover.Trigger
						{...props}
						class={cn(
							buttonVariants({
								variant: 'outline',
								class: 'w-full justify-start text-left font-normal text-sm sm:text-base'
							}),
							!birthDateValue && 'text-muted-foreground'
						)}
					>
						<CalendarIcon class="mr-2 size-4" />
						{birthDateValue
							? df.format(birthDateValue.toDate(getLocalTimeZone()))
							: 'Pick your birth date'}
					</Popover.Trigger>
					<Popover.Content bind:ref={birthDateContentRef} class="w-auto p-0 max-w-[calc(100vw-2rem)]">
						<div class="border-b p-2 sm:p-3">
							<div class="mb-2 sm:mb-3 grid grid-cols-2 gap-2">
								<div class="space-y-1">
									<Label class="text-xs font-medium">Year</Label>
									<Select.Root type="single" bind:value={selectedYear}>
										<Select.Trigger class="h-7 sm:h-8 text-xs">
											{selectedYear
												? yearOptions.find((y) => y.value === selectedYear)?.label
												: 'Year'}
										</Select.Trigger>
										<Select.Content class="max-h-48">
											{#each yearOptions as year}
												<Select.Item value={year.value}>{year.label}</Select.Item>
											{/each}
										</Select.Content>
									</Select.Root>
								</div>
								<div class="space-y-1">
									<Label class="text-xs font-medium">Month</Label>
									<Select.Root type="single" bind:value={selectedMonth}>
										<Select.Trigger class="h-7 sm:h-8 text-xs">
											{selectedMonth
												? monthOptions.find((m) => m.value === selectedMonth)?.label
												: 'Month'}
										</Select.Trigger>
										<Select.Content>
											{#each monthOptions as month}
												<Select.Item value={month.value}>{month.label}</Select.Item>
											{/each}
										</Select.Content>
									</Select.Root>
								</div>
							</div>
						</div>
						<Calendar type="single" bind:value={birthDateValue} />
					</Popover.Content>
				</Popover.Root>
			{/snippet}
		</Form.Control>
		<Form.Description class="text-xs sm:text-sm">Select your birth date using the calendar picker.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<!-- Project Duration Range Picker -->
	<Form.Field {form} name="projectDuration">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="text-sm sm:text-base">Project Duration (Optional)</Form.Label>
				<Popover.Root>
					<Popover.Trigger
						{...props}
						class={cn(
							buttonVariants({ variant: 'outline' }),
						'text-sm sm:text-base',
							!dateRangeValue?.start && 'text-muted-foreground'
						)}
					>
						<CalendarIcon class="mr-2 size-4" />
						{#if dateRangeValue?.start}
							{#if dateRangeValue?.end}
								{rangeDf.format(dateRangeValue.start.toDate(getLocalTimeZone()))} - {rangeDf.format(
									dateRangeValue.end.toDate(getLocalTimeZone())
								)}
							{:else}
								{rangeDf.format(dateRangeValue.start.toDate(getLocalTimeZone()))}
							{/if}
						{:else if dateRangeStartValue}
							{rangeDf.format(dateRangeStartValue.toDate(getLocalTimeZone()))}
						{:else}
							Pick a date
						{/if}
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0 max-w-[calc(100vw-1rem)]" align="start">
						<RangeCalendar
							bind:value={dateRangeValue}
							onStartValueChange={(v) => {
								dateRangeStartValue = v;
							}}
							numberOfMonths={typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 2}
							minValue={minDate}
						/>
					</Popover.Content>
				</Popover.Root>
			{/snippet}
		</Form.Control>
		<Form.Description class="text-xs sm:text-sm">Select the start and end dates for your project timeline.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<!-- Newsletter Switch -->
	<Form.Field {form} name="newsletter">
		<Form.Control>
			{#snippet children()}
				<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
					<div class="space-y-0.5">
						<Form.Label class="text-sm sm:text-base">Newsletter Subscription</Form.Label>
						<Form.Description class="text-xs sm:text-sm">Receive updates about new features and content.</Form.Description>
					</div>
					<Switch bind:checked={$formData.newsletter} />
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<!-- Interests Checkboxes -->
	<Form.Field {form} name="interests">
		<Form.Control>
			{#snippet children()}
				<Form.Label class="text-sm sm:text-base">Interests</Form.Label>
				<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
					{#each interestOptions as interest}
						<label class="flex cursor-pointer items-center space-x-2">
							<Checkbox
								checked={$formData.interests?.includes(interest) || false}
								onCheckedChange={(checked) => handleInterestChange(interest, checked)}
							/>
							<span class="text-xs sm:text-sm">{interest}</span>
						</label>
					{/each}
				</div>
			{/snippet}
		</Form.Control>
		<Form.Description class="text-xs sm:text-sm">Select your areas of interest.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<!-- Terms Checkbox -->
	<Form.Field {form} name="terms">
		<Form.Control>
			{#snippet children({ props })}
				<div class="flex items-start space-x-2">
					<Checkbox {...props} bind:checked={$formData.terms} class="mt-0.5" />
					<Form.Label class="text-xs sm:text-sm leading-relaxed">I accept the terms and conditions</Form.Label>
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<!-- Success Message -->
	{#if $message}
		<div class="flex items-center gap-2 rounded-md bg-primary/10 p-2 sm:p-3 text-primary">
			<span class="text-xs sm:text-sm">{$message}</span>
		</div>
	{/if}

	<!-- Global Form Errors -->
	{#if $errors._errors}
		<div class="flex items-center gap-2 rounded-md bg-destructive/10 p-2 sm:p-3 text-destructive">
			<span class="text-xs sm:text-sm">{$errors._errors}</span>
		</div>
	{/if}

	<!-- Submit Button -->
	<div class="flex justify-end pt-3 sm:pt-4">
		<Form.Button class="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3" disabled={$submitting}>
			{#if $submitting}
				Submitting...
			{:else}
				Submit Application
			{/if}
		</Form.Button>
	</div>
</form>

<!-- Debug: Form Data Display -->
<div class="mt-6 sm:mt-8 rounded-lg border bg-muted/50 p-3 sm:p-4">
	<h3 class="mb-2 sm:mb-3 text-base sm:text-lg font-semibold">Current Form Data</h3>
	<pre class="overflow-auto rounded bg-background p-2 sm:p-3 text-xs sm:text-sm"><code
			>{JSON.stringify($formData, null, 2)}</code
		></pre>
</div>
