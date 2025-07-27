<script lang="ts">
	interface Props {
		company: {
			name: string;
			title: string;
		};
	}

	let { company }: Props = $props();
</script>

<div>
	<div class="font-medium">{company.name}</div>
	<div class="text-sm text-muted-foreground">{company.title}</div>
</div>