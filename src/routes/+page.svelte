<script>
	import Button from '../parts/Button.svelte';

	let { data } = $props();
	let { userProfile } = $derived(data);
</script>

<div
	class="flex w-400 flex-col items-center self-center justify-self-center rounded-2xl bg-white/90 p-40 shadow backdrop-blur-sm dark:bg-black/60"
>
	<img
		src="/logo.svg"
		class="mb-40 size-160 dark:invert"
		alt=""
	/>

	<h1 class="font-display text-4xl text-amber-950 dark:text-amber-50">Črepi letido</h1>
	<p class="font-mono text-xs text-amber-950/50 dark:text-amber-50/60">v4.0 alpha</p>

	{#if userProfile && (userProfile?.firstName?.length < 1 || userProfile?.lastName?.length < 1 || userProfile?.avatar?.length < 1)}
		<div
			class="mt-24 flex flex-col items-center gap-8 rounded-2xl bg-amber-200 px-12 py-8 text-amber-950 dark:bg-amber-900 dark:text-amber-50"
		>
			<p>⚠️ Faliju ti podaci f profilu, pogleč pliz!</p>

			<Button href="/profile">Fixaj</Button>
		</div>
	{/if}
</div>

<svelte:head>
	<title>Dobrodošli | Črepi letido</title>
</svelte:head>
