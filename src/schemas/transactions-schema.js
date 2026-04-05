import Joi from 'joi';

export const schemaInsertInvestorTransaction = Joi.object({
    type: Joi.string().valid("Entrada", "Salida").required().messages({
        "string.base": "El tipo de movimiento debe ser un texto.",
        "string.empty": "El tipo de movimiento no puede estar vacío.",
        "any.only": "El tipo de movimiento solo puede ser 'Entrada' o 'Salida'.",
        "any.required": "El tipo de movimiento es obligatorio."
    }),
    
    amount: Joi.number().precision(2).positive().required().messages({
        "number.base": "El monto debe ser un número válido.",
        "number.positive": "El monto debe ser un valor positivo mayor a cero.",
        "any.required": "El monto de la transacción es obligatorio."
    }),
    
    concept: Joi.string().max(255).required().messages({
        "string.base": "El concepto debe ser un texto.",
        "string.empty": "El concepto no puede estar vacío.",
        "string.max": "El concepto no puede exceder los 255 caracteres.",
        "any.required": "El concepto es obligatorio."
    })
});

export const schemaGetInvestorTransactions = Joi.object({
    year: Joi.number().integer().min(2000).max(2100).optional().messages({
        "number.base": "El año debe ser un número.",
        "number.integer": "El año debe ser un número entero.",
        "number.min": "El año a buscar no puede ser menor al 2000.",
        "number.max": "El año a buscar no puede ser mayor al 2100."
    }),
    
    month: Joi.number().integer().min(1).max(12).optional().messages({
        "number.base": "El mes debe ser un número.",
        "number.integer": "El mes debe ser un número entero.",
        "number.min": "El mes debe ser mayor o igual a 1 (Enero).",
        "number.max": "El mes no puede ser mayor a 12 (Diciembre)."
    }),
    
    type: Joi.string().valid("Entrada", "Salida").optional().messages({
        "string.base": "El tipo de filtro debe ser texto.",
        "any.only": "El filtro de tipo solo admite 'Entrada' o 'Salida'."
    }),
});