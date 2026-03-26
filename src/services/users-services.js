import { findUserByEmailOrUsername } from "../functions/find-user-by-email-username.functions.js";
import { generateUUID, hashedPassword } from "../helpers/index.js";
import {
	insertUserModel,
	listGetFullNameUserModels,
	listProfileModel,
} from "../models/users-models.js";
import { ConflictError, DatabaseError, NotFoundError } from "../utils/error-utils.js";

export const listGetFullNameUserService = async () => {
	const names = await listGetFullNameUserModels();

	if (!names || names.length === 0) {
		throw new NotFoundError("No se encontraron usuarios registrados");
	}

	return names;
};

export const listProfileService = async (user_id) => {
	const result = await listProfileModel(user_id);
	return result;
};

export const insertUserService = async ({
	username,
	password,
	full_name,
	email,
}) => {
	try {
		const existingUser = await findUserByEmailOrUsername(email, username);

		if (existingUser) {
			const conflictField = existingUser.email === email ? "correo" : "nombre de usuario";
			throw new ConflictError(`El ${conflictField} ya se encuentra registrado`);
		}

		const hashPassword = await hashedPassword(password);

		const newUserId = generateUUID();

		await insertUserModel(newUserId, username, hashPassword, full_name, email);

		return { message: "Usuario registrado con exito" };
	} catch (error) {
		if (error instanceof ConflictError) throw error;

		throw new DatabaseError("Error al guardar un usuario en la base de datos", {
			context: "insertUserService",
			metadata: {
				sqlMessage: error.sqlMessage,
				code: error.code,
			},
		});
	}
};
