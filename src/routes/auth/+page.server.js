import { redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email');

		const { data, error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				shouldCreateUser: true,
			},
		});

		if (error) {
			console.error(error);
			redirect(303, '/auth/error');
		} else {
			redirect(303, `/auth/otp?email=${email}`);
		}
	},
};
