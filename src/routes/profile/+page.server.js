import { invalidateAll } from '$app/navigation';
import { getOrCreateUserProfile } from '$lib/auth';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ depends, locals, locals: { supabase } }) => {
	const userProfile = await getOrCreateUserProfile(locals);

	return {
		userProfile,
	};
};

export const actions = {
	saveProfile: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const themeMode = formData.get('themeMode');
		const firstName = formData.get('firstName');
		const lastName = formData.get('lastName');
		const avatar = formData.get('avatar');

		const { error } = await supabase
			.from('profiles')
			.update({
				themeMode,
				firstName,
				lastName,
				avatar,
			})
			.eq('email', email);

		if (error) {
			console.error(error);

			return fail(400, {
				incorrect: true,
				error: true,
				submittedData: { email, otpCode },
				errorDetails: {
					text: error.message,
					type: error.name,
					code: error.code,
					raw: JSON.stringify(error),
				},
			});
		} else {
			redirect(303, '/');
		}
	},
};
