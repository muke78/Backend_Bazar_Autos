import { generateUUID } from "../helpers/index.js";
import {
	getAllCategoriesModel,
	getCategoryByIdModel,
	getCategoryByNameModel,
	insertCategoryModel,
	updateCategoryModel,
	deleteCategoryModel,
	countMovementsByCategoryModel,
} from "../models/categories-models.js";
import {
	NotFoundError,
	ConflictError,
} from "../utils/error-utils.js";

export const getAllCategoriesService = async () => {
	const categories = await getAllCategoriesModel();

	if (!categories || categories.length === 0) {
		throw new NotFoundError("No se encontraron categorías registradas.");
	}

	return categories;
};

export const insertCategoryService = async ({ name, type }) => {
	const existing = await getCategoryByNameModel(name);
	if (existing.length > 0) {
		throw new ConflictError(`Ya existe una categoría con el nombre "${name}".`);
	}

	const categoryId = generateUUID();
	await insertCategoryModel(categoryId, name, type);

	return {
		message: "Categoría registrada con éxito",
		category: { category_id: categoryId, name, type },
	};
};

export const updateCategoryService = async (categoryId, payload) => {
	const category = await getCategoryByIdModel(categoryId);

	if (!category || category.length === 0) {
		throw new NotFoundError("No se encontró la categoría con el ID proporcionado.");
	}

	if (payload.name) {
		const duplicated = await getCategoryByNameModel(payload.name);
		const conflict = duplicated.find((c) => c.category_id !== categoryId);
		if (conflict) {
			throw new ConflictError(
				`Ya existe otra categoría con el nombre "${payload.name}".`,
			);
		}
	}

	await updateCategoryModel(categoryId, payload);

	return { message: "Categoría actualizada correctamente" };
};

export const deleteCategoryService = async (categoryId) => {
	const category = await getCategoryByIdModel(categoryId);

	if (!category || category.length === 0) {
		throw new NotFoundError("No se encontró la categoría con el ID proporcionado.");
	}

	const linkedMovements = await countMovementsByCategoryModel(categoryId);
	if (linkedMovements > 0) {
		throw new ConflictError(
			`No se puede eliminar la categoría porque tiene ${linkedMovements} movimientos asociados.`,
		);
	}

	await deleteCategoryModel(categoryId);

	return {
		message: `Categoría "${category[0].name}" eliminada correctamente`,
	};
};
