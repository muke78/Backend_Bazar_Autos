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
    validationFields(schemaGetInvestorTransactions, "query"),
    async (request, response, next) => {
        try {
            const { investor_id } = request.params;
            const filters = request.query;

            const result = await GetTransactions(investor_id, filters);
            methodOK(request, response, result, "Historial obtenido");
        } catch (error) {
            next(error);
        }
    }
);

// POST /api/v1/investors/:investor_id/transactions
transactions.post(
    "/",
    verifyToken,
    validationFields(schemaInsertInvestorTransaction, "body"),
    async (request, response, next) => {
        try {
            const { investor_id } = request.params;
            const transactionData = request.body;

            const result = await InsertTransaction(investor_id, transactionData);

            methodCreated(request, response, undefined, result.message);
        } catch (error) {
            next(error);
        }
    }
);



export { transactions };