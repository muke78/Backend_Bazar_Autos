import {
	listGetFullNameUserService,
	listProfileService,
} from "../services/users-services.js";

export const GetFullNameUser = async () => {
	const listGetFullNameUser = await listGetFullNameUserService();
	return listGetFullNameUser;
};

export const GetProfile = async (user_id) => {
	const listGetProfile = await listProfileService(user_id);
	return listGetProfile;
};
