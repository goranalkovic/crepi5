import { getOrCreateUserProfile } from '$lib/auth/index.js';

export const load = async ({ locals, locals: { supabase } }) => {
	const userProfile = await getOrCreateUserProfile(locals);

	return { userProfile };
};
