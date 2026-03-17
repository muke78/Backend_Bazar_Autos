import { generateUUID } from "../helpers/index.js";
import { insertInvestorModel } from "../models/investor-models.js";
import { DatabaseError } from "../utils/error-utils.js";

export const postInsertInvestorService = async (investorData) => {
	try {
		const investor_id = generateUUID();
		const { user_id, investment_amount } = investorData;

		await insertInvestorModel(investor_id, user_id, investment_amount);

		return { message: "Inversion registrada con exito" };
	} catch (error) {
		throw new DatabaseError(
			"Error al registrar la inversión en la base de datos",
			{
				context: "postInsertInvestorService",
				metadata: {
					sqlMessage: error.sqlMessage,
					code: error.code,
				},
			},
		);
	}
};
