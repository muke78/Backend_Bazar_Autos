import Joi from "joi";

export const schemaDashboardQuery = Joi.object({
	year: Joi.number()
		.integer()
		.min(2000)
		.max(2100)
		.empty("")
		.optional()
		.messages({
			"number.base": "El año debe ser un número.",
			"number.integer": "El año debe ser un número entero.",
			"number.min": "El año mínimo permitido es 2000.",
			"number.max": "El año máximo permitido es 2100.",
		}),
	month: Joi.number()
		.integer()
		.min(1)
		.max(12)
		.empty("")
		.optional()
		.messages({
			"number.base": "El mes debe ser un número.",
			"number.integer": "El mes debe ser un número entero.",
			"number.min": "El mes debe estar entre 1 y 12.",
			"number.max": "El mes debe estar entre 1 y 12.",
		}),
	years_range: Joi.number()
		.integer()
		.min(2)
		.max(20)
		.empty("")
		.optional()
		.default(6)
		.messages({
			"number.base": "El rango de años debe ser un número.",
			"number.integer": "El rango de años debe ser un número entero.",
			"number.min": "El rango mínimo es 2 años.",
			"number.max": "El rango máximo es 20 años.",
		}),
	top_limit: Joi.number()
		.integer()
		.min(1)
		.max(20)
		.empty("")
		.optional()
		.default(3)
		.messages({
			"number.base": "El límite del top debe ser un número.",
			"number.min": "El límite mínimo es 1.",
			"number.max": "El límite máximo es 20.",
		}),
});
