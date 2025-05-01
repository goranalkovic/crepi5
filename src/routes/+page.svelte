<script>
	import { Alert, Button, DarkMode } from 'flowbite-svelte';

	let { data } = $props();
	let { colors } = $derived(data);
</script>

<h1>Welcome to Supabase!</h1>
<ul>
	{#each colors as color}
		<li>{color.name}</li>
	{/each}
</ul>
<div class="p-8">
	<Alert>
		<span class="font-medium">Info alert!</span>
		Change a few things up and try submitting again.
	</Alert>
</div>

<DarkMode />

<Button href="/private">Private area</Button>
