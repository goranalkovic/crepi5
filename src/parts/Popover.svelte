<script>
	import { Popover } from 'bits-ui';
	import clsx from 'clsx';
	import { fly } from 'svelte/transition';

	const { children, label, iconOnly = false } = $props();
</script>

<Popover.Root>
	<Popover.Trigger
		class={clsx(
			'flex items-center justify-center gap-8 rounded-lg font-semibold transition active:scale-[0.98]',
			'ring-amber-600/30 focus:outline-hidden focus-visible:ring-3 enabled:cursor-pointer',
			'text-current hover:bg-amber-50/90 dark:hover:bg-amber-950/50',
			iconOnly ? 'size-42' : 'px-8 h-42',
		)}
	>
		{@render label?.()}
	</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content
			class="z-30 w-320 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white p-16 space-y-8 shadow dark:bg-zinc-800 animate-in fade-in zoom-in-95"
			align="start"
			side="right"
		>
			{@render children()}
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
