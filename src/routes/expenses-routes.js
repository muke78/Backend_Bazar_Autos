import express from "express";
import { verifyToken } from "../middlewares/verify-jwt-middlewares.js";
import { validationFields } from "../middlewares/validation-middlewares.js";
import { methodCreated, methodOK } from "../server/methods-server.js";
import {
	InsertMovement,
	GetMovementCategories,
} from "../controllers/expenses-controllers.js";
import { schemaInsertMovement } from "../schemas/expenses-schemas.js";

const expenses = express.Router();

// GET /api/v1/expenses/categories
expenses.get("/categories", verifyToken, async (request, response, next) => {
	try {
		const result = await GetMovementCategories();
		methodOK(request, response, result);
	} catch (error) {
		next(error);
	}
});

// POST /api/v1/expenses
expenses.post(
	"/",
	verifyToken,
	validationFields(schemaInsertMovement, "body"),
	async (request, response, next) => {
		try {
			const movementData = request.body;
			const result = await InsertMovement(movementData);
			methodCreated(request, response, undefined, result.message);
		} catch (error) {
			next(error);
		}
	},
);

export { expenses };
