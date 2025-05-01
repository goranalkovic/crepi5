import { error } from '@sveltejs/kit';

export const getGablecData = async (locals) => {
	const { user } = await locals.safeGetSession();
	const { supabase } = locals;

	const { data: userData, error: userDataError } = await supabase.from('profiles').select().eq('id', user.id).maybeSingle();

	if (userDataError) {
		console.error(userDataError);
		throw error(500, 'Could not fetch user data');
	}

	if (!userData) {
		const { data: newUserData, error: insertError } = await supabase.from('profiles').insert({
			id: user.id,
			firstName: '',
			lastName: '',
			avatar: '',
			themeColor: '',
			themeMode: 'system',
			themeRadius: 1.0,
		}).select().single();

		if (insertError) {
			console.error(insertError);
			throw error(500, 'Could not create profile');
		}

		return newUserData;
	}

	return userData;
};
