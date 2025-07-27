<script lang="ts">
	interface Props {
		gender: string;
	}

	let { gender }: Props = $props();

	const colorClass = gender === 'male' 
		? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20' 
		: 'bg-pink-50 text-pink-700 ring-1 ring-inset ring-pink-600/20';
</script>

<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {colorClass}">
	{gender.charAt(0).toUpperCase() + gender.slice(1)}
</span>