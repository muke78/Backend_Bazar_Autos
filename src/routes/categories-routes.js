import express from "express";
import { verifyToken } from "../middlewares/verify-jwt-middlewares.js";
import { requireRole } from "../middlewares/authorize-roles-middlewares.js";
import { validationFields } from "../middlewares/validation-middlewares.js";
import { methodCreated, methodOK } from "../server/methods-server.js";
import {
	GetAllCategories,
	InsertCategory,
	UpdateCategory,
	DeleteCategory,
} from "../controllers/categories-controllers.js";
import {
	schemaCreateCategory,
	schemaUpdateCategory,
} from "../schemas/categories-schemas.js";
import { multiUuidSchema } from "../schemas/schemas.js";

const categories = express.Router();

// GET /api/v1/categories
categories.get("/", verifyToken, async (request, response, next) => {
	try {
		const result = await GetAllCategories();
		methodOK(request, response, result);
	} catch (error) {
		next(error);
	}
});

// POST /api/v1/categories
categories.post(
	"/",
	verifyToken,
	requireRole("admin"),
	validationFields(schemaCreateCategory, "body"),
	async (request, response, next) => {
		try {
			const result = await InsertCategory(request.body);
			methodCreated(request, response, result.category, result.message);
		} catch (error) {
			next(error);
		}
	},
);

// PUT /api/v1/categories/:id
categories.put(
	"/:id",
	verifyToken,
	requireRole("admin"),
	validationFields(multiUuidSchema(["id"]), "params"),
	validationFields(schemaUpdateCategory, "body"),
	async (request, response, next) => {
		try {
			const categoryId = request.params.id;
			const result = await UpdateCategory(categoryId, request.body);
			methodOK(request, response, undefined, result.message);
		} catch (error) {
			next(error);
		}
	},
);

// DELETE /api/v1/categories/:id
categories.delete(
	"/:id",
	verifyToken,
	requireRole("admin"),
	validationFields(multiUuidSchema(["id"]), "params"),
	async (request, response, next) => {
		try {
			const categoryId = request.params.id;
			const result = await DeleteCategory(categoryId);
			methodOK(request, response, undefined, result.message);
		} catch (error) {
			next(error);
		}
	},
);

export { categories };
