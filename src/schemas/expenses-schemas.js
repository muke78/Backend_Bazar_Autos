import Joi from "joi";
import { uuidSchema } from "./schemas.js";

export const schemaInsertMovement = Joi.object({
	movements_category_id: uuidSchema,
	car_id: Joi.alternatives()
		.try(uuidSchema, Joi.array().items(uuidSchema).min(1))
		.required(),
	type: Joi.string().valid("Compra", "Gasto").required(),
	amount: Joi.number().positive().precision(2).required(),
	description: Joi.string().max(120).allow("", null),
	closing_date: Joi.date().iso().required(),
	isShared: Joi.boolean().default(false),
});
