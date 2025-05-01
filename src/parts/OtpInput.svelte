<script>
	import { PinInput, REGEXP_ONLY_DIGITS } from 'bits-ui';
	import { clsx } from 'clsx';

	let { onComplete, name, noAutoClear = false, length = 6, ...rest } = $props();

	let value = $state('');
</script>

<PinInput.Root
	bind:value
	class="group/pininput text-foreground flex items-center has-disabled:opacity-30"
	maxlength={length}
	pattern={REGEXP_ONLY_DIGITS}
	name="otp"
	autocomplete="one-time-code"
	aria-label="One-time code"
	onComplete={() => {
		if (onComplete) {
			onComplete();
		}

		if (!noAutoClear) {
			value = '';
		}
	}}
	{...rest}
>
	{#snippet children({ cells })}
		<div class="flex gap-6">
			{#each cells.slice(0, length) as cell}
				{@render Cell(cell)}
			{/each}
		</div>
	{/snippet}
</PinInput.Root>

{#snippet Cell(cell)}
	<PinInput.Cell
		{cell}
		class={clsx(
			'relative h-56 w-44 rounded-lg border border-black dark:border-white',
			'data-active:ring-3 data-active:ring-amber-600/30',
			'font-mono text-4xl font-semibold text-current',
			'flex items-center justify-center'
		)}
	>
		{#if cell.char !== null}
			<div>
				{cell.char}
			</div>
		{/if}
		{#if cell.hasFakeCaret}
			<div class="animate-caret-blink pointer-events-none absolute inset-0 flex items-center justify-center">
				<div class="h-8 w-px bg-black/80 dark:bg-white/50"></div>
			</div>
		{/if}
	</PinInput.Cell>
{/snippet}
