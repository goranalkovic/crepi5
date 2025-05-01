import { getOrCreateUserProfile } from '$lib/auth';

export const load = async ({ depends, locals, locals: { supabase } }) => {
	depends('supabase:db:notes');

	const userProfile = await getOrCreateUserProfile(locals);

	const { data: notes } = await supabase.from('notes').select('id,note').order('id');
	return { notes: notes ?? [], userProfile };
};
