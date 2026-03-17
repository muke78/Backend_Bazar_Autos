import Joi from "joi";

export const schemaInsertCar = Joi.object({
	brand: Joi.string().max(20).required(),
	model: Joi.string().max(50).required(),
	year_of_car: Joi.number().integer().min(1900).max(2100).required(),
	color: Joi.string().max(15).required(),
	purchase_date: Joi.date().iso().required(),
	sale_date: Joi.date().iso().allow(null),
	status: Joi.string()
		.valid("Vendido", "Inventario", "En espera", "Reparacion")
		.required(),
	purchase_price: Joi.number().precision(2).positive().required(),
	price_for_sale: Joi.number().precision(2).positive().allow(null),

	// Arreglo de gastos que tiene cada carro que se pueden repetir segun su tipo
	costs: Joi.array()
		.items(
			Joi.object({
				cost_type: Joi.string()
					.valid(
						"llantas",
						"hojalateria",
						"tapiceria",
						"cielo",
						"volante",
						"funda",
						"mecanico",
						"tapones",
						"multa",
						"kit",
						"sombrerera",
						"rin_llaveta",
						"aceite",
						"tapon_facion",
						"alineacion",
						"manija",
						"faros_calaveras",
					)
					.required(),
				amount: Joi.number().precision(2).positive().required(),
				note: Joi.string().max(255).allow("", null),
			}),
		)
		.default([]),
});
