import { connectionQuery } from "../helpers/index.js";
import { DatabaseError } from "../utils/error-utils.js";

export const getMovementCategoriesModel = async () => {
	try {
		const query = `SELECT category_id, name, type FROM movements_category ORDER BY name ASC;`;
		return await connectionQuery(query);
	} catch (error) {
		throw new DatabaseError("Error al obtener las categorías de movimientos", {
			context: "getMovementCategoriesModel",
			metadata: { originalError: error.message },
		});
	}
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
	try {
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
	} catch (error) {
		throw new DatabaseError("Error al registrar el movimiento en la base de datos", {
			context: "insertMovementModel",
			metadata: { originalError: error.message },
		});
	}
};
