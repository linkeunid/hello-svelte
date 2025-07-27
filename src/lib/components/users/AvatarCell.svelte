<script lang="ts">
	interface Props {
		image: string;
		firstName: string;
		lastName: string;
	}

	let { image, firstName, lastName }: Props = $props();
</script>

<img 
	src={image} 
	alt="{firstName} {lastName}" 
	class="h-10 w-10 rounded-full object-cover" 
/>