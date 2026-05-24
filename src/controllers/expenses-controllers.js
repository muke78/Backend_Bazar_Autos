import {
	getAllExpensesService,
	InsertMovementService,
	UpdateMovementService,
	DeleteMovementService,
} from "../services/expenses-services.js";

export const GetAllExpenses = async (pagination, filters) => {
	return await getAllExpensesService(pagination, filters);
};

export const InsertMovement = async (movementData) => {
	return await InsertMovementService(movementData);
};

export const UpdateMovement = async (payload) => {
	return await UpdateMovementService(payload);
};

export const DeleteMovement = async (payload) => {
	return await DeleteMovementService(payload);
};
