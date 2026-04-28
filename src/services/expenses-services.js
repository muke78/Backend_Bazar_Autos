import { generateUUID } from "../helpers/index.js";
import {
	getAllExpensesModel,
	getMovementCategoriesModel,
	insertMovementModel,
} from "../models/expenses-models.js";
import { NotFoundError } from "../utils/error-utils.js";

export const getAllExpensesService = async (pagination, filters = {}) => {
	const { isShared, year, month, type, name } = filters;
	const limit = Number(pagination.limit) > 0 ? Number(pagination.limit) : 20;
	const page = Number(pagination.page) > 0 ? Number(pagination.page) : 1;

	const offset = (page - 1) * limit;

	const isSharedBool = isShared === "true" || isShared === true;

	const { rows, total } = await getAllExpensesModel(limit, offset, isSharedBool, { year, month, type, name });

	if (!rows || rows.length === 0) {
		throw new NotFoundError("No se encontraron gastos registrados.");
	}

	const totalPages = Math.ceil(total / limit);

	return {
		filters: {
			isShared: isShared || null,
			year: year || null,
			month: month || null,
			type: type || null,
			name: name || null
		},
		rows,
		pagination: {
			total,
			totalPages,
			currentPage: page,
			limit,
			hasNextPage: page < totalPages,
			hasPrevPage: page > 1,
		},
	};
};

export const GetMovementCategoriesService = async () => {
	const categories = await getMovementCategoriesModel();

	if (!categories || categories.length === 0) {
		throw new NotFoundError("No se encontraron categorías registradas.");
	}

	return categories;
};

export const InsertMovementService = async (movementData) => {
	const {
		movements_category_id,
		car_id,
		type,
		amount,
		description,
		closing_date,
		isShared,
	} = movementData;

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
			closing_date,
		);
	});

	await Promise.all(insertPromises);

	return {
		message: isShared
			? `Movimiento dividido entre ${carsArray.length} autos correctamente`
			: "Movimiento registrado con éxito",
	};
};
