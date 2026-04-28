import { findUserByEmailOrUsername } from "../functions/find-user-by-email-username.functions.js";
import { findUserById } from "../functions/find-user-by-id-functions.js";
import { generateUUID, hashedPassword } from "../helpers/index.js";
import {
	deleteUserModel,
	insertUserModel,
	listGetFullNameUserModels,
	listProfileModel,
	updateUserModel,
} from "../models/users-models.js";
import {
	ConflictError,
	DatabaseError,
	NotFoundError,
} from "../utils/error-utils.js";

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
			const conflictField =
				existingUser.email === email ? "correo" : "nombre de usuario";
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

export const updateUserService = async (userId, userData) => {
	const { username, password, full_name, email } = userData;
	try {
		const existingUser = await findUserById(userId);

		if (!existingUser)
			throw new NotFoundError(
				"No se proporcionó un ID válido o el usuario no existe",
			);

		if (email && email !== existingUser.email) {
			const emailConflict = await findUserByEmailOrUsername(email, username);
			if (emailConflict) {
				throw new ConflictError("El correo ya se encuentra registrado");
			}
		}

		const updateData = { user_id: userId };

		if (username !== undefined) updateData.username = username;
		if (full_name !== undefined) updateData.full_name = full_name;
		if (email !== undefined) updateData.email = email;

		if (password && password.trim() !== "") {
			updateData.password = await hashedPassword(password);
		}

		if (Object.keys(updateData).length === 1) {
			return true;
		}

		const result = await updateUserModel(updateData);

		if (result.affectedRows === 0) {
			throw new DatabaseError(
				"No se pudo actualizar el usuario en la base de datos",
			);
		}

		return result.affectedRows > 0;
	} catch (error) {
		if (
			error instanceof NotFoundError ||
			error instanceof ConflictError ||
			error.name === "FieldsRequiredError"
		) {
			throw error;
		}
		throw new DatabaseError("Error al actualizar el usuario", {
			context: "updateUserService",
			metadata: {
				sqlMessage: error.sqlMessage,
				code: error.code,
				userId,
			},
		});
	}
};

export const deleteUserService = async (userId) => {
	try {
		const foundUserToEliminated = await findUserById(userId);

		if (foundUserToEliminated.length === 0) {
			throw new NotFoundError("El usuario no fue encontrado");
		}

		const deleteUserFromID = await deleteUserModel(userId);

		if (deleteUserFromID.affectedRows === 0) {
			throw new NotFoundError("El usuario no fue encontrado para eliminar");
		}

		return foundUserToEliminated[0];
	} catch (error) {
		throw new DatabaseError("Error al eliminar el usuario de la base de datos", {
			context: "deleteUserService",
			metadata: {
				sqlMessage: error.sqlMessage,
				code: error.code,
			},
		});
	}
};
