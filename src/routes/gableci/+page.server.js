import { getOrCreateUserProfile } from '$lib/auth';

export const load = async ({ depends, locals, locals: { supabase } }) => {
	// depends('supabase:db:crepi');

	const userProfile = await getOrCreateUserProfile(locals);

	const { data: mealData } = await supabase.from('meal-data').select().eq('valid', true).select('meals, restaurant');
	const { data: customMealData } = await supabase.from('custom-meal-data').select().eq('valid', true).select('meals, restaurant');
	const { data: selections } = await supabase.from('meal-selections').select();
	const { data: restaurants } = await supabase.from('restaurants').select('*');
	const { data: profiles } = await supabase.from('profiles').select('*');

	if (!(selections ?? [])?.find(({ user: u }) => u === locals.user.email)?.selected) {
		const { data, error } = await supabase.from('meal-selections').insert({
			user: locals.user.email,
			selected: {},
		});

		if (error) {
			console.error('Error inserting selections:', error);
		} else {
			console.log('Selections inserted successfully:', data);
		}
	}

	return {
		mealData: (mealData ?? []).reduce((acc, { restaurant, meals }) => (meals.length === 0 ? acc : { ...acc, [restaurant]: meals }), {}),
		customMealData: (customMealData ?? []).reduce(
			(acc, { restaurant, meals }) => (meals.length === 0 ? acc : { ...acc, [restaurant]: meals }),
			{}
		),
		selections: selections ?? [],
		restaurants: restaurants ?? [],
		profiles: profiles ?? [],
		userProfile,
	};
};
