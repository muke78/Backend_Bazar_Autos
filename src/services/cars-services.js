import { connectionTransaction, generateUUID } from "../helpers/index.js";
import {
	deleteCarModel,
	getAllCarsModel,
	getCarBrandAndModelById,
	getCarByIdModel,
	getModelsFromDBCarsModel,
	getModelsInInventoryModel,
} from "../models/cars-models.js";
import { DatabaseError, NotFoundError } from "../utils/error-utils.js";

export const getAllCarsService = async (pagination, filters = {}) => {
	const { search, year, month } = filters;
	const limit = Number(pagination.limit) > 0 ? Number(pagination.limit) : 20;
	const page = Number(pagination.page) > 0 ? Number(pagination.page) : 1;

	const offset = (page - 1) * limit;

	const { rows, total } = await getAllCarsModel(limit, offset, search, { year, month });

	if (!rows || rows.length === 0) {
		throw new NotFoundError("No se encontraron carros registrados.");
	}

	const totalPages = Math.ceil(total / limit);

	return {
		filters: {
			search: search || null,
			year: year || null,
			month: month || null,
		},
		rows,
		pagination: {
			total,
			totalPages,
			currentPage: page,
			limit,
			hasNextPage: page < totalPages,
			hasPrevPage: page > 1,
		},
	};
};

export const getModelsByCarsService = async () => {
	const models = await getModelsFromDBCarsModel();

	if (!models || models.length === 0) {
		throw new NotFoundError("No se encontraron modelos de autos registrados.");
	}

	return models;
};

export const getModelsInInventoryService = async () => {
	const models = await getModelsInInventoryModel();

	if (!models || models.length === 0) {
		throw new NotFoundError("No hay modelos disponibles en inventario.");
	}

	return models;
};

export const postInsertCarService = async (carData) => {
	try {
		return await connectionTransaction(async (query) => {
			const carId = generateUUID();
			const { costs, ...carInfo } = carData;

			const carQuery = `INSERT INTO cars (car_id, brand, model, year_of_car, color, purchase_date, sale_date, status, purchase_price, price_for_sale)
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

			await query(carQuery, [
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
					await query(costQuery, [
						generateUUID(),
						carId,
						cost.cost_type,
						cost.amount,
						cost.note || null,
					]);
				}
			}

			return { message: "Auto y costos registrados con éxito" };
		});
	} catch (error) {
		if (error.statusCode) throw error;

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
	}
};

export const updateCarService = async (carId, carData) => {
	const car = await getCarByIdModel(carId);

	if (!car || car.length === 0) {
		throw new NotFoundError("No se encontró el carro con el ID proporcionado.");
	}

	try {
		return await connectionTransaction(async (query) => {
			const { costs, ...carInfo } = carData;

			if (carInfo.sale_date === "") carInfo.sale_date = null;
			if (carInfo.purchase_date === "") carInfo.purchase_date = null;
			if (carInfo.price_for_sale === "") carInfo.price_for_sale = null;

			if (Object.keys(carInfo).length > 0) {
				const columns = Object.keys(carInfo);
				const values = Object.values(carInfo);
				const fields = columns.map((col) => `${col} = ?`).join(", ");
				const updateQuery = `UPDATE cars SET ${fields} WHERE car_id = ?`;
				await query(updateQuery, [...values, carId]);
			}

			if (costs && costs.length > 0) {
				const updateCostQuery = `UPDATE car_costs SET amount = ?, note = ? WHERE car_id = ? AND cost_type = ?`;

				for (const cost of costs) {
					await query(updateCostQuery, [
						cost.amount,
						cost.note || null,
						carId,
						cost.cost_type,
					]);
				}
			}

			return { message: "Carro actualizado con éxito" };
		});
	} catch (error) {
		if (error.statusCode) throw error;

		throw new DatabaseError(
			"Error al procesar la actualización del vehículo en la base de datos",
			{
				context: "updateCarService",
				metadata: {
					sqlMessage: error.sqlMessage,
					code: error.code,
				},
			},
		);
	}
};

export const deleteCarService = async (carId) => {
	try {
		const car = await getCarBrandAndModelById(carId);

		if (car.length === 0) {
			throw new NotFoundError("No se pudo encontrar el carro");
		}

		await deleteCarModel(carId);

		return { full_name: car[0].full_name };
	} catch (error) {
		if (error.statusCode || error.name === "NotFoundError") {
			throw error;
		}

		throw new DatabaseError(
			"Error al procesar la eliminacion del vehículo en la base de datos",
			{
				context: "deleteCarService",
				metadata: {
					sqlMessage: error.sqlMessage,
					code: error.code,
				},
			},
		);
	}
};
