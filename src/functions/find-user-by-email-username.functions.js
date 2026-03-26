import { connectionQuery } from "../helpers/index.js";

export const findUserByEmailOrUsername = async (email, username) => {
	const query = `
        SELECT user_id, username, email
        FROM users
        WHERE email = ? OR username = ?
        LIMIT 1
    `;
	const result = await connectionQuery(query, [email, username]);
	return result[0];
};
