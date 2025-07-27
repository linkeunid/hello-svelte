<script lang="ts">
	interface Props {
		firstName: string;
		lastName: string;
		username: string;
	}

	let { firstName, lastName, username }: Props = $props();
</script>

<div>
	<div class="font-medium">{firstName} {lastName}</div>
	<div class="text-sm text-muted-foreground">@{username}</div>
</div>