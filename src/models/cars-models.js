import { connectionQuery } from "../helpers/index.js";
import { DatabaseError } from "../utils/error-utils.js";

export const getAllCarsModel = async (limit, offset, search) => {
	try {
        let whereClause = "";
        const queryParams = [];
        const countParams = [];

        // Si hay búsqueda, armamos la condición
        if (search) {
            whereClause = "WHERE brand LIKE ? OR model LIKE ?";
            const searchTerm = `%${search}%`;
            
            queryParams.push(searchTerm, searchTerm);
            countParams.push(searchTerm, searchTerm);
        }

        // Joi ya garantizó que limit y offset son enteros, los agregamos directo
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
        throw new DatabaseError(
            "Error al obtener los carros de la base de datos",
            {
                context: "getAllCarsModel",
                metadata: { originalError: error.message },
            },
        );
    }
};

export const getCarByIdModel = async (carId) => {
	try {
		const query = `SELECT car_id FROM cars WHERE car_id = ?`;
		const rows = await connectionQuery(query, [carId]);
		return rows;
	} catch (error) {
		throw new DatabaseError(
			"Error al buscar el carro en la base de datos",
			{
				context: "getCarByIdModel",
				metadata: { originalError: error.message },
			},
		);
	}
};

export const getModelsFromDBCarsModel = async () => {
	try {
		const query = `
            SELECT 
                MIN(car_id) AS id, model AS name
            FROM
                cars
            GROUP BY model
            ORDER BY model ASC;
        `;

		const rows = await connectionQuery(query);
		return rows;
	} catch (error) {
		throw new DatabaseError(
			"Error al obtener los modelos de la base de datos",
			{
				context: "getModelsFromDBCarsModel",
				metadata: { originalError: error.message },
			},
		);
	}
};
