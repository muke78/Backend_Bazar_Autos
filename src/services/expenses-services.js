import { generateUUID } from "../helpers/index.js";
import {
	getMovementCategoriesModel,
	insertMovementModel,
} from "../models/expenses-models.js";
import { DatabaseError, NotFoundError } from "../utils/error-utils.js";

export const GetMovementCategoriesService = async () => {
	const categories = await getMovementCategoriesModel();

	if (!categories || categories.length === 0) {
		throw new NotFoundError("No se encontraron categorías registradas.");
	}

	return categories;
};

export const InsertMovementService = async (movementData) => {
	const { movements_category_id, car_id, type, amount, description, isShared } =
		movementData;

	try {
		const carsArray = Array.isArray(car_id) ? car_id : [car_id];

		const amountPerCar = isShared ? amount / carsArray.length : amount;

		const insertPromises = carsArray.map((id) => {
			const movements_id = generateUUID();
			const finalDescription = isShared
				? `[Compartido] ${description || ""}`.trim()
				: description;

			return insertMovementModel(
				movements_id,
				movements_category_id,
				id,
				type,
				amountPerCar,
				finalDescription,
			);
		});

		// Ejecutamos todas las inserciones
		await Promise.all(insertPromises);

		return {
			message: isShared
				? `Movimiento dividido entre ${carsArray.length} autos correctamente`
				: "Movimiento registrado con éxito",
		};
	} catch (error) {
		throw new DatabaseError(
			"Error al procesar la distribución de gastos en la base de datos",
			{
				context: "InsertMovementService",
				metadata: {
					sqlMessage: error.sqlMessage,
					code: error.code,
				},
			},
		);
	}
};
