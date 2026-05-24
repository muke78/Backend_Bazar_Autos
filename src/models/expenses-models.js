import { connectionQuery, connectionTransaction } from "../helpers/index.js";
import { DatabaseError } from "../utils/error-utils.js";

export const getAllExpensesModel = async (limit, offset, filters = {}) => {
	try {
		const { year, month, type, name } = filters;
		const conditions = [];
		const queryParams = [];
		const countParams = [];

		if (year) {
			conditions.push("YEAR(mvt.closing_date) = ?");
			queryParams.push(Number(year));
			countParams.push(Number(year));
		}

		if (month) {
			conditions.push("MONTH(mvt.closing_date) = ?");
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

		const dataQuery = `
			SELECT
				mvt.movements_category_id,
				mvt.type AS movement_type,
				mvt.description,
				mvt.closing_date,
				mctg.name AS category_name,
				mctg.type AS category_type,
				SUM(mvt.amount) AS total_amount,
				JSON_ARRAYAGG(
					JSON_OBJECT(
						'movement_id', mvt.movements_id,
						'car_id', cs.car_id,
						'brand', cs.brand,
						'model', cs.model,
						'color', cs.color,
						'year', cs.year_of_car,
						'status', cs.status,
						'amount', mvt.amount
					)
				) AS cars
			FROM movements AS mvt
			LEFT JOIN movements_category AS mctg
				ON mctg.category_id = mvt.movements_category_id
			LEFT JOIN cars AS cs
				ON cs.car_id = mvt.car_id
			${whereClause}
			GROUP BY
				mvt.movements_category_id,
				mvt.closing_date,
				mvt.description,
				mvt.type,
				mctg.name,
				mctg.type
			ORDER BY mvt.closing_date DESC
			LIMIT ? OFFSET ?
		`;

		const countQuery = `
			SELECT COUNT(*) AS total FROM (
				SELECT 1
				FROM movements AS mvt
				LEFT JOIN movements_category AS mctg
					ON mctg.category_id = mvt.movements_category_id
				${whereClause}
				GROUP BY
					mvt.movements_category_id,
					mvt.closing_date,
					mvt.description,
					mvt.type
			) AS grp;
		`;

		queryParams.push(limit, offset);

		const rows = await connectionQuery(dataQuery, queryParams);
		const countResult = await connectionQuery(countQuery, countParams);
		const total = countResult[0]?.total || 0;

		const formattedRows = rows.map((row) => {
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
					if (!car || !car.movement_id) return;
					if (!unique.has(car.movement_id)) {
						unique.set(car.movement_id, {
							...car,
							amount: Number(car.amount),
						});
					}
				});
				cars = Array.from(unique.values());
			} catch {
				cars = [];
			}

			return {
				category: {
					id: row.movements_category_id,
					name: row.category_name,
					type: row.category_type,
				},
				type: row.movement_type,
				description: row.description,
				closing_date: row.closing_date,
				cars,
				movements_ids: cars.map((c) => c.movement_id),
				total: Number(row.total_amount),
			};
		});

		return { rows: formattedRows, total };
	} catch (error) {
		throw new DatabaseError("Error al obtener los gastos de la base de datos", {
			context: "getAllExpensesModel",
			metadata: { originalError: error.message },
		});
	}
};

export const findMovementsByIdsModel = async (ids) => {
	try {
		const placeholders = ids.map(() => "?").join(",");
		const query = `SELECT movements_id FROM movements WHERE movements_id IN (${placeholders});`;
		return await connectionQuery(query, ids);
	} catch (error) {
		throw new DatabaseError("Error al buscar los movimientos por ID", {
			context: "findMovementsByIdsModel",
			metadata: { originalError: error.message },
		});
	}
};

export const insertMovementsBulkModel = async (rows) => {
	try {
		if (!rows.length) return { affectedRows: 0 };

		const placeholders = rows.map(() => "(?, ?, ?, ?, ?, ?, ?)").join(", ");
		const params = rows.flatMap((r) => [
			r.movements_id,
			r.movements_category_id,
			r.car_id,
			r.type,
			r.amount,
			r.description,
			r.closing_date,
		]);

		const query = `
			INSERT INTO movements
				(movements_id, movements_category_id, car_id, type, amount, description, closing_date)
			VALUES ${placeholders};
		`;

		return await connectionQuery(query, params);
	} catch (error) {
		throw new DatabaseError("Error al registrar los movimientos en la base de datos", {
			context: "insertMovementsBulkModel",
			metadata: { originalError: error.message },
		});
	}
};

export const replaceMovementsModel = async (oldIds, newRows) => {
	try {
		return await connectionTransaction(async (query) => {
			if (oldIds.length > 0) {
				const placeholders = oldIds.map(() => "?").join(",");
				await query(
					`DELETE FROM movements WHERE movements_id IN (${placeholders});`,
					oldIds,
				);
			}

			if (newRows.length > 0) {
				const valuesPlaceholders = newRows.map(() => "(?, ?, ?, ?, ?, ?, ?)").join(", ");
				const params = newRows.flatMap((r) => [
					r.movements_id,
					r.movements_category_id,
					r.car_id,
					r.type,
					r.amount,
					r.description,
					r.closing_date,
				]);

				await query(
					`INSERT INTO movements
						(movements_id, movements_category_id, car_id, type, amount, description, closing_date)
					 VALUES ${valuesPlaceholders};`,
					params,
				);
			}

			return { deleted: oldIds.length, inserted: newRows.length };
		});
	} catch (error) {
		throw new DatabaseError("Error al reemplazar los movimientos del grupo", {
			context: "replaceMovementsModel",
			metadata: { originalError: error.message },
		});
	}
};

export const deleteMovementsModel = async (ids) => {
	try {
		const placeholders = ids.map(() => "?").join(",");
		const query = `DELETE FROM movements WHERE movements_id IN (${placeholders});`;
		return await connectionQuery(query, ids);
	} catch (error) {
		throw new DatabaseError("Error al eliminar los movimientos", {
			context: "deleteMovementsModel",
			metadata: { originalError: error.message },
		});
	}
};
