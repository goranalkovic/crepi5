import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	confirmOtp: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const otpCode = formData.get('otp');

		const { error } = await supabase.auth.verifyOtp({
			email,
			token: otpCode,
			type: 'email',
		});

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
			redirect(303, '/private');
		}
	},
};
