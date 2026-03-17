import { generateUUID } from "../helpers/index.js";
import { pool } from "../lib/db.js";
import { getModelsFromDBCarsModel } from "../models/cars-models.js";
import { DatabaseError, NotFoundError } from "../utils/error-utils.js";

export const getModelsByCarsService = async () => {
	const models = await getModelsFromDBCarsModel();

	if (!models || models.length === 0) {
		throw new NotFoundError("No se encontraron modelos de autos registrados.");
	}

	return models;
};

export const postInsertCarService = async (carData) => {
	const connection = await pool.getConnection();

	try {
		await connection.beginTransaction();

		const carId = generateUUID();
		const { costs, ...carInfo } = carData;

		const carQuery = `INSERT INTO cars (car_id, brand, model, year_of_car, color, purchase_date, sale_date, status, purchase_price, price_for_sale) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

		await connection.execute(carQuery, [
			carId,
			carInfo.brand,
			carInfo.model,
			carInfo.year_of_car,
			carInfo.color,
			carInfo.purchase_date,
			carInfo.sale_date || null,
			carInfo.status,
			carInfo.purchase_price,
			carInfo.price_for_sale || null,
		]);

		if (costs && costs.length > 0) {
			const costQuery = `INSERT INTO car_costs (cost_id, car_id, cost_type, amount, note) VALUES (?, ?, ?, ?, ?)`;

			for (const cost of costs) {
				await connection.execute(costQuery, [
					generateUUID(),
					carId,
					cost.cost_type,
					cost.amount,
					cost.note || null,
				]);
			}
		}

		await connection.commit();
		return { message: "Auto y costos registrados con éxito" };
	} catch (error) {
		await connection.rollback();
		throw new DatabaseError(
			"Error al procesar la transacción del vehículo en la base de datos",
			{
				context: "postInsertCarService",
				metadata: {
					sqlMessage: error.sqlMessage,
					code: error.code,
				},
			},
		);
	} finally {
		connection.release();
	}
};
