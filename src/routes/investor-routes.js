import express from "express";
import { verifyToken } from "../middlewares/verify-jwt-middlewares.js";
import { requireRole } from "../middlewares/authorize-roles-middlewares.js";
import { validationFields } from "../middlewares/validation-middlewares.js";
import { methodCreated, methodOK } from "../server/methods-server.js";
import {
	schemaGetInvestorParams,
	schemaGetInvestorQuery,
	schemaInsertInvestor,
} from "../schemas/investor-schemas.js";
import {
	GetInvestmentsByUser,
	InsertInvestor,
} from "../controllers/investor-controllers.js";

import { transactions } from "./transactions-routes.js";

const investors = express.Router();

// GET /api/v1/investors/:user_id?year=2024&month=4
investors.get(
	"/:user_id",
	verifyToken,
	requireRole("admin"),
	validationFields(schemaGetInvestorParams, "params"),
	validationFields(schemaGetInvestorQuery, "query"),
	async (request, response, next) => {
		try {
			const { user_id } = request.params;
			const filters = request.query;

			const result = await GetInvestmentsByUser(user_id, filters);

			methodOK(request, response, result, "Consulta realizada con exito");
		} catch (error) {
			next(error);
		}
	},
);

//POST /api/investors
investors.post(
	"/",
	verifyToken,
	requireRole("admin"),
	validationFields(schemaInsertInvestor, "body"),
	async (request, response, next) => {
		try {
			const insertInvestor = request.body;
			const result = await InsertInvestor(insertInvestor);
			methodCreated(request, response, undefined, result.message);
		} catch (error) {
			next(error);
		}
	},
);

investors.use("/:investor_id/transactions", transactions);

export { investors };
