<script>
	import { Button } from 'bits-ui';
	import clsx from 'clsx';
	let { class: className, disabled, children, variant = 'primary', ...rest } = $props();
</script>

<Button.Root
	class={clsx(
		'flex h-42 items-center justify-center gap-8 rounded-lg px-12 transition active:scale-[0.98]',
		'ring-amber-600/30 focus:outline-hidden focus-visible:ring-3 enabled:cursor-pointer',
		!disabled && variant === 'primary' && 'bg-black text-white shadow-sm hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200',
		!disabled && variant === 'ghost' && 'hover:bg-amber-50/90 text-current dark:hover:bg-amber-950/50',
		variant === 'primary' && 'font-semibold',
		variant === 'ghost' && 'font-medium',
		disabled && 'text-zinc-400 dark:text-zinc-500 cursor-not-allowed',
		className,
	)}
	{disabled}
	{...rest}
>
	{@render children()}
</Button.Root>
