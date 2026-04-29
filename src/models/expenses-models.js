import { connectionQuery } from "../helpers/index.js";
import { DatabaseError } from "../utils/error-utils.js";

export const getAllExpensesModel = async (limit, offset, isShared, filters = {}) => {
	try {
		const { year, month, type, name } = filters;
		const conditions = [];
		const queryParams = [];
		const countParams = [];

		if (isShared) {
			"Aqui lo que debes de hacer es que el usuario va poder ver dos vistas diferentes, la acumulada y la que no es acumulada"
		}

		if (year) {
			conditions.push("YEAR(closing_date) = ?");
			queryParams.push(Number(year));
			countParams.push(Number(year));
		}

		if (month) {
			conditions.push("MONTH(closing_date) = ?");
			queryParams.push(Number(month));
			countParams.push(Number(month));
		}

		if (type) {
			conditions.push("mctg.type = ?");
			queryParams.push(type);
			countParams.push(type);
		}

		if (name) {
			conditions.push("mctg.name COLLATE utf8mb4_general_ci LIKE ?");
			queryParams.push(`%${name}%`);
			countParams.push(`%${name}%`);
		}

		const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

		let dataQuery = "";
		let countQuery = "";

		if (isShared) {
			dataQuery = `
				SELECT 
					mvt.movements_category_id,
					mctg.name,
					mctg.type,
					SUM(mvt.amount) AS total_amount,

					JSON_ARRAYAGG(
						JSON_OBJECT(
							'id', cs.car_id,
							'brand', cs.brand,
							'model', cs.model,
							'color', cs.color,
							'year', cs.year_of_car,
							'status', cs.status
						)
					) AS cars

				FROM bazar_autos.movements AS mvt

				LEFT JOIN movements_category AS mctg 
					ON mctg.category_id = mvt.movements_category_id

				LEFT JOIN cars AS cs 
					ON cs.car_id = mvt.car_id

				${whereClause}

				GROUP BY 
					mvt.movements_category_id, 
					mctg.name, 
					mctg.type

				ORDER BY total_amount DESC
				LIMIT ? OFFSET ?
			`;

			countQuery = `
				SELECT COUNT(DISTINCT mvt.movements_category_id) AS total
				FROM bazar_autos.movements AS mvt
				LEFT JOIN movements_category AS mctg 
					ON mctg.category_id = mvt.movements_category_id
				${whereClause}
			`;
		} else {
			dataQuery = `
                SELECT 
                    mvt.movements_id,
                    mvt.movements_category_id,
                    mvt.car_id,
                    mvt.type AS movement_type,
                    mvt.amount,
                    mvt.description,
                    mvt.closing_date,

                    mctg.name AS category_name,
                    mctg.type AS category_type,

                    cs.brand,
                    cs.model,
                    cs.color,
                    cs.year_of_car,
                    cs.status
                FROM bazar_autos.movements AS mvt
                LEFT JOIN movements_category AS mctg 
                    ON mctg.category_id = mvt.movements_category_id
                LEFT JOIN cars AS cs 
                    ON cs.car_id = mvt.car_id
                ${whereClause}
                ORDER BY mvt.closing_date DESC
                LIMIT ? OFFSET ?
            `;

			countQuery = `
                SELECT COUNT(*) AS total
                FROM bazar_autos.movements AS mvt
                LEFT JOIN movements_category AS mctg 
                    ON mctg.category_id = mvt.movements_category_id
                ${whereClause}
            `;
		}

		queryParams.push(limit, offset);

		const rows = await connectionQuery(dataQuery, queryParams);
		const countResult = await connectionQuery(countQuery, countParams);

		const total = countResult[0]?.total || 0;

		let formattedRows;

		if (isShared) {
			formattedRows = rows.map((row) => {
				let cars = [];

				try {
					if (!row.cars) {
						cars = [];
					} else if (typeof row.cars === "string") {
						cars = JSON.parse(row.cars);
					} else if (Array.isArray(row.cars)) {
						cars = row.cars;
					}

					const unique = new Map();

					cars.forEach((car) => {
						if (!car || !car.id) return;

						if (!unique.has(car.id)) {
							unique.set(car.id, car);
						}
					});

					cars = Array.from(unique.values());

				} catch {
					cars = [];
				}

				return {
					category: {
						id: row.movements_category_id,
						name: row.name,
						type: row.type,
					},
					cars,
					total: Number(row.total_amount),
				};
			});
		} else {
			formattedRows = rows.map((row) => ({
				movement: {
					id: row.movements_id,
					type: row.movement_type,
					amount: Number(row.amount),
					description: row.description,
					closing_date: row.closing_date,
				},
				category: {
					id: row.movements_category_id,
					name: row.category_name,
					type: row.category_type,
				},
				car: row.car_id
					? {
						id: row.car_id,
						brand: row.brand,
						model: row.model,
						color: row.color,
						year: row.year_of_car,
						status: row.status,
					}
					: null,
			}));
		}

		return {
			rows: formattedRows,
			total
		};

	} catch (error) {
		throw new DatabaseError("Error al obtener los gastos de la base de datos", {
			context: "getAllExpensesModel",
			metadata: { originalError: error.message },
		});
	}
};

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
