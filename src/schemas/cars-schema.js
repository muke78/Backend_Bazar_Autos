import Joi from "joi";

export const schemaInsertCar = Joi.object({
	brand: Joi.string().max(20).required().messages({
		"string.base": "La marca debe ser un texto.",
		"string.empty": "La marca no puede estar vacía.",
		"string.max": "La marca no puede exceder los 20 caracteres.",
		"any.required": "La marca del vehículo es obligatoria."
	}),

	model: Joi.string().max(50).required().messages({
		"string.base": "El modelo debe ser un texto.",
		"string.empty": "El modelo no puede estar vacío.",
		"string.max": "El modelo no puede exceder los 50 caracteres.",
		"any.required": "El modelo del vehículo es obligatorio."
	}),

	year_of_car: Joi.number().integer().min(1900).max(2100).required().messages({
		"number.base": "El año debe ser un número.",
		"number.integer": "El año debe ser un número entero.",
		"number.min": "El año del vehículo no puede ser menor a 1900.",
		"number.max": "El año del vehículo no puede ser mayor a 2100.",
		"any.required": "El año del vehículo es obligatorio."
	}),

	color: Joi.string().max(15).required().messages({
		"string.base": "El color debe ser un texto.",
		"string.empty": "El color no puede estar vacío.",
		"string.max": "El color no puede exceder los 15 caracteres.",
		"any.required": "El color del vehículo es obligatorio."
	}),

	purchase_date: Joi.date().iso().required().messages({
		"date.base": "La fecha de compra debe ser una fecha válida.",
		"date.format": "La fecha de compra debe tener un formato ISO válido.",
		"any.required": "La fecha de compra es obligatoria."
	}),

	sale_date: Joi.date().iso().allow(null, "").empty("").messages({
		"date.base": "La fecha de venta debe ser una fecha válida.",
		"date.format": "La fecha de venta debe tener un formato ISO válido."
	}),

	status: Joi.string()
		.valid("Vendido", "Inventario", "En espera", "Reparacion")
		.required()
		.messages({
			"string.base": "El estado debe ser un texto.",
			"any.only": "El estado debe ser uno de los siguientes: 'Vendido', 'Inventario', 'En espera', 'Reparacion'.",
			"any.required": "El estado del vehículo es obligatorio."
		}),

	purchase_price: Joi.number().precision(2).positive().required().messages({
		"number.base": "El precio de compra debe ser un número.",
		"number.positive": "El precio de compra debe ser mayor a cero.",
		"any.required": "El precio de compra es obligatorio."
	}),

	price_for_sale: Joi.number()
		.precision(2)
		.positive()
		.allow(null, "")
		.empty("")
		.messages({
			"number.base": "El precio de venta objetivo debe ser un número.",
			"number.positive": "El precio de venta objetivo debe ser mayor a cero."
		}),

	// Arreglo de gastos que tiene cada carro
	costs: Joi.array()
		.items(
			Joi.object({
				cost_type: Joi.string()
					.valid(
						"llantas", "hojalateria", "tapiceria", "cielo",
						"volante", "funda", "mecanico", "tapones",
						"multa", "kit", "sombrerera", "rin_llaveta",
						"aceite", "tapon_facion", "alineacion",
						"manija", "faros_calaveras"
					)
					.required()
					.messages({
						"string.base": "El tipo de gasto debe ser un texto.",
						"any.only": "El tipo de gasto seleccionado no es válido en el catálogo.",
						"any.required": "El tipo de gasto es obligatorio."
					}),

				amount: Joi.number()
					.precision(2)
					.min(0)
					.allow(null, "")
					.empty("")
					.default(0)
					.required()
					.messages({
						"number.base": "El monto del gasto debe ser un número.",
						"number.min": "El monto del gasto no puede ser negativo.",
						"any.required": "El monto del gasto es obligatorio."
					}),

				note: Joi.string().max(255).allow("", null).messages({
					"string.base": "La nota del gasto debe ser un texto.",
					"string.max": "La nota del gasto no puede exceder los 255 caracteres."
				})
			})
		)
		.allow(null)
		.default([])
		.messages({
			"array.base": "Los gastos deben enviarse en formato de lista (arreglo)."
		})
});