import {
	GetMovementCategoriesService,
	InsertMovementService,
} from "../services/expenses-services.js";

export const GetMovementCategories = async () => {
	const getMovementCategories = await GetMovementCategoriesService();
	return getMovementCategories;
};

export const InsertMovement = async (movementData) => {
	const insertMovement = await InsertMovementService(movementData);
	return insertMovement;
};
