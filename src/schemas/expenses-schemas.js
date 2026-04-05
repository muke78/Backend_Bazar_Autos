import Joi from "joi";
import { uuidSchema } from "./schemas.js";

export const schemaInsertMovement = Joi.object({
    movements_category_id: uuidSchema.messages({
        "string.guid": "El ID de la categoría de movimiento debe ser un identificador válido (UUID).",
        "string.base": "El ID de la categoría debe ser un texto."
    }),
    
    car_id: Joi.alternatives()
        .try(uuidSchema, Joi.array().items(uuidSchema).min(1))
        .required()
        .messages({
            "alternatives.match": "El vehículo debe ser un identificador válido único o una lista con al menos un identificador.",
            "any.required": "El identificador del vehículo (car_id) es obligatorio."
        }),
        
    type: Joi.string().valid("Compra", "Gasto").required().messages({
        "string.base": "El tipo de movimiento debe ser texto.",
        "any.only": "El tipo de movimiento solo puede ser 'Compra' o 'Gasto'.",
        "any.required": "El tipo de movimiento es obligatorio."
    }),
    
    amount: Joi.number().positive().precision(2).required().messages({
        "number.base": "El monto debe ser un número válido.",
        "number.positive": "El monto debe ser un valor positivo mayor a cero.",
        "any.required": "El monto es obligatorio."
    }),
    
    description: Joi.string().max(120).allow("", null).messages({
        "string.base": "La descripción debe ser un texto.",
        "string.max": "La descripción no puede exceder los 120 caracteres."
    }),
    
    closing_date: Joi.date().iso().required().messages({
        "date.base": "La fecha de cierre debe ser una fecha válida.",
        "date.format": "La fecha de cierre debe tener un formato válido (ISO 8601).",
        "any.required": "La fecha de cierre es obligatoria."
    }),
    
    isShared: Joi.boolean().default(false).messages({
        "boolean.base": "El indicador de gasto compartido debe ser verdadero o falso (boolean)."
    }),
});