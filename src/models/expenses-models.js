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
) => {
	const query = `
        INSERT INTO movements 
            (movements_id, movements_category_id, car_id, type, amount, description) 
        VALUES (?, ?, ?, ?, ?, ?);
    `;
	const params = [
		movements_id,
		movements_category_id,
		car_id,
		type,
		amount,
		description,
	];

	return await connectionQuery(query, params);
};
