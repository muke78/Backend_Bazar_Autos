import express from 'express';
import { methodCreated, methodOK } from "../server/methods-server.js";
import { AuthError } from "../utils/error-utils.js";
import { validationFields } from '../middlewares/validation-middlewares.js';
import { verifyToken } from '../middlewares/verify-jwt-middlewares.js';

const cars = express.Router()

// GET /api/cars/models

//POST /api/cars/create
cars.post("/", verifyToken, async (request, response, next) => {
    try {
        const insertCar = request.body;
        const result = await InsertCar(insertCar)
        methodCreated(request, response, result, "Se inserto correctamente un auto")
    } catch (error) {
        next(error)
    }
})

export { cars }