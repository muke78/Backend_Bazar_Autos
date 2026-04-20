import express from "express";
import { methodCreated, methodOK } from "../server/methods-server.js";
import { validationFields } from "../middlewares/validation-middlewares.js";
import { verifyToken } from "../middlewares/verify-jwt-middlewares.js";
import { querySchema, schemaInsertCar, schemaUpdateCar } from "../schemas/cars-schema.js";
import { multiUuidSchema } from "../schemas/schemas.js";
import {
	GetAllCars,
	GetModelsByCars,
	InsertCar,
	UpdateCar,
} from "../controllers/cars-controllers.js";

const cars = express.Router();

// GET /api/cars?limit=20&page=1
cars.get(
	"/",
	verifyToken,
	validationFields(querySchema, "query"),
	async (request, response, next) => {
		try {
			const { search, ...pagination } = request.query;
			const result = await GetAllCars(pagination, search);
			methodOK(request, response, result);
		} catch (error) {
			next(error);
		}
	},
);

// GET /api/cars/models
cars.get("/models", verifyToken, async (request, response, next) => {
	try {
		const result = await GetModelsByCars();
		methodOK(request, response, result);
	} catch (error) {
		next(error);
	}
});

// POST /api/cars
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

// PUT /api/cars/:id
cars.put(
	"/:id",
	verifyToken,
	validationFields(multiUuidSchema(["id"]), "params"),
	validationFields(schemaUpdateCar, "body"),
	async (request, response, next) => {
		try {
			const carId = request.params.id;	
			const carData = request.body;
			const result = await UpdateCar(carId, carData);
			methodOK(request, response, result, result.message);
		} catch (error) {
			next(error);
		}
	},
);

export { cars };
