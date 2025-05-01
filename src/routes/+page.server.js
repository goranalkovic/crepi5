export const load = async ({ locals: { supabase } }) => {
	const { data: colors } = await supabase.from('restaurants').select('name').limit(5).order('name');
	return { colors: colors ?? [] };
};
