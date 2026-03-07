import { listProfileModel } from "../models/users-models.js";

export const listProfileService = async (user_id) => {
	const result = await listProfileModel(user_id);
	return result;
};