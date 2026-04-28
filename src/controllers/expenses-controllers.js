import {
	getAllExpensesService,
	GetMovementCategoriesService,
	InsertMovementService,
} from "../services/expenses-services.js";

export const GetAllExpenses = async (pagination, filters) => {
	return await getAllExpensesService(pagination, filters);
};

export const GetMovementCategories = async () => {
	const getMovementCategories = await GetMovementCategoriesService();
	return getMovementCategories;
};

export const InsertMovement = async (movementData) => {
	const insertMovement = await InsertMovementService(movementData);
	return insertMovement;
};
