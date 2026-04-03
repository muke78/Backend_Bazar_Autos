import { connectionQuery } from "../helpers/index.js";
import { pool } from "../lib/db.js";
import { DatabaseError } from "../utils/error-utils.js";

export const getTransactionsModel = async (investor_id, filters) => {
    const { year, month, type } = filters;

    let query = `
        SELECT transaction_id, type, amount, concept, created 
        FROM investor_transactions 
        WHERE investor_id = ?
    `;
    const queryParams = [investor_id];

    if (year) {
        query += ` AND YEAR(created) = ?`;
        queryParams.push(year);
    }
    if (month) {
        query += ` AND MONTH(created) = ?`;
        queryParams.push(month);
    }
    if (type) {
        query += ` AND type = ?`;
        queryParams.push(type);
    }

    // Ordenamos para que el historial más reciente salga primero
    query += ` ORDER BY created DESC;`;

    try {
        // Si tu connectionQuery soporta parámetros dinámicos, se los pasamos
        const rows = await connectionQuery(query, queryParams);
        return rows;
    } catch (error) {
        throw new DatabaseError("Error al obtener el historial de transacciones", {
            context: "getTransactionsModel",
            metadata: { originalError: error.message, investor_id }
        });
    }
};

export const insertTransactionModel = async (data) => {
    const { transaction_id, investor_id, type, amount, concept } = data;

    // Obtenemos una conexión exclusiva para hacer la Transacción SQL
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Insertamos el movimiento en el historial
        const insertQuery = `
            INSERT INTO investor_transactions (transaction_id, investor_id, type, amount, concept)
            VALUES (?, ?, ?, ?, ?)
        `;
        await connection.query(insertQuery, [transaction_id, investor_id, type, amount, concept]);

        // 2. Actualizamos el saldo principal del inversor (Lógica Entrada/Salida)
        let updateQuery = "";
        if (type === 'Entrada') {
            updateQuery = `UPDATE investor SET investment_amount = investment_amount + ? WHERE investor_id = ?`;
        } else {
            updateQuery = `UPDATE investor SET investment_amount = investment_amount - ? WHERE investor_id = ?`;
        }

        const [updateResult] = await connection.query(updateQuery, [amount, investor_id]);

        // Verificamos que el inversor realmente existiera
        if (updateResult.affectedRows === 0) {
            throw new Error("El investor_id no existe en la base de datos");
        }

        // 3. Si ambas consultas salieron bien, confirmamos los cambios
        await connection.commit();
        return true;

    } catch (error) {
        // Si algo falla, deshacemos todo para no corromper el dinero
        await connection.rollback();

        throw new DatabaseError("Error al registrar la transacción de inversión", {
            context: "insertTransactionModel",
            metadata: {
                originalError: error.message,
                sqlMessage: error.sqlMessage || null,
                investor_id
            }
        });
    } finally {
        if (connection) connection.release();
    }
};