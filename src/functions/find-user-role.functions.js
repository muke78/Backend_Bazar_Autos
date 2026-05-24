import { connectionQuery } from "../helpers/index.js";

/**
 * Obtiene solo el rol de un usuario por su user_id.
 * Usado por el middleware requireRole para no inflar el JWT.
 * @param {string} user_id
 * @returns {{ role: string } | null}
 */
export const findUserRole = async (user_id) => {
	const query = `SELECT role FROM users WHERE user_id = ? LIMIT 1`;
	const result = await connectionQuery(query, [user_id]);
	return result[0] ?? null;
};
