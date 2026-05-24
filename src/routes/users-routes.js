import express from "express";
import { verifyToken } from "../middlewares/verify-jwt-middlewares.js";
import { requireRole } from "../middlewares/authorize-roles-middlewares.js";
import {
	DeleteUser,
	GetFullNameUser,
	GetProfile,
	InsertUsers,
	UpdateUser,
} from "../controllers/users-controllers.js";
import { methodCreated, methodOK } from "../server/methods-server.js";
import { validationFields } from "../middlewares/validation-middlewares.js";
import {
	schemaCreateUserValidations,
	schemaUpdateUserValidations,
} from "../schemas/users-schemas.js";
import { multiUuidSchema } from "../schemas/schemas.js";

const users = express.Router();

users.get("/", verifyToken, requireRole("admin"), async (request, response, next) => {
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
	requireRole("admin"),
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

//PUT /api/users/update/:id
users.put(
	"/:id",
	verifyToken,
	requireRole("admin"),
	validationFields(multiUuidSchema(["id"]), "params"),
	validationFields(schemaUpdateUserValidations, "body"),
	async (request, response, next) => {
		try {
			const userId = request.params.id;
			const userData = request.body;
			const result = await UpdateUser(userId, userData);
			methodOK(
				request,
				response,
				result,
				"El usuario se actualizo correctamente",
			);
		} catch (error) {
			next(error);
		}
	},
);

//DELETE /api/users/delete/:id
users.delete(
	"/:id",
	verifyToken,
	requireRole("admin"),
	validationFields(multiUuidSchema(["id"]), "params"),
	async (request, response, next) => {
		try {
			const userId = request.params.id;
			const result = await DeleteUser(userId);
			methodOK(
				request,
				response,
				undefined,
				`El usuario ${result.username} fue eliminado correctamente`,
			);
		} catch (error) {
			next(error);
		}
	},
);

export { users };
