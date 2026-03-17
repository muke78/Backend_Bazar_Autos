import Joi from "joi";
import { uuidSchema } from "./schemas.js";

export const schemaInsertInvestor = Joi.object({
	user_id: uuidSchema,
	investment_amount: Joi.number().positive().precision(2).required().messages({
		"number.base": "La cantidad invertida debe ser un número",
		"number.positive": "La inversión debe ser mayor a cero",
		"any.required": "La cantidad invertida es obligatoria",
	}),
});
