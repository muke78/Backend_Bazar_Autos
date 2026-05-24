import { pool } from "../lib/db.js";

export const connectionQuery = async (sql, params) => {
	const connection = await pool.getConnection();
	try {
		const [rows] = await connection.query(sql, params);
		return rows;
	} catch (error) {
		console.error("❌ Error en la consulta a la base de datos:");
		console.error(error);
		throw error;
	} finally {
		connection.release();
	}
};

export const connectionTransaction = async (callback) => {
	const connection = await pool.getConnection();
	try {
		await connection.beginTransaction();

		const query = async (sql, params) => {
			const [rows] = await connection.query(sql, params);
			return rows;
		};

		const result = await callback(query);
		await connection.commit();
		return result;
	} catch (error) {
		await connection.rollback();
		console.error("❌ Error en la transacción, rollback ejecutado:");
		console.error(error);
		throw error;
	} finally {
		connection.release();
	}
};
