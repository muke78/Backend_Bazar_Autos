import { connectionQuery } from "../helpers/connection-helpers.js";

export const findUserAuth = async (email) => {
	const query = `
        SELECT 
            user_id,
            password_hash
        FROM users
        WHERE email = ?
    `;
	const result = await connectionQuery(query, [email]);
	return result[0];
};
