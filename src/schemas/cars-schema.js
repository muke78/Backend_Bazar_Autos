import Joi from "joi";
import { paginationSchema, uuidSchema } from "./schemas.js";

export const querySchema = paginationSchema.append({
	search: Joi.string().allow("").optional()
});

export const baseCostItemFields = {
	cost_type: Joi.string()
		.valid(
			"llantas", "hojalateria", "tapiceria", "cielo", "volante", "funda",
			"mecanico", "tapones", "multa", "kit", "sombrerera", "rin_llaveta",
			"aceite", "tapon_facion", "alineacion", "manija", "faros_calaveras"
		)
		.required()
		.messages({
			"string.base": "El tipo de gasto debe ser un texto.",
			"any.only": "El tipo de gasto seleccionado no es válido en el catálogo.",
			"any.required": "El tipo de gasto es obligatorio.",
		}),

	amount: Joi.number().precision(2).min(0).allow(null, "").empty("").default(0).required().messages({
		"number.base": "El monto del gasto debe ser un número.",
		"number.min": "El monto del gasto no puede ser negativo.",
		"any.required": "El monto del gasto es obligatorio.",
	}),

	note: Joi.string().max(255).allow("", null).messages({
		"string.base": "La nota del gasto debe ser un texto.",
		"string.max": "La nota del gasto no puede exceder los 255 caracteres.",
	}),
};

export const baseCarFields = {
	brand: Joi.string().max(20).messages({
		"string.base": "La marca debe ser un texto.",
		"string.empty": "La marca no puede estar vacía.",
		"string.max": "La marca no puede exceder los 20 caracteres.",
	}),
	model: Joi.string().max(50).messages({
		"string.base": "El modelo debe ser un texto.",
		"string.empty": "El modelo no puede estar vacío.",
		"string.max": "El modelo no puede exceder los 50 caracteres.",
	}),
	year_of_car: Joi.number().integer().min(1900).max(2100).messages({
		"number.base": "El año debe ser un número.",
		"number.integer": "El año debe ser un número entero.",
		"number.min": "El año del vehículo no puede ser menor a 1900.",
		"number.max": "El año del vehículo no puede ser mayor a 2100.",
	}),
	color: Joi.string().max(15).messages({
		"string.base": "El color debe ser un texto.",
		"string.empty": "El color no puede estar vacío.",
		"string.max": "El color no puede exceder los 15 caracteres.",
	}),
	purchase_date: Joi.date().iso().messages({
		"date.base": "La fecha de compra debe ser una fecha válida.",
		"date.format": "La fecha de compra debe tener un formato ISO válido.",
	}),
	sale_date: Joi.date().iso().allow(null).empty("").default(null).messages({
		"date.base": "La fecha de venta debe ser una fecha válida.",
		"date.format": "La fecha de venta debe tener un formato ISO válido.",
	}),
	status: Joi.string().valid("Vendido", "Inventario", "En espera", "Reparacion").messages({
		"string.base": "El estado debe ser un texto.",
		"any.only": "El estado debe ser uno de los siguientes: 'Vendido', 'Inventario', 'En espera', 'Reparacion'.",
	}),
	purchase_price: Joi.number().precision(2).positive().messages({
		"number.base": "El precio de compra debe ser un número.",
		"number.positive": "El precio de compra debe ser mayor a cero.",
	}),
	price_for_sale: Joi.number().precision(2).positive().allow(null).empty("").default(null).messages({
		"number.base": "El precio de venta objetivo debe ser un número.",
		"number.positive": "El precio de venta objetivo debe ser mayor a cero.",
	}),
};


export const schemaUpdateCar = Joi.object({
	...baseCarFields,
	costs: Joi.array().items(
		Joi.object({
			// El Update es el único que acepta cost_id para saber qué actualizar
			cost_id: uuidSchema.optional().allow(null, "").empty(""),
			...baseCostItemFields,
		})
	).allow(null).default([]).messages({
		"array.base": "Los gastos deben enviarse en formato de lista (arreglo).",
	}),
}).min(1).messages({
	"object.min": "Debe enviar al menos un campo para actualizar.",
});


export const schemaInsertCar = Joi.object({
	// Tomamos los campos base y les concatenamos el .required() dinámicamente
	brand: baseCarFields.brand.required().messages({ "any.required": "La marca del vehículo es obligatoria." }),
	model: baseCarFields.model.required().messages({ "any.required": "El modelo del vehículo es obligatorio." }),
	year_of_car: baseCarFields.year_of_car.required().messages({ "any.required": "El año del vehículo es obligatorio." }),
	color: baseCarFields.color.required().messages({ "any.required": "El color del vehículo es obligatorio." }),
	purchase_date: baseCarFields.purchase_date.required().messages({ "any.required": "La fecha de compra es obligatoria." }),

	// Estos se quedan exactamente igual (opcionales)
	sale_date: baseCarFields.sale_date,
	price_for_sale: baseCarFields.price_for_sale,

	status: baseCarFields.status.required().messages({ "any.required": "El estado del vehículo es obligatorio." }),
	purchase_price: baseCarFields.purchase_price.required().messages({ "any.required": "El precio de compra es obligatorio." }),

	// Los costos en Insert no necesitan cost_id, así que usamos directo la base
	costs: Joi.array().items(Joi.object(baseCostItemFields)).allow(null).default([]).messages({
		"array.base": "Los gastos deben enviarse en formato de lista (arreglo)."
	})
});