import express from "express";
import { verifyToken } from "../middlewares/verify-jwt-middlewares.js";
import {
	GetFullNameUser,
	GetProfile,
	InsertUsers,
} from "../controllers/users-controllers.js";
import { methodCreated, methodOK } from "../server/methods-server.js";
import { validationFields } from "../middlewares/validation-middlewares.js";
import { schemaCreateUserValidations } from "../schemas/users-schemas.js";

const users = express.Router();

users.get("/", verifyToken, async (request, response, next) => {
	try {
		const result = await GetFullNameUser();
		methodOK(request, response, result);
	} catch (error) {
		next(error);
	}
});

// GET /api/users/profile
users.get("/profile", verifyToken, async (request, response, next) => {
	try {
		const { user_id } = request.user;
		const result = await GetProfile(user_id);
		methodOK(request, response, result);
	} catch (error) {
		next(error);
	}
});

// POST /api/users/create
users.post(
	"/",
	verifyToken,
	validationFields(schemaCreateUserValidations, "body"),
	async (request, response, next) => {
		try {
			const insertUser = request.body;
			const result = await InsertUsers(insertUser);
			methodCreated(request, response, undefined, result.message);
		} catch (error) {
			next(error);
		}
	},
);

export { users };
