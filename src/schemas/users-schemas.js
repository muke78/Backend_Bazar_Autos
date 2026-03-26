import Joi from "joi";
import { emailSchema, passwordSchema } from "./schemas.js";

export const schemaCreateUserValidations = Joi.object({
	username: Joi.string().min(4).max(100).alphanum().required().messages({
		"string.min": "El nombre de usuario debe tener al menos 4 caracteres.",
		"string.max": "El nombre de usuario no puede exceder los 100 caracteres.",
		"any.required": "El nombre de usuario es obligatorio.",
	}),
	password: passwordSchema,
	full_name: Joi.string().min(7).max(200).trim().required().messages({
		"string.min": "El nombre completo debe tener al menos 7 caracteres.",
		"string.max": "El nombre completo no puede exceder los 200 caracteres.",
		"any.required": "El nombre completo es obligatorio.",
	}),
	email: emailSchema,
});
