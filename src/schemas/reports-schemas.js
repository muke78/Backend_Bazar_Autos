import Joi from "joi";

export const schemaExportReport = Joi.object({
	type: Joi.string()
		.valid("sales", "expenses", "investments", "full")
		.required()
		.messages({
			"any.only":
				"El tipo debe ser 'sales', 'expenses', 'investments' o 'full'.",
			"any.required": "El tipo de reporte es obligatorio.",
		}),

	format: Joi.string().valid("xlsx", "csv", "pdf").required().messages({
		"any.only": "El formato debe ser 'xlsx', 'csv' o 'pdf'.",
		"any.required": "El formato es obligatorio.",
	}),

	date_from: Joi.date().iso().required().messages({
		"date.base": "date_from debe ser una fecha válida.",
		"date.format": "date_from debe tener formato ISO (YYYY-MM-DD).",
		"any.required": "La fecha de inicio es obligatoria.",
	}),

	date_to: Joi.date()
		.iso()
		.min(Joi.ref("date_from"))
		.required()
		.messages({
			"date.base": "date_to debe ser una fecha válida.",
			"date.format": "date_to debe tener formato ISO (YYYY-MM-DD).",
			"date.min": "date_to debe ser igual o posterior a date_from.",
			"any.required": "La fecha de fin es obligatoria.",
		}),
});
