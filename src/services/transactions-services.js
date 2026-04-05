import { generateUUID } from "../helpers/uuid-helper.js";
import { getTransactionsModel, insertTransactionModel } from "../models/transactions-models.js";
import { BadRequestError, DatabaseError, NotFoundError } from "../utils/error-utils.js";

export const GetTransactionsService = async (investor_id, filters) => {
    const transactions = await getTransactionsModel(investor_id, filters);

    if (!transactions || transactions.length === 0) {
        const hasFilters = Object.keys(filters).length > 0;

        const errorMessage = hasFilters
            ? "No se encontraron transacciones para este inversionista con los filtros solicitados."
            : "No hay un historial de transacciones registrado para este inversionista.";

        throw new NotFoundError(errorMessage);

    }

    return { data: transactions };
};

export const InsertTransactionService = async (investor_id, transactionData) => {
    const { type, amount, concept } = transactionData;

    const transaction_id = generateUUID();

    const dataToInsert = {
        transaction_id,
        investor_id,
        type,
        amount,
        concept
    };

    try {
        await insertTransactionModel(dataToInsert);
        return { message: "Movimiento registrado y saldo actualizado correctamente" };

    } catch (error) {
        if (error.message === "INSUFFICIENT_FUNDS") {
            throw new BadRequestError(
                "Fondos insuficientes para realizar esta operación",
            );
        }

        if (error.message === "NOT_FOUND_INVESTOR") {
            throw new NotFoundError(
                "La inversion no existe, no se pueden aplicar transacciones",
            );
        }

        // Si es un error interno de SQL (sintaxis, conexión caída)
        throw new DatabaseError("Error al registrar la transacción de inversión", {
            context: "InsertTransactionService",
            metadata: {
                originalError: error.message,
                sqlMessage: error.sqlMessage || null,
                investor_id
            }
        });
    }
};