import jwt from "jsonwebtoken";

import { config } from "../config/config.js";
import { NotFoundError } from "../utils/error-utils.js";

export const createToken = (user) => {
	const payload = {
		user_id: user.user_id,
		role: user.role,
	};

	if (!config.jwt.expiresIn) {
		throw new NotFoundError(
			"El tiempo de expiración no está definido en las variables de entorno",
		);
	}

	if (!config.jwt.secret) {
		throw new NotFoundError(
			"El secreto JWT no está definido en las variables de entorno",
		);
	}

	return jwt.sign(payload, config.jwt.secret, {
		expiresIn: config.jwt.expiresIn,
	});
};
