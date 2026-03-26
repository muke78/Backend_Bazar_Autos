import {
	deleteUserService,
	insertUserService,
	listGetFullNameUserService,
	listProfileService,
	updateUserService,
} from "../services/users-services.js";

export const GetFullNameUser = async () => {
	const listGetFullNameUser = await listGetFullNameUserService();
	return listGetFullNameUser;
};

export const GetProfile = async (user_id) => {
	const listGetProfile = await listProfileService(user_id);
	return listGetProfile;
};

export const InsertUsers = async (user) => {
	const insertUsers = await insertUserService(user);
	return insertUsers;
};

export const UpdateUser = async (userId, userData) => {
	const updateUser = await updateUserService(userId, userData);
	return updateUser;
};

export const DeleteUser = async (userId) => {
	const deleteUser = await deleteUserService(userId);
	return deleteUser;
};