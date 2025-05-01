<script>
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { Popover, Button } from 'bits-ui';
	import OtpInput from '../../../parts/OtpInput.svelte';

	let email = $state('');
	let otpCode = $state('');
	let submitButton;

	let errorDetails = $state(null);

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		email = urlParams.get('email');
	});
</script>

<div class="flex w-400 flex-col items-center self-center justify-self-center rounded-2xl bg-white/90 dark:bg-black/60 p-40 shadow backdrop-blur-sm">
	<h1 class="font-display text-2xl">Proveri si mejla! Stigel kod?</h1>
	<p class="mb-24 text-sm text-center text-balance">Ako pak nije, javi se Gocu da pogleda.</p>

	<form
		method="POST"
		action="?/confirmOtp"
		use:enhance={({ formElement, formData, action, cancel, submitter }) => {
			// `formElement` is this `<form>` element
			// `formData` is its `FormData` object that's about to be submitted
			// `action` is the URL to which the form is posted
			// calling `cancel()` will prevent the submission
			// `submitter` is the `HTMLElement` that caused the form to be submitted

			return async ({ result, update }) => {
				if (result?.data?.error) {
					errorDetails = result?.data?.errorDetails;
				} else {
					errorDetails = null;
				}

				if (email.length < 1) {
					email = result?.data?.submittedData?.email;
				}

				update();
			};
		}}
	>
		<input
			name="email"
			type="hidden"
			bind:value={email}
		/>

		<OtpInput onComplete={() => submitButton?.click()} />
		<button
			bind:this={submitButton}
			type="submit"
			aria-label="Submit"
			class="hidden"
		>
		</button>
	</form>
</div>

{#if errorDetails}
	<div
		class="mt-20 flex w-400 flex-col items-center self-center justify-self-center rounded-2xl border border-red-800/20 bg-red-100/80 p-24 text-center text-red-950 shadow backdrop-blur-sm"
		transition:slide
	>
		{#if errorDetails?.type === 'AuthApiError' && errorDetails?.text === 'Token has expired or is invalid'}
			<p class="font-semibold text-balance">Token je istekel ili ne valja.</p>
			<p class="text-xs text-balance">Vidi da nije nekaj krive stipkano. Ak niš, kreni sponova celog procesija.</p>
		{:else if errorDetails?.code === 'expired-otp'}
			<p class="font-semibold text-balance">Neke je z auth serverima.</p>
			<p class="text-xs text-balance">Probaj još jenput.</p>
		{:else}
			<p class="text-balance"><span class="font-semibold">Neke je crklo</span>, probaj još jenput.</p>
		{/if}
	</div>

	<div class="mt-12 flex justify-center">
		<Popover.Root>
			<Popover.Trigger
				class="cursor-help rounded-lg bg-black/5 px-8 py-4 text-xs font-medium text-white dark:text-white/50 backdrop-blur-3xl transition hover:bg-black/80 data-[state=open]:bg-black/90 data-[state=open]:text-white"
			>
				Detalji za Goca
			</Popover.Trigger>
			<Popover.Content
				class="data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-top-5 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-top-5 mx-auto mt-8 w-640"
			>
				<div class="rounded-2xl bg-white/90 p-24 shadow backdrop-blur-sm">
					<pre class="font-mono text-xs">{JSON.stringify(errorDetails, null, 2)}</pre>
				</div>
			</Popover.Content>
		</Popover.Root>
	</div>
{/if}
