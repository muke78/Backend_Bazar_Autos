import { connectionQuery } from "../helpers/index.js";
import { DatabaseError } from "../utils/error-utils.js";

export const getInvestmentsModel = async (user_id, filters) => {
	try {
		const { year, month } = filters;

		let query = `
        SELECT
            investor_id,
            user_id,
            investment_amount,
            created,
            updated
        FROM investor
        WHERE user_id = ?
    `;
		const queryParams = [user_id];

		if (year) {
			query += ` AND YEAR(created) = ?`;
			queryParams.push(year);
		}

		if (month) {
			query += ` AND MONTH(created) = ?`;
			queryParams.push(month);
		}

		query += ` ORDER BY created DESC;`;

		return await connectionQuery(query, queryParams);
	} catch (error) {
		throw new DatabaseError("Error al obtener las inversiones de la base de datos", {
			context: "getInvestmentsModel",
			metadata: { originalError: error.message },
		});
	}
};

export const insertInvestorModel = async (investor_id, user_id, investment_amount) => {
	try {
		const query = `INSERT INTO investor (investor_id, user_id, investment_amount) VALUES (?, ?, ?);`;
		const params = [investor_id, user_id, investment_amount];
		return await connectionQuery(query, params);
	} catch (error) {
		throw new DatabaseError("Error al registrar la inversión en la base de datos", {
			context: "insertInvestorModel",
			metadata: { originalError: error.message },
		});
	}
};
