import Joi from "joi";

export const schemaCreateCategory = Joi.object({
	name: Joi.string().trim().min(1).max(50).required().messages({
		"string.base": "El nombre debe ser un texto.",
		"string.empty": "El nombre no puede estar vacío.",
		"string.min": "El nombre debe tener al menos 1 caracter.",
		"string.max": "El nombre no puede exceder los 50 caracteres.",
		"any.required": "El nombre es obligatorio.",
	}),

	type: Joi.string().valid("Activo", "Pasivo").required().messages({
		"string.base": "El tipo debe ser un texto.",
		"any.only": "El tipo solo puede ser 'Activo' o 'Pasivo'.",
		"any.required": "El tipo es obligatorio.",
	}),
});

export const schemaUpdateCategory = Joi.object({
	name: Joi.string().trim().min(1).max(50).optional().messages({
		"string.base": "El nombre debe ser un texto.",
		"string.empty": "El nombre no puede estar vacío.",
		"string.min": "El nombre debe tener al menos 1 caracter.",
		"string.max": "El nombre no puede exceder los 50 caracteres.",
	}),

	type: Joi.string().valid("Activo", "Pasivo").optional().messages({
		"string.base": "El tipo debe ser un texto.",
		"any.only": "El tipo solo puede ser 'Activo' o 'Pasivo'.",
	}),
})
	.or("name", "type")
	.messages({
		"object.missing": "Debe enviar al menos un campo a actualizar (name o type).",
	});
