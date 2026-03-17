import {
	getModelsByCarsService,
	postInsertCarService,
} from "../services/cars-services.js";

export const GetModelsByCars = async () => {
	const getModelsByCars = await getModelsByCarsService();
	return getModelsByCars;
};

export const InsertCar = async (carData) => {
	const postInsertCar = await postInsertCarService(carData);
	return postInsertCar;
};
