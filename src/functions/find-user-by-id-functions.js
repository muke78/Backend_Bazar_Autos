import { connectionQuery } from "../helpers/index.js";

export const findUserById = async (user_id) => {
	const query = `
        SELECT username, full_name, email
        FROM users
        WHERE user_id = ?
    `;
	const result = await connectionQuery(query, [user_id]);
	return result;
};
