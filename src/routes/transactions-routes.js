import express from "express";
import { verifyToken } from "../middlewares/verify-jwt-middlewares.js";
import { validationFields } from "../middlewares/validation-middlewares.js";
import { methodCreated, methodOK } from "../server/methods-server.js";
import { schemaGetInvestorTransactions, schemaInsertInvestorTransaction } from "../schemas/transactions-schema.js";
import { GetTransactions, InsertTransaction } from "../controllers/transactions-controllers.js";

const transactions = express.Router({ mergeParams: true })


// GET /api/v1/investors/:investor_id/transactions?year=2024&month=4
transactions.get(
    "/",
    verifyToken,
    validationFields(schemaGetInvestorTransactions, "query"), // Valida que los filtros de año/mes/tipo estén bien
    async (request, response, next) => {
        try {
            const { investor_id } = request.params;
            const filters = request.query; // Aquí vienen year, month, type

            const result = await GetTransactions(investor_id, filters);
            methodOK(request, response, result.data, "Historial obtenido");
        } catch (error) {
            next(error);
        }
    }
);

// POST /api/v1/investors/:investor_id/transactions
transactions.post(
    "/",
    verifyToken,
    validationFields(schemaInsertInvestorTransaction, "body"), // Valida amount, type, concept
    async (request, response, next) => {
        try {
            // ✅ Gracias a mergeParams, request.params tiene el investor_id
            const { investor_id } = request.params;
            const transactionData = request.body;

            // En tu controlador, le pasas ambos: el ID de la URL y los datos validados del body
            await InsertTransaction(investor_id, transactionData);

            methodCreated(request, response, undefined, "Movimiento registrado correctamente");
        } catch (error) {
            next(error);
        }
    }
);



export { transactions };