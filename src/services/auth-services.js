import { AuthError, NotFoundError } from "../utils/error-utils.js";

import {
	// findUserAuth,
	createToken,
	lastLogin,
	verifyHashedPassword,
} from "../helpers/index.js";
import { findUserAuth } from "../functions/find-user-auth.helper.js";

export const loginService = async ({ email, password }) => {
	const user = await findUserAuth(email);

	if (!user) throw new NotFoundError("El usuario no ha podido ser encontrado");

	const isPasswordValid = await verifyHashedPassword(
		user.password_hash,
		password,
	);

	if (!isPasswordValid)
		throw new AuthError("La contraseña es incorrecta o esta mal escrita");

	const token = createToken({
		user_id: user.user_id,
	});

	await lastLogin(user.user_id);

	return token;
};
