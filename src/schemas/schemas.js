import Joi from "joi";

export const emailSchema = Joi.string()
	.email()
	.lowercase()
	.trim()
	.required()
	.messages({
		"string.email": "Debe ser un email valido",
		"string.empty": "El email no puede estar vacío",
		"any.required": "El email es obligatorio",
	});

export const passwordSchema = Joi.string()
	.min(6)
	.max(23)
	.pattern(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&()#]{6,}$/,
	)
	.required()
	.messages({
		"string.min": "El password debe tener mínimo 6 caracteres",
		"string.max": "El password debe tener maximo 23 caracteres",
		"string.empty": "El password no puede estar vacio",
		"string.pattern.base":
			"La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial",
		"any.required": "El password es obligatorio",
	});

export const uuidSchema = Joi.string()
	.uuid({ version: ["uuidv4"] })
	.required()
	.messages({
		"any.required": `El campo es obligatorio`,
		"string.base": `El campo debe ser una cadena de texto`,
		"string.empty": `El campo no puede estar vacío`,
		"string.guid": `El campo debe ser un UUID v4 válido`,
	});

export const multiUuidSchema = (keys = []) => {
	const shape = {};

	for (const key of keys) {
		shape[key] = Joi.string()
			.uuid({ version: "uuidv4" })
			.required()
			.messages({
				"any.required": `El campo "${key}" es obligatorio`,
				"string.base": `El campo "${key}" debe ser una cadena de texto`,
				"string.empty": `El campo "${key}" no puede estar vacío`,
				"string.guid": `El campo "${key}" debe ser un UUID v4 válido`,
			});
	}

	return Joi.object(shape);
};
