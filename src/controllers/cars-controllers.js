import {
	deleteCarService,
	getAllCarsService,
	getModelsByCarsService,
	getModelsInInventoryService,
	postInsertCarService,
	updateCarService,
} from "../services/cars-services.js";

export const GetAllCars = async (pagination, filters) => {
	return await getAllCarsService(pagination, filters);
};

export const GetModelsByCars = async () => {
	const getModelsByCars = await getModelsByCarsService();
	return getModelsByCars;
};

export const GetModelsInInventory = async () => {
	const getModelsInInventory = await getModelsInInventoryService();
	return getModelsInInventory;
};

export const InsertCar = async (carData) => {
	const postInsertCar = await postInsertCarService(carData);
	return postInsertCar;
};

export const UpdateCar = async (carId, carData) => {
	const updateCar = await updateCarService(carId, carData);
	return updateCar;
};

export const DeleteCar = async (carId) => {
	const deleteCar = await deleteCarService(carId);
	return deleteCar;
};
