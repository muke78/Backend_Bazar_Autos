import { connectionQuery } from "../helpers/index.js";

export const getMovementCategoriesModel = async () => {
	const query = `SELECT category_id, name, type FROM movements_category ORDER BY name ASC;`;
	return await connectionQuery(query);
};

export const insertMovementModel = async (
	movements_id,
	movements_category_id,
	car_id,
	type,
	amount,
	description,
	closing_date,
) => {
	const query = `
        INSERT INTO movements 
            (movements_id, movements_category_id, car_id, type, amount, description, closing_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
	const params = [
		movements_id,
		movements_category_id,
		car_id,
		type,
		amount,
		description,
		closing_date,
	];

	return await connectionQuery(query, params);
};
