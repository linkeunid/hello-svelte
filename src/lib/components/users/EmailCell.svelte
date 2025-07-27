<script lang="ts">
	interface Props {
		email: string;
	}

	let { email }: Props = $props();
</script>

<div class="lowercase">{email}</div>