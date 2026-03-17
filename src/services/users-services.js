import {
	listGetFullNameUserModels,
	listProfileModel,
} from "../models/users-models.js";
import { NotFoundError } from "../utils/error-utils.js";

export const listGetFullNameUserService = async () => {
	const names = await listGetFullNameUserModels();

	if (!names || names.length === 0) {
		throw new NotFoundError("No se encontraron usuarios registrados");
	}

	return names;
};

export const listProfileService = async (user_id) => {
	const result = await listProfileModel(user_id);
	return result;
};
