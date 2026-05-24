import express from "express";
import { verifyToken } from "../middlewares/verify-jwt-middlewares.js";
import { validationFields } from "../middlewares/validation-middlewares.js";
import { methodCreated, methodOK } from "../server/methods-server.js";
import {
	InsertMovement,
	GetAllExpenses,
	UpdateMovement,
	DeleteMovement,
} from "../controllers/expenses-controllers.js";
import {
	schemaInsertMovement,
	schemaUpdateMovement,
	schemaDeleteMovement,
} from "../schemas/expenses-schemas.js";

const expenses = express.Router();

// GET /api/v1/expenses?limit=20&page=1&year=2026&month=1&type=Pasivo&name=Cajón
expenses.get("/", verifyToken, async (request, response, next) => {
	try {
		const { limit, page, ...filters } = request.query;
		const result = await GetAllExpenses({ limit, page }, filters);
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
			const result = await InsertMovement(request.body);
			methodCreated(request, response, undefined, result.message);
		} catch (error) {
			next(error);
		}
	},
);

// PUT /api/v1/expenses
expenses.put(
	"/",
	verifyToken,
	validationFields(schemaUpdateMovement, "body"),
	async (request, response, next) => {
		try {
			const result = await UpdateMovement(request.body);
			methodOK(request, response, undefined, result.message);
		} catch (error) {
			next(error);
		}
	},
);

// DELETE /api/v1/expenses
expenses.delete(
	"/",
	verifyToken,
	validationFields(schemaDeleteMovement, "body"),
	async (request, response, next) => {
		try {
			const result = await DeleteMovement(request.body);
			methodOK(request, response, undefined, result.message);
		} catch (error) {
			next(error);
		}
	},
);

export { expenses };
