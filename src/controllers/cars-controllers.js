import {
	getAllCarsService,
	getModelsByCarsService,
	getModelsInInventoryService,
	postInsertCarService,
	updateCarService,
} from "../services/cars-services.js";

export const GetAllCars = async (pagination, search) => {
	const cars = await getAllCarsService(pagination, search);
	return cars;
};

export const GetModelsByCars = async () => {
	const getModelsByCars = await getModelsByCarsService();
	return getModelsByCars;
};

export const GetModelsInInventory = async () => {
	const getModelsInInventory = await getModelsInInventoryService()
	return getModelsInInventory;
};

export const InsertCar = async (carData) => {
	const postInsertCar = await postInsertCarService(carData);
	return postInsertCar;
};

export const UpdateCar = async (carId, carData) => {
	const result = await updateCarService(carId, carData);
	return result;
};
