import { getOrCreateUserProfile } from '$lib/auth/index.js';

export const load = async ({ locals, locals: { safeGetSession }, cookies }) => {
	const { session } = await safeGetSession(locals);

	const userProfile = await getOrCreateUserProfile(locals);

	return {
		userProfileTwo: userProfile,
		session,
		cookies: cookies.getAll(),
	};
};
