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
	import { enhance } from '$app/forms';
	import { setMode } from 'mode-watcher';

	let { data } = $props();
	let { supabase, user, userProfile } = $derived(data);

	let themeField;
</script>

<div
	class="flex w-400 flex-col items-center gap-40 self-center justify-self-center rounded-2xl bg-white/90 p-40 shadow backdrop-blur-sm dark:bg-black/60"
>
	<h1 class="font-display text-4xl">Profil</h1>

	<p>Bit će bolje stilski, WIP area!</p>

	<form
		class="w-full space-y-8"
		method="POST"
		action="?/saveProfile"
		use:enhance={({ formElement, formData, action, cancel, submitter }) => {
			return async ({ result, update }) => {
				// Try to update theme mode immediately.
				try {
					if (themeField?.value) {
						const newTheme = themeField?.value;
						setMode(newTheme);
					}
				} catch (error) {}

				update();
			};
		}}
	>
		<input
			type="hidden"
			name="email"
			value={user.email}
		/>

		<label class="flex items-center justify-between gap-12">
			<p>Tema</p>
			<select
				value={userProfile.themeMode}
				class="w-160 rounded-xl bg-zinc-200 p-8 dark:bg-zinc-700"
				name="themeMode"
				bind:this={themeField}
			>
				<option value="system">Kak sistem veli</option>
				<option value="light">Navek svetlo</option>
				<option value="dark">Navek tamne</option>
			</select>
		</label>

		<hr class="my-20 opacity-10" />

		<label class="flex items-center justify-between gap-12">
			<p>Ime</p>
			<input
				value={userProfile.firstName}
				class="w-160 rounded-xl bg-zinc-200 p-8 dark:bg-zinc-700"
				name="firstName"
				type="text"
			/>
		</label>

		<label class="flex items-center justify-between gap-12">
			<p>Prezime</p>
			<input
				value={userProfile.lastName}
				class="w-160 rounded-xl bg-zinc-200 p-8 dark:bg-zinc-700"
				name="lastName"
				type="text"
			/>
		</label>

		<label class="flex items-center justify-between gap-12">
			<p>Avatar</p>
			<select
				value={userProfile.avatar}
				class="w-160 rounded-xl bg-zinc-200 p-8 dark:bg-zinc-700"
				name="avatar"
			>
				<optgroup label="Ljudeki">
					<option value="aco">Aco</option>
					<option value="ceh">Čeh</option>
					<option value="goc">Goc</option>
					<option value="hrvoic">Hrvoic</option>
					<option value="jurica">Jurica</option>
					<option value="jurica2">Jurica 2</option>
					<option value="kanc">Kanc</option>
					<option value="my10">My10</option>
					<option value="petarjadek">Petar Jadek</option>
					<option value="tamara">Tamara</option>
				</optgroup>
				<optgroup label="Razne">
					<option value="ext1">Bogtepita 1</option>
					<option value="ext2">Bogtepita 2</option>
					<option value="ext3">Bogtepita 3</option>
					<option value="ext4">Bogtepita 4</option>
					<option value="ext5">Bogtepita 5</option>
					<option value="ext6">Bogtepita 6</option>
					<option value="ext7">Bogtepita 7</option>
					<option value="ext8">Bogtepita 8</option>
					<option value="ext9">Bogtepita 9</option>
					<option value="ext10">Bogtepita 10</option>
				</optgroup>
			</select>
		</label>

		<Button
			type="submit"
			aria-label="Submit"
			class="mx-auto mt-36"
		>
			Sačuvaj bože
		</Button>
	</form>
</div>

<svelte:head>
  <title>Profil | Črepi letido</title>
</svelte:head>