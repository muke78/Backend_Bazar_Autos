import { findUserById } from "../functions/find-user-by-id-functions.js";
import { generateUUID } from "../helpers/index.js";
import { getInvestmentsModel, insertInvestorModel } from "../models/investor-models.js";
import { DatabaseError, NotFoundError } from "../utils/error-utils.js";

export const getInvestmentsService = async (user_id, filters) => {
	try {
		const existingUser = await findUserById(user_id);

		if (!existingUser || existingUser.length === 0) {
			throw new NotFoundError("El usuario especificado no existe en el sistema.", {
				context: "getInvestmentsService",
				metadata: { user_id }
			});
		}

		const rows = await getInvestmentsModel(user_id, filters);

		if (!rows || rows.length === 0) {
			const hasFilters = filters.year || filters.month;
			const errorMsg = hasFilters
				? "No se encontraron inversiones para este usuario en el periodo seleccionado."
				: "Este usuario aún no tiene inversiones registradas.";

			throw new NotFoundError(errorMsg, {
				context: "getInvestmentsService",
				metadata: { user_id, filters }
			});
		}

		const current_total_balance = rows.reduce(
			(acc, current) => acc + Number(current.investment_amount),
			0
		);

		return {
			current_total_balance,
			data: rows
		};

	} catch (error) {
		if (error instanceof NotFoundError) {
			throw error;
		}

		throw new DatabaseError("Error interno al obtener las inversiones del usuario", {
			context: "getInvestmentsService",
			metadata: {
				sqlMessage: error.sqlMessage,
				code: error.code,
			},
		});
	}
};

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
