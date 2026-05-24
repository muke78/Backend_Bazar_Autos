import { generateUUID } from "../helpers/index.js";
import {
	getAllExpensesModel,
	insertMovementsBulkModel,
	findMovementsByIdsModel,
	replaceMovementsModel,
	deleteMovementsModel,
} from "../models/expenses-models.js";
import {
	NotFoundError,
	FieldsRequiredError,
} from "../utils/error-utils.js";

export const getAllExpensesService = async (pagination, filters = {}) => {
	const { year, month, type, name } = filters;
	const limit = Number(pagination.limit) > 0 ? Number(pagination.limit) : 20;
	const page = Number(pagination.page) > 0 ? Number(pagination.page) : 1;
	const offset = (page - 1) * limit;

	const { rows, total } = await getAllExpensesModel(limit, offset, {
		year,
		month,
		type,
		name,
	});

	if (!rows || rows.length === 0) {
		throw new NotFoundError("No se encontraron gastos registrados.");
	}

	const totalPages = Math.ceil(total / limit);

	return {
		filters: {
			year: year || null,
			month: month || null,
			type: type || null,
			name: name || null,
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

const buildMovementRows = ({
	movements_category_id,
	car_id,
	type,
	amount,
	description,
	closing_date,
}) => {
	const carsArray = Array.isArray(car_id) ? car_id : [car_id];

	if (carsArray.length === 0) {
		throw new FieldsRequiredError("Debe enviar al menos un car_id.");
	}

	const amountPerCar = Number((amount / carsArray.length).toFixed(2));

	return carsArray.map((id) => ({
		movements_id: generateUUID(),
		movements_category_id,
		car_id: id,
		type,
		amount: amountPerCar,
		description: description ?? null,
		closing_date,
	}));
};

export const InsertMovementService = async (movementData) => {
	const rows = buildMovementRows(movementData);
	await insertMovementsBulkModel(rows);

	return {
		message:
			rows.length > 1
				? `Movimiento dividido entre ${rows.length} autos correctamente`
				: "Movimiento registrado con éxito",
	};
};

export const UpdateMovementService = async (payload) => {
	const { movements_ids, ...data } = payload;

	const existing = await findMovementsByIdsModel(movements_ids);
	if (existing.length !== movements_ids.length) {
		throw new NotFoundError(
			"Algunos movements_ids enviados no existen en la base de datos.",
		);
	}

	const newRows = buildMovementRows(data);
	await replaceMovementsModel(movements_ids, newRows);

	return {
		message:
			newRows.length > 1
				? `Gasto actualizado y dividido entre ${newRows.length} autos`
				: "Gasto actualizado correctamente",
	};
};

export const DeleteMovementService = async ({ movements_ids }) => {
	const existing = await findMovementsByIdsModel(movements_ids);
	if (existing.length === 0) {
		throw new NotFoundError("Ningún movements_id existe en la base de datos.");
	}

	const result = await deleteMovementsModel(movements_ids);

	return {
		message: `Se eliminaron ${result.affectedRows} movimientos correctamente`,
		deleted: result.affectedRows,
	};
};
