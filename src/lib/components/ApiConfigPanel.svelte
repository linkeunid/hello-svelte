<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Badge } from '$lib/components/ui/badge';
	import { reconfigureApiClient, getCurrentApiConfig } from '$lib/api/client';
	import { apiPresets, applyPreset, type ApiConfig } from '$lib/config/api';
	import { Settings, CheckCircle, AlertCircle, RefreshCw } from '@lucide/svelte';

	let currentConfig = $state<ApiConfig>(getCurrentApiConfig());
	let isApplying = $state(false);
	let selectedPreset = $state<string>('dummyjson');
	let success = $state<string | null>(null);
	let error = $state<string | null>(null);

	function handleApplyConfig() {
		isApplying = true;
		success = null;
		error = null;

		try {
			reconfigureApiClient(currentConfig);
			success = `API client configured with baseURL: ${currentConfig.baseURL}`;
		} catch (err: any) {
			error = err.message || 'Failed to apply configuration';
		} finally {
			isApplying = false;
		}
	}

	function handleApplyPreset() {
		isApplying = true;
		success = null;
		error = null;

		try {
			const presetConfig = apiPresets[selectedPreset as keyof typeof apiPresets];
			currentConfig = { ...presetConfig };
			reconfigureApiClient(presetConfig);
			success = `Applied ${selectedPreset} preset configuration`;
		} catch (err: any) {
			error = err.message || 'Failed to apply preset';
		} finally {
			isApplying = false;
		}
	}

	function resetToDefault() {
		currentConfig = getCurrentApiConfig();
		success = null;
		error = null;
	}

	// Auto-clear messages after 3 seconds
	$effect(() => {
		if (success || error) {
			const timer = setTimeout(() => {
				success = null;
				error = null;
			}, 3000);
			return () => clearTimeout(timer);
		}
	});
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="flex items-center gap-2 text-lg sm:text-xl">
			<Settings class="h-4 w-4 sm:h-5 sm:w-5" />
			API Configuration
		</Card.Title>
		<Card.Description class="text-xs sm:text-sm">
			Configure the axios client settings for different environments or APIs
		</Card.Description>
	</Card.Header>
	
	<Card.Content class="space-y-4 sm:space-y-6">
		<!-- Preset Selection -->
		<div class="space-y-3">
			<Label class="text-xs sm:text-sm font-medium">Quick Presets</Label>
			<div class="flex flex-wrap gap-1.5 sm:gap-2">
				{#each Object.keys(apiPresets) as preset}
					<Button
						variant={selectedPreset === preset ? "default" : "outline"}
						size="sm"
						onclick={() => { selectedPreset = preset; }}
						disabled={isApplying}
						class="text-xs sm:text-sm"
					>
						{preset}
					</Button>
				{/each}
			</div>
			<Button 
				onclick={handleApplyPreset} 
				size="sm" 
				disabled={isApplying}
				class="w-full text-xs sm:text-sm"
			>
				{#if isApplying}
					<RefreshCw class="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
					Applying...
				{:else}
					Apply {selectedPreset} Preset
				{/if}
			</Button>
		</div>

		<!-- Manual Configuration -->
		<div class="space-y-3 sm:space-y-4">
			<h4 class="text-xs sm:text-sm font-medium">Manual Configuration</h4>
			
			<div class="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
				<div class="space-y-1.5 sm:space-y-2">
					<Label for="baseURL" class="text-xs sm:text-sm">Base URL</Label>
					<Input
						id="baseURL"
						bind:value={currentConfig.baseURL}
						placeholder="https://api.example.com"
						disabled={isApplying}
						class="text-xs sm:text-sm"
					/>
				</div>
				
				<div class="space-y-1.5 sm:space-y-2">
					<Label for="timeout" class="text-xs sm:text-sm">Timeout (ms)</Label>
					<Input
						id="timeout"
						type="number"
						bind:value={currentConfig.timeout}
						min="1000"
						max="60000"
						disabled={isApplying}
						class="text-xs sm:text-sm"
					/>
				</div>
				
				<div class="space-y-1.5 sm:space-y-2">
					<Label for="retryAttempts" class="text-xs sm:text-sm">Retry Attempts</Label>
					<Input
						id="retryAttempts"
						type="number"
						bind:value={currentConfig.retryAttempts}
						min="0"
						max="10"
						disabled={isApplying}
						class="text-xs sm:text-sm"
					/>
				</div>
				
				<div class="space-y-1.5 sm:space-y-2">
					<Label for="retryDelay" class="text-xs sm:text-sm">Retry Delay (ms)</Label>
					<Input
						id="retryDelay"
						type="number"
						bind:value={currentConfig.retryDelay}
						min="100"
						max="10000"
						disabled={isApplying}
						class="text-xs sm:text-sm"
					/>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex flex-wrap gap-1.5 sm:gap-2">
			<Button onclick={handleApplyConfig} disabled={isApplying} class="text-xs sm:text-sm">
				{#if isApplying}
					<RefreshCw class="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
					Applying...
				{:else}
					Apply Configuration
				{/if}
			</Button>
			
			<Button variant="outline" onclick={resetToDefault} disabled={isApplying} class="text-xs sm:text-sm">
				Reset to Default
			</Button>
		</div>

		<!-- Status Messages -->
		{#if success}
			<div class="flex items-center gap-2 rounded-md bg-green-50 p-2 sm:p-3 text-green-700 dark:bg-green-900/20 dark:text-green-400">
				<CheckCircle class="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
				<span class="text-xs sm:text-sm break-words">{success}</span>
			</div>
		{/if}

		{#if error}
			<div class="flex items-center gap-2 rounded-md bg-destructive/10 p-2 sm:p-3 text-destructive">
				<AlertCircle class="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
				<span class="text-xs sm:text-sm break-words">{error}</span>
			</div>
		{/if}

		<!-- Current Status -->
		<div class="space-y-2 rounded-lg border bg-muted/50 p-3 sm:p-4">
			<h5 class="text-xs sm:text-sm font-medium">Current Configuration</h5>
			<div class="grid grid-cols-1 gap-1.5 sm:gap-2 text-xs sm:grid-cols-2">
				<div class="break-words"><strong>Base URL:</strong> {currentConfig.baseURL}</div>
				<div class="break-words"><strong>Timeout:</strong> {currentConfig.timeout}ms</div>
				<div class="break-words"><strong>Retry Attempts:</strong> {currentConfig.retryAttempts}</div>
				<div class="break-words"><strong>Retry Delay:</strong> {currentConfig.retryDelay}ms</div>
			</div>
		</div>

		<!-- Environment Variables Info -->
		<div class="rounded-lg border bg-blue-50 p-3 sm:p-4 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
			<h5 class="mb-2 text-xs sm:text-sm font-medium">Environment Variables</h5>
			<div class="space-y-2 text-xs">
				<div>
					<p class="font-medium">Client-side (Public):</p>
					<p class="break-words"><code>PUBLIC_API_BASE_URL</code> - Public API base URL</p>
				</div>
				<div>
					<p class="font-medium">Server-side only (Private):</p>
					<p class="break-words"><code>API_BASE_URL</code> - Private API base URL</p>
					<p class="break-words"><code>API_TIMEOUT</code> - Request timeout in milliseconds</p>
					<p class="break-words"><code>API_RETRY_ATTEMPTS</code> - Number of retry attempts</p>
					<p class="break-words"><code>API_RETRY_DELAY</code> - Delay between retries in ms</p>
				</div>
				<div class="mt-2 rounded bg-blue-100 p-2 dark:bg-blue-800/50">
					<p class="text-xs break-words">
						💡 Private variables are only available server-side for security. 
						Use the configuration panel to change settings at runtime.
					</p>
				</div>
			</div>
		</div>
	</Card.Content>
</Card.Root>