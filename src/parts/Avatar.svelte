<script>
	import { Avatar } from 'bits-ui';
	import clsx from 'clsx';

	let { img, alt, fallback, class: className, ...rest } = $props();
</script>

<Avatar.Root {...rest}>
	{#if img}
		<Avatar.Image
			class={clsx('size-24 border border-zinc-200', className)}
			src={img}
			{alt}
		/>
	{/if}

	{#if fallback}
		<Avatar.Fallback
			class={clsx(
				'font-display flex size-32 items-center justify-center overflow-hidden rounded-full bg-amber-800 dark:bg-amber-950 text-2xl font-bold text-amber-50 dark:text-amber-100/80 text-center',
				className
			)}
		>
			<div class="translate-y-1.5 -rotate-12">{fallback}</div>
		</Avatar.Fallback>
	{/if}
</Avatar.Root>
