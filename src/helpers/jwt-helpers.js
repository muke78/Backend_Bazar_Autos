import jwt from "jsonwebtoken";

import { config } from "../config/config.js";
import { AuthError, NotFoundError } from "../utils/error-utils.js";

export const createToken = (payload) => {
	if (!config.jwt.secret) throw new NotFoundError("JWT_SECRET no definido en variables de entorno");
	if (!config.jwt.expiresIn) throw new NotFoundError("JWT_EXPIRES_IN no definido en variables de entorno");
	return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

export const createRefreshToken = (payload) => {
	if (!config.jwt.refreshSecret) throw new NotFoundError("JWT_SECRET_EXPAND no definido en variables de entorno");
	if (!config.jwt.refreshExpiresIn) throw new NotFoundError("JWT_REFRESH_EXPIRES_IN no definido en variables de entorno");
	return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn });
};

export const verifyRefreshToken = (token) => {
	if (!config.jwt.refreshSecret) throw new NotFoundError("JWT_SECRET_EXPAND no definido en variables de entorno");
	try {
		return jwt.verify(token, config.jwt.refreshSecret);
	} catch {
		throw new AuthError("Refresh token inválido o expirado");
	}
};
