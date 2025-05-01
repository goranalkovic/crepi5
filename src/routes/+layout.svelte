<script>
	import '../app.css';
	import '@fontsource-variable/geist';
	import '@fontsource-variable/geist-mono';
	import 'cal-sans';

	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	import { page } from '$app/state';
	import { Menubar, DropdownMenu } from 'bits-ui';
	import Button from '../parts/Button.svelte';
	import Avatar from '../parts/Avatar.svelte';

	import { ModeWatcher, setMode } from 'mode-watcher';
	import clsx from 'clsx';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((status, newSession) => {
			if (status === 'SIGNED_OUT') {
				invalidateAll('supabase:auth');
			}

			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		setMode(page?.data?.userProfile?.themeMode ?? 'system');

		return () => data.subscription.unsubscribe();
	});

	let currentPath = $derived(page?.route?.id);
	let hasLoginButtons = $derived(currentPath?.startsWith('/auth') === false);
</script>

<ModeWatcher darkClassNames={['dark']} />

<img
	src="/bliss2024.jpg"
	alt=""
	class="pointer-events-none fixed inset-0 -z-50 size-full object-cover opacity-60 select-none dark:hidden"
/>
<img
	src="/bliss2024night.jpg"
	alt=""
	class="pointer-events-none fixed inset-0 -z-50 size-full object-cover opacity-60 select-none not-dark:hidden"
/>

<nav
	class="fixed right-0 bottom-40 left-0 mx-auto flex w-fit divide-x divide-black/10 rounded-2xl bg-white/85 text-black shadow-lg backdrop-blur dark:divide-white/10 dark:bg-black/60 dark:text-white"
>
	<div class="flex items-center p-8">
		<Button
			variant="ghost"
			href="/"
		>
			<img
				src="/crepi-letido.png"
				class="size-24"
				alt=""
			/>
			<span class="font-display translate-y-1.5 text-lg max-sm:sr-only">Črepi letido</span>
		</Button>
	</div>

	{#if hasLoginButtons}
		<div class="flex items-center gap-8 p-8">
			<Button
				variant="ghost"
				href="/fun-corner"
			>
				Fun corner
			</Button>

			{#if data.user}
				<Button
					variant="ghost"
					href="/private">Gableci</Button
				>
			{/if}
		</div>

		<div class="flex items-center gap-8 p-8">
			{#if data.user}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger
						class={clsx(
							'flex h-42 px-8 cursor-pointer items-center justify-center gap-8 rounded-lg transition active:scale-[0.98]',
							'ring-amber-600/30 focus:outline-hidden focus-visible:ring-3',
							'text-current hover:bg-amber-50/90 dark:hover:bg-amber-950/50'
						)}
					>
						<Avatar fallback="GA" />
						<svg
							width="14"
							height="14"
							viewBox="0 0 14 14"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							class="stroke-current size-10 shrink-0"
						>
							<path
								d="M1.5 9.5L7 4.5L12.5 9.5"
								stroke-width="1"
							/>
						</svg>
					</DropdownMenu.Trigger>

					<DropdownMenu.Content
						class="min-w-240 divide-y divide-black/10 rounded-2xl bg-white/80 backdrop-blur-lg dark:divide-white/10 dark:bg-black/60"
					>
						<DropdownMenu.Group class="p-8">
							<DropdownMenu.GroupHeading class="px-8 pb-4">
								<span class="block text-sm select-none">
									{#if page?.data?.userProfile?.firstName?.length < 1 && page?.data?.userProfile?.lastName?.length < 1}
										bezimena.bmp
									{:else}
										{page?.data?.userProfile?.firstName} {page?.data?.userProfile?.lastName}
									{/if}
								</span>
								<span class="block text-xs text-current/50 select-none">
									{data?.user?.email}
								</span>
							</DropdownMenu.GroupHeading>
							<DropdownMenu.Item
								class={clsx(
									'flex h-42 items-center gap-8 rounded-lg px-12 transition active:scale-[0.98]',
									'cursor-pointer ring-amber-600/30 focus:outline-hidden focus-visible:ring-3',
									'text-current hover:bg-amber-50/90 dark:hover:bg-amber-950/50'
								)}
								onSelect={() => goto('/profile')}
							>
								Profil
							</DropdownMenu.Item>
						</DropdownMenu.Group>

						<DropdownMenu.Group class="p-8">
							<DropdownMenu.Item
								class={clsx(
									'flex h-42 items-center gap-8 rounded-lg px-12 transition active:scale-[0.98]',
									'cursor-pointer ring-amber-600/30 focus:outline-hidden focus-visible:ring-3',
									'text-current hover:bg-amber-50/90 dark:hover:bg-amber-950/50'
								)}
								onSelect={() => goto('/auth/signout')}
							>
								Odjava
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{:else}
				<Button
					variant="ghost"
					href="/auth">Prijavi se</Button
				>
			{/if}
		</div>
	{:else}
		<div class="flex items-center gap-8 p-8">
			<span class="px-10 text-sm opacity-75 select-none">Prijava/registracija</span>
		</div>
	{/if}
</nav>

<main class="m-auto">
	{@render children()}
</main>
