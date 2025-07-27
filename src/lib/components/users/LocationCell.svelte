<script lang="ts">
	interface Props {
		address: {
			city: string;
			state: string;
			country: string;
		};
	}

	let { address }: Props = $props();
</script>

<div>
	<div class="text-sm">{address.city}, {address.state}</div>
	<div class="text-xs text-muted-foreground">{address.country}</div>
</div>