import { connectionQuery } from "../helpers/index.js";

export const insertInvestorModel = async (
	investor_id,
	user_id,
	investment_amount,
) => {
	const query = `INSERT INTO investor (investor_id, user_id, investment_amount) VALUES (?, ?, ?);`;
	const params = [investor_id, user_id, investment_amount];

	return await connectionQuery(query, params);
};
