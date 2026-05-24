import express from "express";
import { verifyToken } from "../middlewares/verify-jwt-middlewares.js";
import { validationFields } from "../middlewares/validation-middlewares.js";
import { methodOK } from "../server/methods-server.js";
import { GetDashboard } from "../controllers/dashboard-controllers.js";
import { schemaDashboardQuery } from "../schemas/dashboard-schemas.js";

const dashboard = express.Router();

// GET /api/v1/dashboard?year=2026&month=1&years_range=6&top_limit=3
dashboard.get(
	"/",
	verifyToken,
	validationFields(schemaDashboardQuery, "query"),
	async (request, response, next) => {
		try {
			const { year, month, years_range, top_limit } = request.query;
			const result = await GetDashboard({
				year: year ? Number(year) : undefined,
				month: month ? Number(month) : undefined,
				years_range: years_range ? Number(years_range) : undefined,
				top_limit: top_limit ? Number(top_limit) : undefined,
			});
			methodOK(request, response, result);
		} catch (error) {
			next(error);
		}
	},
);

export { dashboard };
