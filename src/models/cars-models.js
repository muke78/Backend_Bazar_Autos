import { connectionQuery } from "../helpers/index.js";
import { DatabaseError } from "../utils/error-utils.js";

export const getAllCarsModel = async (limit, offset, search, filters = {}) => {
	try {
		const { year, month } = filters;
		const conditions = [];
		const queryParams = [];
		const countParams = [];

		if (search) {
			const searchTerm = `%${search}%`;
			conditions.push("(brand LIKE ? OR model LIKE ?)");
			queryParams.push(searchTerm, searchTerm);
			countParams.push(searchTerm, searchTerm);
		}

		if (year) {
			conditions.push("YEAR(purchase_date) = ?");
			queryParams.push(Number(year));
			countParams.push(Number(year));
		}

		if (month) {
			conditions.push("MONTH(purchase_date) = ?");
			queryParams.push(Number(month));
			countParams.push(Number(month));
		}

		const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

		queryParams.push(limit, offset);

		const dataQuery = `
            SELECT
                car_id,
                brand,
                model,
                year_of_car,
                CONCAT('$', FORMAT(purchase_price, 2)) AS purchase_price,
                CONCAT('$', FORMAT(price_for_sale, 2)) AS price_for_sale,
                purchase_date,
                YEAR(purchase_date) AS año,
                MONTH(purchase_date) AS mes,
                DAY(purchase_date) AS dia,
                created
            FROM
                cars
            ${whereClause}
            ORDER BY purchase_date DESC
            LIMIT ? OFFSET ?;
        `;

		const countQuery = `SELECT COUNT(*) AS total FROM cars ${whereClause};`;

		const [rows, countResult] = await Promise.all([
			connectionQuery(dataQuery, queryParams),
			connectionQuery(countQuery, countParams),
		]);

		const total = countResult[0]?.total || 0;

		return { rows, total };
	} catch (error) {
		throw new DatabaseError("Error al obtener los carros de la base de datos", {
			context: "getAllCarsModel",
			metadata: { originalError: error.message },
		});
	}
};

export const getCarByIdModel = async (carId) => {
	try {
		const query = `SELECT car_id FROM cars WHERE car_id = ?`;
		const rows = await connectionQuery(query, [carId]);
		return rows;
	} catch (error) {
		throw new DatabaseError("Error al buscar el carro en la base de datos", {
			context: "getCarByIdModel",
			metadata: { originalError: error.message },
		});
	}
};

export const getCarBrandAndModelById = async (carId) => {
	try {
		const query = `SELECT car_id, CONCAT(brand, ' ', model) AS full_name FROM cars WHERE car_id = ?`;
		const rows = await connectionQuery(query, [carId]);
		return rows;
	} catch (error) {
		throw new DatabaseError("Error al recolectar la marca y el nombre del carro", {
			context: "getCarBrandAndModelById",
			metadata: { originalError: error.message },
		});
	}
};

export const getModelsFromDBCarsModel = async () => {
	try {
		const query = `
            SELECT
                MIN(car_id) AS id,
                brand,
                model AS name,
                CONCAT(brand, ' ', model) AS full_name
            FROM
                cars
            GROUP BY brand, model
            ORDER BY brand ASC, model ASC;
        `;

		const rows = await connectionQuery(query);
		return rows;
	} catch (error) {
		throw new DatabaseError("Error al obtener los modelos de la base de datos", {
			context: "getModelsFromDBCarsModel",
			metadata: { originalError: error.message },
		});
	}
};

export const deleteCarModel = async (carId) => {
	try {
		const query = `DELETE FROM cars WHERE car_id = ?`;
		await connectionQuery(query, [carId]);
	} catch (error) {
		throw new DatabaseError("Error al eliminar el carro de la base de datos", {
			context: "deleteCarModel",
			metadata: { originalError: error.message },
		});
	}
};

export const getModelsInInventoryModel = async () => {
	try {
		const query = `
            SELECT
                car_id AS id,
                brand,
                model AS name,
                year_of_car,
                CONCAT(brand, ' ', model) AS full_name
            FROM
                cars
            WHERE
                status = 'Inventario'
            ORDER BY brand ASC, model ASC;
        `;

		const rows = await connectionQuery(query);
		return rows;
	} catch (error) {
		throw new DatabaseError("Error al obtener los modelos en inventario", {
			context: "getModelsInInventoryModel",
			metadata: { originalError: error.message },
		});
	}
};
