import Joi from "joi";
import { uuidSchema } from "./schemas.js";

export const schemaGetInvestorParams = Joi.object({
	user_id: uuidSchema.required().messages({
		"any.required": "El ID del usuario es obligatorio",
		"string.guid": "El formato del ID de usuario no es válido",
	}),
});

export const schemaGetInvestorQuery = Joi.object({
	year: Joi.number().integer().min(2000).max(2100).optional().allow(""),
	month: Joi.number().integer().min(1).max(12).optional().allow(""),
});

export const schemaInsertInvestor = Joi.object({
	user_id: uuidSchema,
	investment_amount: Joi.number().positive().precision(2).required().messages({
		"number.base": "La cantidad invertida debe ser un número",
		"number.positive": "La inversión debe ser mayor a cero",
		"any.required": "La cantidad invertida es obligatoria",
	}),
});
