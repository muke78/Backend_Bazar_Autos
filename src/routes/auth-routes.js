import express from "express";
import { config } from "../config/config.js";
import { methodOK } from "../server/methods-server.js";
import { AuthError } from "../utils/error-utils.js";
import { Login } from "../controllers/auth-controllers.js";
import { validationFields } from "../middlewares/validation-middlewares.js";
import { schemaAuthUserValidations } from "../schemas/auth-schemas.js";
import { createToken, createRefreshToken, verifyRefreshToken } from "../helpers/index.js";

const auth = express.Router();

const cookieOptions = (maxAge) => ({
	httpOnly: true,
	secure: config.nodeEnv === "production",
	sameSite: "strict",
	maxAge,
});

// POST /api/auth/login
auth.post(
	"/login",
	validationFields(schemaAuthUserValidations, "body"),
	async (request, response, next) => {
		try {
			const userData = request.body;
			const { accessToken, refreshToken } = await Login(userData);

			response.cookie("access_token", accessToken, cookieOptions(config.cookie.cookieMaxAge));
			response.cookie("refresh_token", refreshToken, cookieOptions(config.cookie.refreshCookieMaxAge));

			methodOK(request, response, undefined, "Sesion iniciada correctamente");
		} catch (error) {
			next(error);
		}
	},
);

// POST /api/auth/refresh
auth.post("/refresh", async (request, response, next) => {
	try {
		const token = request.cookies?.refresh_token;

		if (!token) throw new AuthError("No se encontró refresh token activo");

		const decoded = verifyRefreshToken(token);
		const payload = { user_id: decoded.user_id };

		const newAccessToken = createToken(payload);
		const newRefreshToken = createRefreshToken(payload);

		response.cookie("access_token", newAccessToken, cookieOptions(config.cookie.cookieMaxAge));
		response.cookie("refresh_token", newRefreshToken, cookieOptions(config.cookie.refreshCookieMaxAge));

		methodOK(request, response, undefined, "Token renovado correctamente");
	} catch (error) {
		next(error);
	}
});

// POST /api/auth/logout
auth.post("/logout", async (request, response, next) => {
	try {
		const token = request.cookies?.access_token;

		if (!token) throw new AuthError("No se encontro una sesion activa en la cookie");

		const clearOptions = {
			httpOnly: true,
			secure: config.nodeEnv === "production",
			sameSite: "strict",
		};

		response.clearCookie("access_token", clearOptions);
		response.clearCookie("refresh_token", clearOptions);

		methodOK(request, response, undefined, "Sesión cerrada correctamente");
	} catch (error) {
		next(error);
	}
});

export { auth };
