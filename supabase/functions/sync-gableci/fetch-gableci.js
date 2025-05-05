import { DOMParser, initParser } from 'https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm-noinit.ts';

export const fetchGablecData = async () => {
	await initParser();

	// Fetch gableci
	const url = 'https://gableci.hr/vz/';

	const document = await fetch(url);
	const rawDocument = await document.text();

	const root = new DOMParser().parseFromString(rawDocument, 'text/html');

	const allRestaurantElements = root?.querySelectorAll('.restoran');

	if (!allRestaurantElements) {
		return null;
	}

	const restaurantData = [...allRestaurantElements]
		.map((restaurant) => {
			const titleRaw = restaurant.querySelector('.main-restoran-title');
			const mealsRaw = restaurant.querySelector('ul.list-jela');
			// const metaRaw = restaurant.querySelector('.restoran__meta');

			let output = {
				valid: true,
				restaurant: titleRaw?.getAttribute('href')?.replace('https://gableci.hr/restoran', '').replaceAll('/', ''),
				meals: [...mealsRaw.querySelectorAll('li.food-type')]
					?.map((mealData) => {
						if (!mealData || !('querySelector' in mealData)) {
							return null;
						}

						const rawPrice = mealData?.querySelector('.cijena');

						if (!rawPrice) {
							return null;
						}

						const isVegetarian = mealData?.classList?.contains('food-type--vegetarijansko');
						const isVegan = mealData?.classList?.contains('food-type--vegetarijansko');

						let parsedPrice = rawPrice?.innerText?.trim();

						// € only!
						if (parsedPrice?.includes('(')) {
							parsedPrice = parsedPrice.slice(0, parsedPrice.indexOf('(')).trim();
						}

						return {
							name: mealData.querySelector('.naziv-jela')?.innerText?.trim(),
							price: parsedPrice,
							meta: {
								isVegetarian: isVegetarian,
								isVegan: isVegan,
							},
						};
					})
					.filter(Boolean)
					.filter(({ name, price }) => Boolean(name) && Boolean(price)),
			};

			if (output.name?.length < 1 || output.slug?.length < 1 || output.meals?.length < 1) {
				return null;
			}

			return output;
		})
		.filter(Boolean);

	return restaurantData;
};
