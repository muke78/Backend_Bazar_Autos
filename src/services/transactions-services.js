import { generateUUID } from "../helpers/uuid-helper.js";
import { getTransactionsModel, insertTransactionModel } from "../models/transactions-models.js";

export const GetTransactionsService = async (investor_id, filters) => {
    // Delegamos al modelo la consulta con los filtros
    const transactions = await getTransactionsModel(investor_id, filters);
    return { data: transactions };
};

export const InsertTransactionService = async (investor_id, transactionData) => {
    const { type, amount, concept } = transactionData;

    // Generamos el ID aquí en la capa de lógica de negocio
    const transaction_id = generateUUID();

    const dataToInsert = {
        transaction_id,
        investor_id,
        type,
        amount,
        concept
    };
    // Ejecutamos el modelo que hará la transacción SQL
    await insertTransactionModel(dataToInsert);

    return { message: "Movimiento registrado y saldo actualizado correctamente" };
};