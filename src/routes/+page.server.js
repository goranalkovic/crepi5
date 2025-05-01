import { getOrCreateUserProfile } from '$lib/auth/index.js';

export const load = async ({ locals, locals: { supabase } }) => {
	const userProfile = await getOrCreateUserProfile(locals);

	const { data: colors } = await supabase.from('restaurants').select('name').limit(5).order('name');

	return { colors: colors ?? [], userProfile };
};
