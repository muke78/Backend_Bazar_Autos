import { connectionQuery } from "../helpers/index.js";
import { DatabaseError } from "../utils/error-utils.js";

export const getAllCategoriesModel = async () => {
	try {
		const query = `SELECT category_id, name, type FROM movements_category ORDER BY name ASC;`;
		return await connectionQuery(query);
	} catch (error) {
		throw new DatabaseError("Error al obtener las categorías de movimientos", {
			context: "getAllCategoriesModel",
			metadata: { originalError: error.message },
		});
	}
};

export const getCategoryByIdModel = async (categoryId) => {
	try {
		const query = `SELECT category_id, name, type FROM movements_category WHERE category_id = ?;`;
		return await connectionQuery(query, [categoryId]);
	} catch (error) {
		throw new DatabaseError("Error al obtener la categoría", {
			context: "getCategoryByIdModel",
			metadata: { originalError: error.message },
		});
	}
};

export const getCategoryByNameModel = async (name) => {
	try {
		const query = `SELECT category_id, name, type FROM movements_category WHERE name = ?;`;
		return await connectionQuery(query, [name]);
	} catch (error) {
		throw new DatabaseError("Error al buscar la categoría por nombre", {
			context: "getCategoryByNameModel",
			metadata: { originalError: error.message },
		});
	}
};

export const insertCategoryModel = async (categoryId, name, type) => {
	try {
		const query = `INSERT INTO movements_category (category_id, name, type) VALUES (?, ?, ?);`;
		return await connectionQuery(query, [categoryId, name, type]);
	} catch (error) {
		throw new DatabaseError("Error al registrar la categoría", {
			context: "insertCategoryModel",
			metadata: { originalError: error.message, sqlMessage: error.sqlMessage, code: error.code },
		});
	}
};

export const updateCategoryModel = async (categoryId, payload) => {
	try {
		const fields = [];
		const params = [];

		if (payload.name !== undefined) {
			fields.push("name = ?");
			params.push(payload.name);
		}

		if (payload.type !== undefined) {
			fields.push("type = ?");
			params.push(payload.type);
		}

		params.push(categoryId);

		const query = `UPDATE movements_category SET ${fields.join(", ")} WHERE category_id = ?;`;
		return await connectionQuery(query, params);
	} catch (error) {
		throw new DatabaseError("Error al actualizar la categoría", {
			context: "updateCategoryModel",
			metadata: { originalError: error.message, sqlMessage: error.sqlMessage, code: error.code },
		});
	}
};

export const deleteCategoryModel = async (categoryId) => {
	try {
		const query = `DELETE FROM movements_category WHERE category_id = ?;`;
		return await connectionQuery(query, [categoryId]);
	} catch (error) {
		throw new DatabaseError("Error al eliminar la categoría", {
			context: "deleteCategoryModel",
			metadata: { originalError: error.message, sqlMessage: error.sqlMessage, code: error.code },
		});
	}
};

export const countMovementsByCategoryModel = async (categoryId) => {
	try {
		const query = `SELECT COUNT(*) AS total FROM movements WHERE movements_category_id = ?;`;
		const result = await connectionQuery(query, [categoryId]);
		return result[0]?.total || 0;
	} catch (error) {
		throw new DatabaseError("Error al contar los movimientos asociados a la categoría", {
			context: "countMovementsByCategoryModel",
			metadata: { originalError: error.message },
		});
	}
};
