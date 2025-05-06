<script>
	import clsx from 'clsx';
	import Button from '../../parts/Button.svelte';
</script>

<div
	class="flex w-400 flex-col items-center self-center justify-self-center rounded-2xl bg-white/90 p-40 shadow backdrop-blur-sm dark:bg-black/60"
>
	<h1 class="font-display text-2xl">E-majl na sunce!</h1>
	<p class="mb-24 text-center text-sm text-balance">Bu ti stigel kod kad uneseš. Jednom se samo može unijeti, tako da naj ga zgubiti!</p>
	<form
		method="POST"
		action="?/login"
	>
		<label>
			<span class="sr-only">E-mail</span>
			<input
				name="email"
				type="email"
				placeholder="Napiši tuj"
				class={clsx(
					'h-56 rounded-lg border border-black px-12 dark:border-white dark:text-white',
					'focus:outline-hidden focus-visible:ring-3 focus-visible:ring-amber-600/30',
					'font-mono',
					'flex items-center justify-center'
				)}
			/>
		</label>
		<Button
			class="mx-auto mt-12 group"
			type="submit"
		>
			<span>Ajm redi</span>

			<svg
				width="44"
				height="44"
				viewBox="0 0 44 44"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="size-40 stroke-current transition-transform group-hover:scale-105"
			>
				<path
					d="M22.5222 27.8704C25.1233 25.2692 25.1233 21.052 22.5222 18.4508C21.4986 17.4272 20.2247 16.8064 18.8976 16.5884C18.602 16.5399 18.3038 16.5113 18.0051 16.5027M22.5222 27.8704L20.5241 25.8723C22.0217 24.3747 22.0217 21.9465 20.5241 20.4489C19.0265 18.9513 16.5983 18.9513 15.1007 20.4489L13.1026 18.4508C14.1122 17.4412 15.3653 16.8235 16.6728 16.5976C17.1131 16.5215 17.5596 16.4899 18.0051 16.5027M22.5222 27.8704H40.2158C42.8169 25.2692 42.8169 21.052 40.2158 18.4508C38.9642 17.1993 37.3385 16.5499 35.6987 16.5027L18.0051 16.5027"
					stroke-width="1.5"
				/>
				<path
					d="M10.09 19.7294H0.331665"
					stroke-width="1.5"
				/>
				<path
					d="M13.3428 24.1698H3.58447"
					stroke-width="1.5"
				/>
				<path
					d="M16.9208 28.2066H7.16248"
					stroke-width="1.5"
				/>
			</svg>
		</Button>
	</form>
</div>

<svelte:head>
  <title>Prijava/registracija | Črepi letido</title>
</svelte:head>