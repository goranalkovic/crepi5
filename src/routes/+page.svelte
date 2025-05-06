<script>
	let { data } = $props();
	let { colors } = $derived(data);
</script>

<div class="flex w-400 flex-col items-center self-center justify-self-center rounded-2xl bg-white/90 dark:bg-black/60 p-40 shadow backdrop-blur-sm">
	<img
		src="/logo.svg"
		class="size-160 mb-40 dark:invert"
		alt=""
	/>

	<h1 class="font-display text-4xl text-amber-950 dark:text-amber-50">Črepi letido</h1>
	<p class="font-mono text-xs text-amber-950/50 dark:text-amber-50/60">v4.0 alpha</p>
</div>

<svelte:head>
  <title>Dobrodošli | Črepi letido</title>
</svelte:head>