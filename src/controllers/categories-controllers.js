import {
	getAllCategoriesService,
	insertCategoryService,
	updateCategoryService,
	deleteCategoryService,
} from "../services/categories-services.js";

export const GetAllCategories = async () => {
	return await getAllCategoriesService();
};

export const InsertCategory = async (payload) => {
	return await insertCategoryService(payload);
};

export const UpdateCategory = async (categoryId, payload) => {
	return await updateCategoryService(categoryId, payload);
};

export const DeleteCategory = async (categoryId) => {
	return await deleteCategoryService(categoryId);
};
