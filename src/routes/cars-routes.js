import express from "express";
import { methodCreated, methodOK } from "../server/methods-server.js";
import { validationFields } from "../middlewares/validation-middlewares.js";
import { verifyToken } from "../middlewares/verify-jwt-middlewares.js";
import { schemaInsertCar } from "../schemas/cars-schema.js";
import { GetModelsByCars, InsertCar } from "../controllers/cars-controllers.js";

const cars = express.Router();

// GET /api/cars/models
cars.get("/models", verifyToken, async (request, response, next) => {
	try {
		const result = await GetModelsByCars();
		methodOK(request, response, result);
	} catch (error) {
		next(error);
	}
});
//POST /api/cars/create
cars.post(
	"/",
	verifyToken,
	validationFields(schemaInsertCar, "body"),
	async (request, response, next) => {
		try {
			const insertCar = request.body;
			const result = await InsertCar(insertCar);
			methodCreated(request, response, undefined, result.message);
		} catch (error) {
			next(error);
		}
	},
);

export { cars };
