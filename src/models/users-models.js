import { connectionQuery } from "../helpers/index.js";
import { DatabaseError, FieldsRequiredError } from "../utils/error-utils.js";

export const listGetFullNameUserModels = async () => {
	try {
		const query = `
        SELECT 
            user_id AS id, 
			full_name AS name,
			username,
			email,
			role
        FROM
            users;`;
		return await connectionQuery(query);
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

export const listProfileModel = async (user_id) => {
	try {
		const query = `SELECT 
                        user_id,
                        username,
                        full_name,
                        email,
						role,
                        last_login,
                        created,
                        updated
                    FROM users
                    WHERE user_id = ?;`;
		const params = [user_id];
		return await connectionQuery(query, params);
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

export const updateUserModel = async (payload) => {
	const { username, full_name, email, password, role, user_id } = payload;

	const fields = [];
	const params = [];

	if (username !== undefined) {
		fields.push("username = ?");
		params.push(username);
	}

	if (full_name !== undefined) {
		fields.push("full_name = ?");
		params.push(full_name);
	}

	if (email !== undefined) {
		fields.push("email = ?");
		params.push(email);
	}

	if (password !== undefined) {
		fields.push("password_hash = ?");
		params.push(password);
	}

	if (role !== undefined) {
		fields.push("role = ?");
		params.push(role);
	}

	if (fields.length === 0) {
		throw new FieldsRequiredError("No se enviaron campos para actualizar");
	}

	params.push(user_id);

	const query = `
        UPDATE users
        SET ${fields.join(", ")}
        WHERE user_id = ?;
    `;

	return await connectionQuery(query, params);
};

export const insertUserModel = async (
	newUserId,
	username,
	hashPassword,
	full_name,
	email,
	role = "user",
) => {
	const query = `INSERT INTO users (user_id, username, password_hash, full_name, email, role)
                       VALUES (?, ?, ?, ?, ?, ?);`;
	const params = [newUserId, username, hashPassword, full_name, email, role];

	return await connectionQuery(query, params);
};

export const deleteUserModel = async (userId) => {
	const query = `DELETE FROM users WHERE user_id = ?`;
	const params = [userId];
	return await connectionQuery(query, params);
};
