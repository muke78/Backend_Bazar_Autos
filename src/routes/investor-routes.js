import express from "express";
import { verifyToken } from "../middlewares/verify-jwt-middlewares.js";
import { validationFields } from "../middlewares/validation-middlewares.js";
import { methodCreated } from "../server/methods-server.js";
import { schemaInsertInvestor } from "../schemas/investor-schemas.js";
import { InsertInvestor } from "../controllers/investor-controllers.js";

const investors = express.Router();

//POST /api/investors
investors.post(
	"/",
	verifyToken,
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

export { investors };
