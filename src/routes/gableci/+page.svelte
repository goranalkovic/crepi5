<script>
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Button from '../../parts/Button.svelte';
	import Popover from '../../parts/Popover.svelte';
	import Icon from '@iconify/svelte';
	import { debounce } from 'throttle-debounce';
	import { getCurrentDate } from '$lib/gableci';
	import Avatar from '../../parts/Avatar.svelte';
	import { slide, scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { page } from '$app/state';

	let { data } = $props();
	let { mealData, customMealData, selections, restaurants, profiles, supabase, user } = $derived(data);

	let validRestaurants = $derived(restaurants.filter((restaurant) => restaurant.slug in mealData || restaurant.slug in customMealData));

	// svelte-ignore state_referenced_locally
	let myChoices = $state(selections?.find(({ user: u }) => u === user.email)?.selected ?? {});

	// svelte-ignore state_referenced_locally
	let otherChoices = $state(selections?.filter(({ user: u, selected }) => u !== user.email && Object.keys(selected ?? {}).length > 0));

	let intersects = $derived.by(() => {
		let rawIntersects = {};
		// My choices.
		Object.entries(myChoices).forEach(([restaurant, choices]) => {
			rawIntersects[restaurant] = Object.keys(choices).length > 0 ? 1 : 0;
		});

		otherChoices.forEach(({ user: otherUser, selected }) => {
			Object.entries(selected).forEach(([restaurant, choices]) => {
				if (rawIntersects[restaurant]) {
					rawIntersects[restaurant] += Object.keys(choices).length > 0 ? 1 : 0;
				} else {
					rawIntersects[restaurant] = Object.keys(choices).length > 0 ? 1 : 0;
				}
			});
		});

		return Object.entries(rawIntersects).sort(([, a], [, b]) => b - a);
	});

	const updateMyChoices = (newValue, restaurant, index, metadata = {}) => {
		const updated = { ...myChoices };

		if (newValue) {
			if (!updated[restaurant]) {
				updated[restaurant] = {};
			}

			if (Object.keys(metadata).length > 0) {
				updated[restaurant][index] = { ...updated[restaurant][index], ...metadata };
			} else {
				updated[restaurant][index] = true;
			}
		} else {
			delete updated[restaurant][index];

			if (Object.keys(updated[restaurant]).length === 0) {
				delete updated[restaurant];
			}
		}

		myChoices = updated;

		updateMyChoicesInDb();
	};

	const currentDate = getCurrentDate();

	const updateMyChoicesInDb = debounce(500, async () => {
		const { error } = await supabase
			.from('meal-selections')
			.update({
				selected: myChoices,
			})
			.eq('user', user.email)
			.gte('created', `${currentDate} 00:00:00`)
			.lte('created', `${currentDate} 23:59:59`);

		if (error) {
			console.error('Error updating selections:', error);
		}
	});

	// Debug.
	$effect(() => {
		if (page?.url?.searchParams?.has('debug')) {
			console.log('validRestaurants', $state.snapshot(validRestaurants));
			console.log('myChoices', $state.snapshot(myChoices));
			console.log('otherChoices', $state.snapshot(otherChoices));
			console.log('intersects', $state.snapshot(intersects));
		}
	});

	onMount(() => {
		supabase
			.channel('selectionsInsert')
			.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'meal-selections' }, (payload) => {
				console.log('New selection added:', payload.new);

				if (payload.new.user !== user.email) {
					otherChoices = [...otherChoices, payload.new];
				}
			})
			.subscribe();

		supabase
			.channel('selectionsUpdate')
			.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'meal-selections' }, (payload) => {
				if (payload.new.user !== user.email) {
					const updatedChoices = [...otherChoices];

					const index = updatedChoices.findIndex((choice) => choice.user === payload.new.user);

					if (index !== -1) {
						updatedChoices[index].selected = payload.new.selected;

						otherChoices = updatedChoices;
					} else {
						otherChoices = [...otherChoices, payload.new];
					}
				}
			})
			.subscribe();
	});
</script>

{#if validRestaurants?.length > 0}
	<div
		class="flex w-full flex-col items-center gap-40 self-center justify-self-center rounded-2xl bg-white/90 p-40 shadow backdrop-blur-sm lg:w-[50vw] lg:max-w-1200 dark:bg-black/60"
	>
		<h1 class="font-display text-4xl">Ke bumo za gablec?</h1>

		<ul class="w-full space-y-20">
			{#each validRestaurants as { name, phone, delivery, url, urlType, slug }}
				<li class="flex flex-col py-20">
					<div class="flex items-center gap-8">
						<p class="font-display flex items-center gap-14 text-2xl">
							<img
								class="flex size-36 items-center justify-center rounded-lg bg-zinc-800 p-6"
								src="/restaurant-icons/{slug}.png"
								alt=""
								onerror={(e) => {
									e.preventDefault();
									e.stopPropagation();
									e.target.src = '/restaurant-icons/placeholder.png';
								}}
							/>

							<span class="translate-y-1.5">{name}</span>
						</p>

						{#snippet label()}
							<Icon
								icon="pixelarticons:info-box"
								class="size-20"
							/>
						{/snippet}

						<Popover
							{label}
							iconOnly
						>
							{#if delivery}
								<div class="flex items-center gap-8">
									<Icon
										icon="pixelarticons:truck"
										class="size-20 text-amber-400"
									/>

									{delivery}
								</div>
							{/if}

							{#if phone}
								<div class="flex items-center gap-8">
									<Icon
										icon="pixelarticons:deskphone"
										class="size-20 text-amber-400"
									/>

									{phone}
								</div>
							{/if}

							{#if url}
								<Button
									href={url}
									target="_blank"
									class="w-fit"
								>
									{urlType ?? 'Link'}

									<Icon
										icon="pixelarticons:external-link"
										class="size-20 text-amber-400 dark:text-amber-700"
									/>
								</Button>
							{/if}
						</Popover>

						{#if slug in myChoices && otherChoices.every(({ selected }) => slug in selected)}
							<div
								class="ml-auto flex items-center gap-8 pl-20"
								transition:slide
							>
								<Icon
									icon="pixelarticons:gps"
									class="size-20 text-amber-400 dark:text-amber-700"
								/>

								Intersekti!
							</div>
						{/if}
					</div>

					{#if slug in mealData}
						<p class="mt-16 mb-4 text-sm text-current/60 italic">Z eksternih izvora (mAIzen tehnologija)</p>

						<ul class="divide-y divide-black/10 dark:divide-white/10">
							{#each mealData[slug] as { name: mealName, price, meta }, index}
								{@const customChoices = otherChoices.filter((choice) => slug in choice.selected && `i${index}` in choice.selected[slug])}

								<li>
									<label class="flex min-h-60 items-center gap-8 py-8">
										<input
											type="checkbox"
											class="sr-only appearance-none"
											checked={myChoices?.[slug]?.[`i${index}`]}
											onchange={(e) => {
												const checked = e.target.checked;

												updateMyChoices(checked, slug, `i${index}`);
											}}
										/>

										<Icon
											icon={myChoices?.[slug]?.[`i${index}`] ? 'pixelarticons:checkbox' : 'pixelarticons:checkbox-on'}
											class="size-28 shrink-0"
										/>

										<p class="flex max-w-3/5 items-center gap-4">
											<span class="text-balance">{mealName}</span>

											{#if meta?.isVegetarian || meta?.isVegan}
												<Icon
													icon="pixelarticons:label-alt"
													class="size-20 text-emerald-300 dark:text-emerald-700"
												/>
											{/if}
										</p>

										<p class="mr-auto shrink-0 text-sm text-current/60 tabular-nums">{price}</p>

										{#if customChoices.length > 0}
											{#snippet label2()}
												<div class="flex shrink-0 items-center -space-x-10">
													{#each customChoices as { user: otherUser, selected }, index (otherUser)}
														{@const { firstName, lastName, avatar } = profiles?.find(({ email }) => email === otherUser)}
														{@const hasFullName = firstName.length > 0 || lastName.length > 0}
														{@const fullName = `${firstName} ${lastName}`.trim()}

														<div
															animate:flip
															transition:scale
														>
															<Avatar
																img={`/profile-pictures/${avatar}.jpg`}
																alt={fullName}
																fallback={hasFullName ? `${firstName[0]}${lastName[0]}` : otherUser[0]}
																class="size-20 border-2 border-white dark:border-zinc-950"
															/>
														</div>
													{/each}
												</div>
											{/snippet}
											<Popover label={label2}>
												<ul class="w-200 space-y-8 p-16">
													{#each customChoices as { user: otherUser, selected }, index}
														{@const { firstName, lastName, avatar } = profiles?.find(({ email }) => email === otherUser)}
														{@const hasFullName = firstName.length > 0 || lastName.length > 0}
														{@const fullName = `${firstName} ${lastName}`.trim()}

														<li class="flex items-center gap-8">
															<Avatar
																img={`/profile-pictures/${avatar}.jpg`}
																alt={fullName}
																fallback={hasFullName ? `${firstName[0]}${lastName[0]}` : otherUser[0]}
																class="size-20"
															/>

															<p class="text-sm">
																{#if hasFullName}
																	{fullName}
																{:else}
																	{otherUser}
																{/if}
															</p>
														</li>
													{/each}
												</ul>
											</Popover>
										{/if}
									</label>
								</li>
							{/each}
						</ul>
					{/if}

					{#if slug in customMealData}
						<p class="mt-16 mb-4 text-sm text-current/60 italic">Z ČrepBaze (može biti old info)</p>

						<ul class="divide-y divide-black/10 dark:divide-white/10">
							{#each customMealData[slug] as { name: mealName, price, meta }, index}
								{@const customChoicesCustom = otherChoices.filter((choice) => slug in choice.selected && `c${index}` in choice.selected[slug])}

								<li>
									<label class="flex min-h-60 items-center gap-8 py-8">
										<input
											type="checkbox"
											class="sr-only appearance-none"
											checked={myChoices?.[slug]?.[`c${index}`]}
											onchange={(e) => {
												const checked = e.target.checked;

												updateMyChoices(checked, slug, `c${index}`);
											}}
										/>

										<Icon
											icon={myChoices?.[slug]?.[`c${index}`] ? 'pixelarticons:checkbox' : 'pixelarticons:checkbox-on'}
											class="size-28 shrink-0"
										/>

										<p class="flex max-w-3/5 items-center gap-4">
											{#if meta?.coralDay}
											<span class="uppercase p-2 bg-black text-white rounded-sm text-sm shrink-0 inline-block">{meta?.coralDay}</span>
											{/if}

											<span class="text-balance">{mealName}</span>


											{#if meta?.isVegetarian || meta?.isVegan}
												<Icon
													icon="pixelarticons:label-alt"
													class="size-20 text-emerald-300 dark:text-emerald-700"
												/>
											{/if}
										</p>

										<p class="mr-auto shrink-0 text-sm text-current/60 tabular-nums">{price}</p>

										{#if customChoicesCustom?.length > 0}
											{#snippet label3()}
												<div class="flex shrink-0 items-center -space-x-10">
													{#each customChoicesCustom as { user: otherUser, selected }, index (otherUser)}
														{@const { firstName, lastName, avatar } = profiles?.find(({ email }) => email === otherUser)}
														{@const hasFullName = firstName.length > 0 || lastName.length > 0}
														{@const fullName = `${firstName} ${lastName}`.trim()}

														<div
															animate:flip
															transition:scale
														>
															<Avatar
																img={`/profile-pictures/${avatar}.jpg`}
																alt={fullName}
																fallback={hasFullName ? `${firstName[0]}${lastName[0]}` : otherUser[0]}
																class="size-20 border-2 border-white dark:border-zinc-950"
															/>
														</div>
													{/each}
												</div>
											{/snippet}
											<Popover label={label3}>
												<ul class="w-200 space-y-8 p-16">
													{#each customChoicesCustom as { user: otherUser, selected }, index}
														{@const { firstName, lastName, avatar } = profiles.find(({ email }) => email === otherUser)}
														{@const hasFullName = firstName.length > 0 || lastName.length > 0}
														{@const fullName = `${firstName} ${lastName}`.trim()}

														<li class="flex items-center gap-8">
															<Avatar
																img={`/profile-pictures/${avatar}.jpg`}
																alt={fullName}
																fallback={hasFullName ? `${firstName[0]}${lastName[0]}` : otherUser[0]}
																class="size-20"
															/>

															<p class="text-sm">
																{#if hasFullName}
																	{fullName}
																{:else}
																	{otherUser}
																{/if}
															</p>
														</li>
													{/each}
												</ul>
											</Popover>
										{/if}
									</label>
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	</div>

	{#if intersects.length > 0}
		{@const realIntersects = intersects?.filter(([_, count]) => count > otherChoices.length - (Object.keys(myChoices).length > 0 ? 0 : 1))}
		{@const almostIntersects = intersects?.filter(([_, count]) => count <= otherChoices.length - (Object.keys(myChoices).length > 0 ? 0 : 1))}

		<div
			transition:slide
			class="flex w-full flex-col gap-8 self-start justify-self-center rounded-2xl bg-white/90 p-40 shadow backdrop-blur-sm lg:sticky lg:top-80 lg:w-[30vw] lg:max-w-480 dark:bg-black/60"
		>
			{#if realIntersects.length > 0}
				<h2 class="font-display mb-20 text-3xl">Kraljevi intersekata</h2>

				<ul class="w-full">
					{#each realIntersects as [restaurant, count], index (restaurant)}
						{@const { name } = validRestaurants?.find(({ slug }) => slug === restaurant) ?? {}}

						<li
							class="flex items-center gap-8 py-4"
							animate:flip
							transition:slide
						>
							<img
								class="flex size-36 items-center justify-center rounded-lg bg-zinc-800 p-6"
								src="/restaurant-icons/{restaurant}.png"
								alt=""
								onerror={(e) => {
									e.preventDefault();
									e.stopPropagation();
									e.target.src = '/restaurant-icons/placeholder.png';
								}}
							/>

							{name}
						</li>
					{/each}
				</ul>
			{:else}
				Nema? Intersektija nema?
			{/if}

			{#if almostIntersects.length > 0}
				<hr class="mt-20 h-px w-full border-0 bg-current/15" />
			{/if}

			{#if almostIntersects.length > 0}
				<h2 class="font-display mt-20 mb-20 text-3xl">Skoro pa intersektiji</h2>

				<ul class="w-full">
					{#each almostIntersects as [restaurant, count], index (restaurant)}
						{@const { name } = validRestaurants?.find(({ slug }) => slug === restaurant) ?? {}}
						{@const iHaveSelected = restaurant in myChoices}

						<li
							class="flex items-center justify-between gap-8 py-4 {iHaveSelected ? 'text-current/20' : ''}"
							animate:flip
							transition:slide
						>
							<p>
								{name}
							</p>
							<p>fali {otherChoices.length + 1 - count}</p>
						</li>
					{:else}
						Nema? Intersektija nema?
					{/each}
				</ul>
			{/if}
		</div>
	{/if}
{:else}
	<p>Hmmm, nema restorana?</p>
{/if}

<svelte:head>
  <title>Gableci | Črepi letido</title>
</svelte:head>
